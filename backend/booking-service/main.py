from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import Booking
from routes import router  

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(router)
@app.get("/")
def read_root():
    return {"message": "Booking Service is running!"}
