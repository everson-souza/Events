
from fastapi import APIRouter, Depends, HTTPException, WebSocket
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.events.models import Event
from app.events import crud, schemas
from app.users.models import User
from app.database import get_db
from app.websockets import websocket_manager

router = APIRouter()

# Create event
@router.post("/events/", response_model=schemas.EventResponse)
async def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    created_event = crud.create_event(db=db, event=event)
    await websocket_manager.broadcast(f"New event: {created_event.title}")
    return created_event

# Get event by id
@router.get("/events/{event_id}", response_model=schemas.EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event_by_id(db=db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

# Get events
@router.get("/events/", response_model=list[schemas.EventResponse])
def get_events(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    events = db.query(Event).options(
        joinedload(Event.organizer),
        joinedload(Event.joiners)
    ).filter(Event.status != 2).all()
    return events

# Delete event
@router.delete("/events/{event_id}", response_model=dict)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    success = crud.delete_event(db=db, event_id=event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

# Edit event
@router.put("/events/{event_id}", response_model=schemas.EventResponse)
async def update_event(event_id: int, event: schemas.EventCreate, db: Session = Depends(get_db)):
    updated_event = crud.update_event(db, event_id, event)
    await websocket_manager.broadcast(f"Event updated: {updated_event.title}")    
    return updated_event

# Join event
@router.post("/events/{event_id}/join")
async def join_event(event_id: int, user_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    user = db.query(User).filter(User.id == user_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Add user to the list of joiners
    if user in event.joiners:
        raise HTTPException(status_code=400, detail="User already joined")
    
    event.joiners.append(user)
    db.commit()
    await websocket_manager.broadcast(f"Event joined: {event.title}")
    return {"message": "User added to the event"}

# Remove self from event
@router.post("/events/{event_id}/remove")
async def join_event(event_id: int, user_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    user = db.query(User).filter(User.id == user_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Add user to the list of joiners
    if user not in event.joiners:
        raise HTTPException(status_code=400, detail="User hasn't joined")
    
    event.joiners.remove(user)
    db.commit()
    await websocket_manager.broadcast(f"Event removed: {event.title}")

    return {"message": "User removed from event"}