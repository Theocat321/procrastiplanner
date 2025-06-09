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
    base_date = datetime.now().replace(hour=DAY_START_HOUR, minute=0, second=0, microsecond=0)
    current = base_date
    scheduled = []
    for i, task in enumerate(reversed(tasks), start=1):
        start_dt = current
        duration_td = timedelta(hours=task.time)
        end_dt = start_dt + duration_td

        scheduled.append(
            ScheduleItem(
                name=task.name,
                time=task.time,
                location=task.location,
                intensity=task.intensity,
                order=i,
                start=start_dt.strftime("%H:%M"),
                end=end_dt.strftime("%H:%M")
            )
        )
        current = end_dt

    return scheduled
