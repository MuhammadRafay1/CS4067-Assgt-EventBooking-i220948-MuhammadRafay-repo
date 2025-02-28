import jwt
from fastapi import Request, HTTPException, Depends
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET = "f4d16fd7"  # Use the same secret as in User Service

def authenticate_user(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token missing or invalid format")

    try:
        token = auth_header.split(" ")[1]  # Extract actual token after "Bearer"
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return decoded["id"]  # Return user ID from token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
