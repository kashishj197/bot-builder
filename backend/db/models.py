from datetime import datetime
from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(50), nullable=False)
    email = mapped_column(String(100), nullable=False)
    hashed_password = mapped_column(String(100), nullable=False)
    created_at = mapped_column(DateTime, default=datetime.utcnow)