from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # Relationship to the Event model where a user is the organizer of multiple events
    owned_events = relationship("Event", back_populates="organizer", foreign_keys="[Event.organizer_id]")

    def __repr__(self):
        return f"<User(name={self.name}, email={self.email})>"