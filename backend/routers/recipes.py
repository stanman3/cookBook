from fastapi import APIRouter, HTTPException, Depends
import models
from schemas import RecipeCreate
from auth import db_dependency, get_current_active_user

router = APIRouter()

@router.get('/recipes/')
async def get_recipes(db: db_dependency):
    result = db.query(models.Recipe).all()
    return result

@router.post('/recipes/')
async def add_recipe(recipe: RecipeCreate, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    db_recipe = models.Recipe(authorId = current_user.id, title = recipe.title, description = recipe.description, cookingTime = recipe.cookingTime, difficulty = recipe.difficulty, imageUrl = recipe.imageUrl)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.get('/recipes/{id}')
async def get_recipe(id: int, db: db_dependency):
    result = db.query(models.Recipe).filter(models.Recipe.id == id).first()
    if not result:
        raise HTTPException(status_code=404, detail='Recipe not found')
    return result

@router.put('/recipes/{id}')
async def update_recipe(id: int, updated: RecipeCreate, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    recipe = db.query(models.Recipe).filter(models.Recipe.authorId == current_user.id, models.Recipe.id == id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail='Recipe not found')
    recipe.title = updated.title  # pyright: ignore[reportAttributeAccessIssue]
    recipe.description = updated.description  # pyright: ignore[reportAttributeAccessIssue]
    recipe.cookingTime = updated.cookingTime  # pyright: ignore[reportAttributeAccessIssue]
    recipe.difficulty = updated.difficulty  # pyright: ignore[reportAttributeAccessIssue]
    recipe.imageUrl = updated.imageUrl  # pyright: ignore[reportAttributeAccessIssue]
    db.commit()
    db.refresh(recipe)
    return recipe

@router.delete('/recipes/{id}')
async def delete_recipe(id: int, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    recipe = db.query(models.Recipe).filter(models.Recipe.authorId == current_user.id, models.Recipe.id == id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail='Recipe not found')
    db.delete(recipe)
    db.commit()
    return {"message": "Recipe deleted successfully"}