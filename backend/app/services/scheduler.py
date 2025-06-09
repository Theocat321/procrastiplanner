# app/services/scheduler.py
from typing import List
from datetime import datetime, timedelta
from app.models import Task, ScheduleItem

DAY_START_HOUR = 9

def generate_procrastination_schedule(tasks: List[Task]) -> List[ScheduleItem]:
    """
    Reverse-input “procrastination” schedule, preserving intensity,
    and computing start/end times from 09:00 onward.
    """

    fixed_tasks = sorted(
    [task for task in tasks if task.flexible and task.start],  # Ensure `start` is not empty
    key=lambda t: datetime.strptime(t.start, "%H:%M")  # Parse `start` as datetime
    )
    flexible_tasks = [task for task in tasks if not task.flexible]
    # 9am tomorrow
    current_time = (datetime.now() + timedelta(days=1)).replace(hour=DAY_START_HOUR, minute=0, second=0, microsecond=0)
    scheduled = []

    for task in flexible_tasks:
        while task.length > 0:  # Handle interruptions for long flexible tasks
            # Check if fixed task interrupts current flexible task
            if fixed_tasks and fixed_tasks[0].start:  # Ensure `start` is not empty
                fixed_task_start = datetime.strptime(fixed_tasks[0].start, "%H:%M")
                if current_time >= fixed_task_start:
                    fixed_task = fixed_tasks.pop(0)
                    scheduled.append(ScheduleItem(
                        name=fixed_task.name,
                        length=fixed_task.length,
                        location=fixed_task.location,
                        intensity=fixed_task.intensity,
                        flexible=fixed_task.flexible,
                        order=len(scheduled) + 1,
                        start=fixed_task.start,  # Keep as string for ScheduleItem
                        end=(fixed_task_start + timedelta(hours=fixed_task.length)).strftime("%H:%M")
                    ))
                    current_time = fixed_task_start + timedelta(hours=fixed_task.length)
                else:
                    # Schedule part of flexible task until the next interruption
                    end_time = min(
                        current_time + timedelta(hours=task.length),
                        fixed_task_start if fixed_tasks else current_time + timedelta(hours=task.length)
                    )
                    duration = (end_time - current_time).total_seconds() / 3600
                    scheduled.append(ScheduleItem(
                        name=task.name,
                        length=duration,
                        location=task.location,
                        intensity=task.intensity,
                        flexible=task.flexible,
                        order=len(scheduled) + 1,
                        start=current_time.strftime("%H:%M"),
                        end=end_time.strftime("%H:%M")
                    ))
                    task.length -= duration  # Reduce remaining length of flexible task
                    current_time = end_time

    # Schedule remaining fixed tasks
    for task in fixed_tasks:
        if task.start:  # Ensure `start` is not empty
            fixed_task_start = datetime.strptime(task.start, "%H:%M")
            scheduled.append(ScheduleItem(
                name=task.name,
                length=task.length,
                location=task.location,
                intensity=task.intensity,
                flexible=task.flexible,
                order=len(scheduled) + 1,
                start=task.start,
                end=(fixed_task_start + timedelta(hours=task.length)).strftime("%H:%M")
            ))

    return scheduled