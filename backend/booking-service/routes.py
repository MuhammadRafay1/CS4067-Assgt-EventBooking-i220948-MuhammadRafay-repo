import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Booking
from pydantic import BaseModel
from middleware.authMiddleware import authenticate_user  # Import JWT authentication

router = APIRouter()

class BookingRequest(BaseModel):
    event_id: int
    tickets: int

def check_event_exists(event_id: int):
    event_service_url = f"http://localhost:4002/events/{event_id}"
    response = requests.get(event_service_url)
    if response.status_code == 200:
        return response.json()  # Event exists
    raise HTTPException(status_code=404, detail="Event not found")  # Event doesn't exist

@router.post("/bookings/")
def create_booking(request: BookingRequest, db: Session = Depends(get_db), user_id: int = Depends(authenticate_user)):
    event_data = check_event_exists(request.event_id)
    new_booking = Booking(user_id=user_id, event_id=request.event_id, tickets=request.tickets)
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return {"message": "Booking created", "event": event_data, "booking": new_booking}


@router.get("/bookings/")
def get_bookings(db: Session = Depends(get_db), user_id: int = Depends(authenticate_user)):
    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()
    return bookings

@router.get("/bookings/{booking_id}")
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return {"message": "Booking not found"}
    return booking


@router.patch("/bookings/{booking_id}")
def update_booking(booking_id: int, status: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return {"message": "Booking not found"}
    
    if status not in ["confirmed", "cancelled"]:
        return {"message": "Invalid status update"}
    
    booking.status = status
    db.commit()
    return {"message": "Booking updated successfully", "booking": booking}


@router.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return {"message": "Booking not found"}
    
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted successfully"}
