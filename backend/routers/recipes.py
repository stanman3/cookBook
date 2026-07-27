from fastapi import APIRouter, HTTPException, Depends
from database import SessionLocal, engine
from sqlalchemy.orm import Session
import models
from typing import Annotated
from schemas import RecipeCreate, RecipeResponse

router = APIRouter()
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.get('/recipes/')
async def get_recipes(db: db_dependency):
    result = db.query(models.Recipe).all()
    return result

