from fastapi import APIRouter, Depends, HTTPException, status, Body
from datetime import datetime
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel

router = APIRouter()

class UserSignup(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: str
    gender: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        return {"error": "User already exists"}, status.HTTP_400_BAD_REQUEST

    try:
        dob = datetime.strptime(user_data.date_of_birth, "%Y-%m-%d").date()
    except ValueError:
        return {"error": "Invalid date format. Use YYYY-MM-DD"}, status.HTTP_400_BAD_REQUEST
    
    new_user = User( first_name=user_data.first_name, last_name=user_data.last_name,   date_of_birth=dob,  gender=user_data.gender,  email=user_data.email )
    new_user.set_password(user_data.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created", "user_id": new_user.id},status.HTTP_201_CREATED


@router.post("/login")
def login(login_data: UserLogin, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not user.check_password(login_data.password):
        return {"error": "Invalid credentials"}, status.HTTP_401_UNAUTHORIZED
    
    access_token = Authorize.create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}