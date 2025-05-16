from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from utils.db import get_db
from utils.jwt import verify_token
from db.models import User
from schemas.user import UserCreate, UserLogin
import bcrypt
from datetime import datetime, timezone

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_user(user_data: UserCreate, db: Session):
    # Check if user exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise ValueError("Email already registered")

    # Hash password
    hashed_pw = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())

    # Create and save user
    user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_pw.decode('utf-8'),
        created_at=datetime.now(timezone.utc)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(user: UserLogin, db: Session):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise ValueError("Invalid email or password")

    # Verify password
    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise ValueError("Invalid email or password")

    return db_user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Decode the token and get user ID
    payload = verify_token(token)
    if not payload:
        raise ValueError("Invalid token")

    email = payload.get("sub")
    if not email:
        raise ValueError("Invalid token")

    # Fetch user from DB
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise ValueError("User not found")

    return db_user