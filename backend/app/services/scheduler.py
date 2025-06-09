# app/services/scheduler.py
from typing import List
from datetime import datetime, time, timedelta
from app.models import Task, ScheduleItem

DAY_START_HOUR = 9

def generate_procrastination_schedule(tasks: List[Task]) -> List[ScheduleItem]:
    """
    Build tomorrow’s “procrastination” schedule from 09:00,
    placing fixed tasks at their given times and filling gaps
    with flexible tasks in input order.
    """
    # split into fixed and flexible
    fixed_tasks = [t for t in tasks if not t.flexible and t.start]
    flexible_tasks = [t for t in tasks if t.flexible]

    # tomorrow’s date
    tomorrow = (datetime.now() + timedelta(days=1)).date()

    # build fixed task slots
    fixed_slots = []
    for t in fixed_tasks:
        h, m = map(int, t.start.split(':'))
        dt0 = datetime.combine(tomorrow, time(hour=h, minute=m))
        dt1 = dt0 + timedelta(hours=t.length)
        fixed_slots.append((dt0, dt1, t))
    fixed_slots.sort(key=lambda x: x[0])

    scheduled: List[ScheduleItem] = []
    order = 1
    current = datetime.combine(tomorrow, time(hour=DAY_START_HOUR))

    def _push(name, length_h, loc, intensity, flex_flag, dt0):
        nonlocal order, current
        dt1 = dt0 + timedelta(hours=length_h)
        scheduled.append(ScheduleItem(
            name=name,
            start=dt0.strftime("%H:%M"),
            end=dt1.strftime("%H:%M"),
            length=length_h,
            location=loc,
            intensity=intensity,
            flexible=flex_flag,
            order=order
        ))
        order += 1
        current = dt1
        return dt1

    # fill before & between fixed tasks
    for dt_fixed_start, dt_fixed_end, ft in fixed_slots:
        # fill gap up to this fixed
        while flexible_tasks and current < dt_fixed_start:
            task = flexible_tasks.pop(0)
            gap_hrs = (dt_fixed_start - current).total_seconds() / 3600
            part = min(task.length, gap_hrs)
            _push(task.name, part, task.location, task.intensity, True, current)
            # leftover
            if task.length > part:
                task.length -= part
                flexible_tasks.insert(0, task)
            if abs((current - dt_fixed_start).total_seconds()) < 1:
                break

        # schedule fixed
        _push(ft.name, ft.length, ft.location, ft.intensity, False, dt_fixed_start)
        # advance past fixed
        current = dt_fixed_end

    # after all fixed, schedule remaining flex
    while flexible_tasks:
        t = flexible_tasks.pop(0)
        _push(t.name, t.length, t.location, t.intensity, True, current)

    return scheduled
