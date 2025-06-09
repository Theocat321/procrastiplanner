from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models import ScheduleRequest, ScheduleResponse, Task
from app.services.openai_scheduler import schedule_with_chatgpt

router = APIRouter(prefix="/schedule", tags=["schedule"])

@router.post(
    "/",
    response_model=ScheduleResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate least‐optimal (procrastination) schedule via ChatGPT",
)
async def make_schedule(req: ScheduleRequest):
    if not req.tasks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No tasks provided."
        )

    # Forward your tasks to ChatGPT and get back ScheduleItem list
    tasks: List[Task] = req.tasks
    schedule_items = schedule_with_chatgpt([t.dict() for t in tasks])
    return ScheduleResponse(schedule=schedule_items)
