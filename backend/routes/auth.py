from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from utils.db import get_db
from utils.jwt import create_access_token
from db.database import SessionLocal
from schemas.user import UserCreate, UserLogin
from services.auth import authenticate_user, create_user

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        new_user = create_user(user, db)
        return {"message": "User registered successfully", "user_id": new_user.id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        # Implement login logic here
        db_user = authenticate_user(user, db)
        if db_user:
            # Generate JWT token
            token = create_access_token(data={"sub": db_user.email})
            return {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "id": db_user.id,
                    "email": db_user.email,
                    "name": db_user.name
                }
            }
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))