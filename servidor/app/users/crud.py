from sqlalchemy.orm import Session
from app.users.models import User
from app.users.schemas import UserCreate, UserResponse

def create_user(db: Session, user: UserCreate):
    """Create new user"""
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_name(db: Session, name: str):
    """Get user by name"""
    return db.query(User).filter(User.name == name).first()
    
def get_user_by_id(db: Session, user_id: int):
    """Get user by id"""
    return db.query(User).filter(User.id == user_id).first()

def delete_user(db: Session, user_id: int):
    """Delete user"""
    db_user = get_user_by_id(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False
