from typing import List
from app.models import Task, ScheduleItem

def generate_procrastination_schedule(tasks: List[Task]) -> List[ScheduleItem]:
    """
    A toy “procrastination” algorithm:
    - Reverse input order
    - Assign an `order` index
    - (You can expand this to call external OpenAPI endpoints here)
    """
    reversed_tasks = list(reversed(tasks))
    scheduled = [
        ScheduleItem(
            name=task.name,
            time=task.time,
            location=task.location,
            order=i + 1
        )
        for i, task in enumerate(reversed_tasks)
    ]
    return scheduled
