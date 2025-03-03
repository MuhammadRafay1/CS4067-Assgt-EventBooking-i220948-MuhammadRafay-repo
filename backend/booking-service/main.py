from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware  
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import Booking
from routes import router  

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if your frontend has a different URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers (Authorization, Content-Type, etc.)
)

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Booking Service is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4003, reload=True)
