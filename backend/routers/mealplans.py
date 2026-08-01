from fastapi import APIRouter, HTTPException
import models
from auth import db_dependency
from datetime import datetime
from schemas import MealPlanCreate

router = APIRouter()

@router.get('/mealplans/')
async def get_mealplans(db: db_dependency):
    result = db.query(models.MealPlan).filter(models.MealPlan.userId == 1).all()
    return result

@router.get('/mealplans/{id}')
async def get_mealplan(id: int, db: db_dependency):
    mealplan = db.query(models.MealPlan).filter(models.MealPlan.userId == 1, models.MealPlan.id == id).first()
    if not mealplan:
        raise HTTPException(status_code=404, detail='Meal plan not found')
    return mealplan

@router.post('/mealplans/')
async def add_mealplan(mealplan: MealPlanCreate, db: db_dependency):
    db_mealplan = models.MealPlan(userId = 1, date = mealplan.date, recipeId = mealplan.recipeId)
    db.add(db_mealplan)
    db.commit()
    db.refresh(db_mealplan)
    return db_mealplan

@router.put('/mealplans/{id}')
async def update_mealplan(id: int, updated_mealplan: MealPlanCreate, db: db_dependency):
    mealplan = db.query(models.MealPlan).filter(models.MealPlan.userId == 1, models.MealPlan.id == id).first()
    if not mealplan:
        raise HTTPException(status_code=404, detail='Meal plan not found')
    mealplan.recipeId = updated_mealplan.recipeId # pyright: ignore[reportAttributeAccessIssue, reportUndefinedVariable]
    mealplan.date = updated_mealplan.date # pyright: ignore[reportAttributeAccessIssue, reportUndefinedVariable]
    db.commit()
    db.refresh(mealplan)
    return mealplan

@router.delete('/mealplans/{id}')
async def delete_mealplan(id: int, db: db_dependency):
    mealplan = db.query(models.MealPlan).filter(models.MealPlan.userId == 1, models.MealPlan.id == id).first()
    if not mealplan:
        raise HTTPException(status_code=404, detail='Meal plan not found')
    db.delete(mealplan)
    db.commit()
    return {"message": "Meal plan removed"}