import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Booking
from pydantic import BaseModel
from middleware.authMiddleware import authenticate_user  # Import JWT authentication
import requests
router = APIRouter()

EVENT_SERVICE_URL = "http://localhost:4002/events"
NOTIFICATION_SERVICE_URL = "http://localhost:4004/notify"

class BookingRequest(BaseModel):
    event_id: int
    tickets: int

async def check_event_exists(event_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{EVENT_SERVICE_URL}/{event_id}")
        if response.status_code == 200:
            return response.json()
        raise HTTPException(status_code=404, detail="Event not found") 


@router.post("/bookings/")
def create_booking(request: BookingRequest, db: Session = Depends(get_db), user_id: int = Depends(authenticate_user)):
    event_data = check_event_exists(request.event_id)

    new_booking = Booking(user_id=user_id, event_id=request.event_id, tickets=request.tickets)
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    user_email = "user@example.com"  # Fetch this from the User Service
    requests.post(NOTIFICATION_SERVICE_URL, json={
        "user_id": user_id,
        "event_id": request.event_id,
        "message": "Your booking is confirmed!",
        "email": user_email
    })

    return {"message": "Booking created", "booking": new_booking}

@router.get("/bookings/")
def get_bookings(db: Session = Depends(get_db), user_id: int = Depends(authenticate_user)):
    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()
    return bookings

@router.get("/bookings/{booking_id}")
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.patch("/bookings/{booking_id}")
def update_booking(booking_id: int, status: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if status not in ["confirmed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status update")
    
    booking.status = status
    db.commit()
    return {"message": "Booking updated successfully", "booking": booking}

@router.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted successfully"}
