from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from passlib.context import CryptContext
from jose import jwt
from typing import Optional
from pydantic import BaseModel
from backend.database import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your-secret-key"  # Should be stored in environment variables in production
ALGORITHM = "HS256"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(Enum("Male", "Female", "Other", name="gender_enum"), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")

    def set_password(self, password: str):
        """Hashes and sets the user's password"""
        self.password_hash = pwd_context.hash(password)

    def check_password(self, password: str) -> bool:
        """Verifies a plain text password against the stored hash"""
        return pwd_context.verify(password, self.password_hash)

    def generate_token(self, expires_delta: timedelta = None) -> str:
        """Generates a JWT token for the user"""
        if expires_delta is None:
            expires_delta = timedelta(hours=72)  # Default token expiration: 72 hours
        payload = {
            "sub": str(self.id),
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "exp": datetime.utcnow() + expires_delta,
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return token

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="tasks")
