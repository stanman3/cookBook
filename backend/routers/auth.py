from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
import models
from auth import db_dependency, get_password_hash, authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from schemas import UserCreate, TokenData
from datetime import timedelta

router = APIRouter()

@router.post('/register/')
async def register(user: UserCreate, db: db_dependency): # pyright: ignore[reportGeneralTypeIssues]
    db_user = models.User(email = user.email, username = user.username, passwordHash = get_password_hash(user.password)) # pyright: ignore[reportCallIssue]
    db.add(db_user) # pyright: ignore[reportAttributeAccessIssue]
    db.commit() # pyright: ignore[reportAttributeAccessIssue]
    db.refresh(db_user) # pyright: ignore[reportAttributeAccessIssue]
    return db_user

@router.post('/token/')
async def login(db: db_dependency, form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail='could not auth user')
    token = create_access_token({"sub": user.username}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}