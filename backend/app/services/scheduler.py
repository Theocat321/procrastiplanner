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

    fixed_tasks = [task for task in tasks if task.flexible]
    flexible_tasks = [task for task in tasks if not task.flexible]

    # alternate between fixed and flexible tasks
    reordered_tasks = []
    while fixed_tasks or flexible_tasks:
        if fixed_tasks:
            reordered_tasks.append(fixed_tasks.pop(0))
        if flexible_tasks:
            reordered_tasks.append(flexible_tasks.pop(0))

    # maximise location switching by sorting tasks to alternate locations
    reordered_tasks.sort(key=lambda task: task.location)

    # computing start and end times for the tasks
    current_time = datetime.now().replace(hour=DAY_START_HOUR, minute=0, second=0, microsecond=0)
    scheduled = []
    for task in reordered_tasks:
        start_dt = current_time
        duration_td = timedelta(hours=task.time)
        end_dt = start_dt + duration_td

        scheduled.append(
            ScheduleItem(
                name=task.name,
                length=task.length,
                location=task.location,
                intensity=task.intensity,
                flexible=task.flexible,
                order=len(scheduled) + 1,
                start=start_dt.strftime("%H:%M"),
                end=end_dt.strftime("%H:%M")
            )
        )
        current_time = end_dt

    return scheduled
