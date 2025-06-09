from fastapi import APIRouter, HTTPException, status
from app.models import ScheduleRequest, ScheduleResponse
from app.services.scheduler import generate_procrastination_schedule

router = APIRouter(prefix="/schedule", tags=["schedule"])

@router.post(
    "/",
    response_model=ScheduleResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate least-optimal (procrastination) schedule",
)
async def make_schedule(req: ScheduleRequest):
    if not req.tasks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No tasks provided."
        )
    schedule = generate_procrastination_schedule(req.tasks)
    return ScheduleResponse(schedule=schedule)
