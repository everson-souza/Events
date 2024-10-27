from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

event_joiners = Table(
    'event_joiners', Base.metadata,
    Column('event_id', ForeignKey('events.id'), primary_key=True),
    Column('user_id', ForeignKey('users.id'), primary_key=True)
)

class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    organizer_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    duration = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    status = Column(Integer, nullable=False, default=1)
    organizer = relationship("User", back_populates="owned_events")
    joiners = relationship(
        "User", secondary=event_joiners, backref="joined_events"
    )

    def __repr__(self):
        return f"<Event(title={self.title}, organizer_id={self.organizer_id}, date={self.date}, location={self.location})>"