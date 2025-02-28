from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # ID of the user making the booking
    event_id = Column(Integer, nullable=False)  # ID of the event being booked
    tickets = Column(Integer, nullable=False)  # Number of tickets booked
    status = Column(Enum("pending", "confirmed", "cancelled", name="booking_status"), default="pending")
