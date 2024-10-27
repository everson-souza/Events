# app/users/schemas.py
from pydantic import BaseModel, EmailStr

# Input Schema for creating a user
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# Output Schema for returning user data in responses
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True  # To tell Pydantic to interact with SQLAlchemy models
