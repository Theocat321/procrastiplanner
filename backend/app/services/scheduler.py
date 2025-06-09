# app/services/scheduler.py
from typing import List
from datetime import datetime, timedelta
from app.models import Task, ScheduleItem

DAY_START_HOUR = 9

def generate_procrastination_schedule(tasks: List[Task]) -> List[ScheduleItem]:
    """
    - Fixed tasks (flexible=False) are placed at their user-provided start.
    - Flexible tasks are reversed and scheduled after all fixed tasks,
      starting from DAY_START_HOUR or end of last fixed, whichever is later.
    """
    # Collect fixed tasks
    fixed = []
    latest_fixed_end = datetime.now().replace(hour=DAY_START_HOUR, minute=0, second=0, microsecond=0)
    for t in tasks:
        if not t.flexible:
            # parse the provided start
            start_dt = datetime.strptime(t.start, "%H:%M").replace(
                year=latest_fixed_end.year,
                month=latest_fixed_end.month,
                day=latest_fixed_end.day
            )
            end_dt = start_dt + timedelta(hours=t.length)
            fixed.append((t, start_dt, end_dt))
            if end_dt > latest_fixed_end:
                latest_fixed_end = end_dt

    # Prepare flexible tasks reversed
    flexible = [t for t in tasks if t.flexible][::-1]

    # Start pointer for flexible scheduling
    current = latest_fixed_end

    schedule: List[ScheduleItem] = []
    order = 1

    # Add fixed items in original order
    for t, start_dt, end_dt in fixed:
        schedule.append(
            ScheduleItem(
                name=t.name,
                start=start_dt.strftime("%H:%M"),
                end=end_dt.strftime("%H:%M"),
                length=t.length,
                location=t.location,
                intensity=t.intensity,
                flexible=False,
                order=order
            )
        )
        order += 1

    # Then flexible items
    for t in flexible:
        start_dt = current
        end_dt = start_dt + timedelta(hours=t.length)
        schedule.append(
            ScheduleItem(
                name=t.name,
                start=start_dt.strftime("%H:%M"),
                end=end_dt.strftime("%H:%M"),
                length=t.length,
                location=t.location,
                intensity=t.intensity,
                flexible=True,
                order=order
            )
        )
        current = end_dt
        order += 1

    return schedule
