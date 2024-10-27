# app/events/crud.py
from sqlalchemy.orm import Session
from app.events.models import Event
from app.events.schemas import EventCreate

def create_event(db: Session, event: EventCreate):
    """Create new event"""
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_event_by_id(db: Session, event_id: int):
    """Get event by id"""
    return db.query(Event).filter(Event.id == event_id).first()

def update_event(db: Session, event_id: int, event_data: EventCreate):
    """Update event"""
    event = get_event_by_id(db, event_id)
    if event:
        for key, value in event_data.dict().items():
            setattr(event, key, value)
        db.commit()
        db.refresh(event)
    return event

def delete_event(db: Session, event_id: int):
    """Delete event"""
    event = get_event_by_id(db, event_id)
    if event:
        db.delete(event)
        db.commit()
        return True
    return False
