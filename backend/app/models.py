# app/models.py
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator


class Intensity(str, Enum):
    Light  = "Light"
    Medium = "Medium"
    Deep   = "Deep"


class Task(BaseModel):
    name: str
    length: float = Field(..., gt=0, description="Duration in hours")
    location: str
    intensity: Intensity
    flexible: bool
    start: Optional[str] = Field(
        None,
        description="Required if `flexible` is false, format HH:MM"
    )

    @model_validator(mode="after")
    def require_start_if_fixed(cls, model):
        if not model.flexible and not model.start:
            raise ValueError("Fixed tasks must include `start` in HH:MM")
        return model


class ScheduleItem(BaseModel):
    name: str
    start: str    # HH:MM
    end:   str    # HH:MM
    length: float
    location: str
    intensity: Intensity
    flexible: bool
    order:    int


class ScheduleRequest(BaseModel):
    tasks: List[Task]


class ScheduleResponse(BaseModel):
    schedule: List[ScheduleItem]
