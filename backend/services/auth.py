from sqlalchemy.orm import Session
from db.models import User
from schemas.user import UserCreate
import bcrypt
from datetime import datetime

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
        created_at=datetime.now(datetime.timezone.utc)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
