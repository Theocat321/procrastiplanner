from pydantic import BaseModel, Field
from typing import List

class Task(BaseModel):
    name: str = Field(..., example="Write report")
    time: float = Field(..., gt=0, example=1.5, description="Duration in hours")
    location: str = Field(..., example="Home")

class ScheduleItem(BaseModel):
    name: str
    time: float
    location: str
    order: int

class ScheduleRequest(BaseModel):
    tasks: List[Task]

class ScheduleResponse(BaseModel):
    schedule: List[ScheduleItem]
