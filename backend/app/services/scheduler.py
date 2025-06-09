# app/services/scheduler.py
from typing import List
from datetime import datetime, date, time, timedelta
from app.models import Task, ScheduleItem

DAY_START_HOUR = 9

def generate_procrastination_schedule(tasks: List[Task]) -> List[ScheduleItem]:
    """
    Build a “procrastination” schedule for tomorrow starting at 09:00,
    placing fixed tasks at their given times and filling remaining gaps
    with flexible tasks in input order. Flexible tasks may be split
    if they don't fit entirely in a given gap.
    """

    # Split tasks
    fixed_tasks = [t for t in tasks if not t.flexible and t.start]
    flexible_tasks = [t for t in tasks if t.flexible]

    # Determine tomorrow's date
    tomorrow = (datetime.now() + timedelta(days=1)).date()

    # Parse fixed task start datetimes and sort
    fixed_schedule = []
    for t in fixed_tasks:
        h, m = map(int, t.start.split(':'))
        dt_start = datetime.combine(tomorrow, time(hour=h, minute=m))
        dt_end = dt_start + timedelta(hours=t.length)
        fixed_schedule.append((dt_start, dt_end, t))
    fixed_schedule.sort(key=lambda x: x[0])

    scheduled: List[ScheduleItem] = []
    order = 1

    # Initialize current pointer at tomorrow 09:00
    current = datetime.combine(tomorrow, time(hour=DAY_START_HOUR))

    # Helper to schedule a block
    def _push(name, length_h, location, intensity, flexible, dt_start):
        nonlocal order
        dt_end = dt_start + timedelta(hours=length_h)
        scheduled.append(ScheduleItem(
            name=name,
            length=length_h,
            location=location,
            intensity=intensity,
            flexible=flexible,
            order=order,
            start=dt_start.strftime("%H:%M"),
            end=dt_end.strftime("%H:%M")
        ))
        order += 1
        return dt_end

    # Step through fixed tasks, filling gaps with flexible
    for dt_fixed_start, dt_fixed_end, ft in fixed_schedule:
        # Fill gap [current, dt_fixed_start)
        while flexible_tasks and current < dt_fixed_start:
            task = flexible_tasks.pop(0)
            remaining = task.length
            gap = (dt_fixed_start - current).total_seconds() / 3600.0
            take = min(remaining, gap)
            current = _push(
                name=task.name,
                length_h=take,
                location=task.location,
                intensity=task.intensity,
                flexible=task.flexible,
                dt_start=current
            )
            if remaining > take:
                # put back the leftover portion
                task.length = remaining - take
                flexible_tasks.insert(0, task)
            # if we exactly hit fixed start, break to schedule fixed
            if abs((dt_fixed_start - current).total_seconds()) < 1:
                break

        # Schedule the fixed task
        current = _push(
            name=ft.name,
            length_h=ft.length,
            location=ft.location,
            intensity=ft.intensity,
            flexible=ft.flexible,
            dt_start=dt_fixed_start
        )
        # advance current past fixed task
        current = dt_fixed_end

    # After all fixed, schedule remaining flexible tasks consecutively
    while flexible_tasks:
        task = flexible_tasks.pop(0)
        current = _push(
            name=task.name,
            length_h=task.length,
            location=task.location,
            intensity=task.intensity,
            flexible=task.flexible,
            dt_start=current
        )

    return scheduled
