# app/models.py
from pydantic import BaseModel, Field, root_validator
from typing import List, Optional
from enum import Enum
import re

class Intensity(str, Enum):
    Light = "Light"
    Medium = "Medium"
    Deep = "Deep"

class Task(BaseModel):
    name: str
    start: Optional[str] = Field(None, description="HH:MM only if not flexible")
    length: float = Field(..., gt=0, description="Duration in hours")
    location: str
    intensity: Intensity
    flexible: bool = Field(False)

    def check_fixed_start(cls, values):
        flexible = values.get("flexible")
        start = values.get("start")
        if not flexible:
            if not start or not re.match(r"^\d{2}:\d{2}$", start):
                raise ValueError("Fixed tasks must include start in HH:MM")
        return values

class ScheduleItem(BaseModel):
    name: str
    start: str    # actual scheduled start HH:MM
    end: str      # scheduled end HH:MM
    length: float
    location: str
    intensity: Intensity
    flexible: bool
    order: int

class ScheduleRequest(BaseModel):
    tasks: List[Task]

class ScheduleResponse(BaseModel):
    schedule: List[ScheduleItem]
