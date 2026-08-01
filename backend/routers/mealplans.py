from fastapi import APIRouter, HTTPException, Depends
import models
from auth import db_dependency, get_current_active_user
from schemas import MealPlanCreate

router = APIRouter()

@router.get('/mealplans/')
async def get_mealplans(db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    result = db.query(models.MealPlan).filter(models.MealPlan.userId == current_user.id).all()
    return result

@router.get('/mealplans/{id}')
async def get_mealplan(id: int, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    mealplan = db.query(models.MealPlan).filter(models.MealPlan.userId == current_user.id, models.MealPlan.id == id).first()
    if not mealplan:
        raise HTTPException(status_code=404, detail='Meal plan not found')
    return mealplan

@router.post('/mealplans/')
async def add_mealplan(mealplan: MealPlanCreate, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    db_mealplan = models.MealPlan(userId = current_user.id, date = mealplan.date, recipeId = mealplan.recipeId)
    db.add(db_mealplan)
    db.commit()
    db.refresh(db_mealplan)
    return db_mealplan

@router.put('/mealplans/{id}')
async def update_mealplan(id: int, updated_mealplan: MealPlanCreate, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    mealplan = db.query(models.MealPlan).filter(models.MealPlan.userId == current_user.id, models.MealPlan.id == id).first()
    if not mealplan:
        raise HTTPException(status_code=404, detail='Meal plan not found')
    mealplan.recipeId = updated_mealplan.recipeId # pyright: ignore[reportAttributeAccessIssue, reportUndefinedVariable]
    mealplan.date = updated_mealplan.date # pyright: ignore[reportAttributeAccessIssue, reportUndefinedVariable]
    db.commit()
    db.refresh(mealplan)
    return mealplan

@router.delete('/mealplans/{id}')
async def delete_mealplan(id: int, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    mealplan = db.query(models.MealPlan).filter(models.MealPlan.userId == current_user.id, models.MealPlan.id == id).first()
    if not mealplan:
        raise HTTPException(status_code=404, detail='Meal plan not found')
    db.delete(mealplan)
    db.commit()
    return {"message": "Meal plan removed"}