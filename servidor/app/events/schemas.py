from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.users.schemas import UserResponse

# Create / edit event schema
class EventCreate(BaseModel):
    title: str
    description: str
    organizer_id: int
    date: datetime
    duration: int
    location: str
    status: int

# Event response schema
class EventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    date: datetime
    organizer_id: int
    duration: int
    location: str
    status: int
    organizer: UserResponse
    joiners: List[UserResponse]

    class Config:
        orm_mode = True
