# app/models.py
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class Intensity(str, Enum):
    Light = "Light"
    Medium = "Medium"
    Deep = "Deep"

class Task(BaseModel):
    name: str = Field(..., example="Write report")
    time: float = Field(..., gt=0, example=1.5, description="Duration in hours")
    location: str = Field(..., example="Home")
    intensity: Intensity = Field(..., example=Intensity.Medium)

class ScheduleItem(BaseModel):
    name: str
    time: float
    location: str
    intensity: Intensity
    order: int
    start: str  # e.g. "09:00"
    end: str

class ScheduleRequest(BaseModel):
    tasks: List[Task]

class ScheduleResponse(BaseModel):
    schedule: List[ScheduleItem]
