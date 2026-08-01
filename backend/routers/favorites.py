from fastapi import APIRouter, HTTPException, Depends
from schemas import FavoriteRecipeCreate
import models
from auth import db_dependency, get_current_active_user

router = APIRouter()

@router.get('/favoriterecipes/')
async def get_favoriterecipes(db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    result = db.query(models.FavoriteRecipe).filter(models.FavoriteRecipe.userId == current_user.id).all()
    return result

@router.get('/favoriterecipes/{recipeId}')
async def get_favoriterecipe(recipeId: int, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    result = db.query(models.FavoriteRecipe).filter(models.FavoriteRecipe.userId == current_user.id, models.FavoriteRecipe.recipeId == recipeId).first()
    if not result:
        raise HTTPException(status_code=404, detail='Recipe not found')
    return result

@router.post('/favoriterecipes/')
async def add_favoriterecipe(recipe: FavoriteRecipeCreate, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    db_favoriterecipe = models.FavoriteRecipe(recipeId = recipe.recipeId, userId = current_user.id)
    db.add(db_favoriterecipe)
    db.commit()
    db.refresh(db_favoriterecipe)
    return db_favoriterecipe

@router.delete('/favoriterecipes/{recipeId}')
async def delete_favoriterecipe(recipeId: int, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    favoriterecipe = db.query(models.FavoriteRecipe).filter(models.FavoriteRecipe.userId == current_user.id, models.FavoriteRecipe.recipeId == recipeId).first()
    if not favoriterecipe:
        raise HTTPException(status_code=404, detail='Favorite recipe not found')
    db.delete(favoriterecipe)
    db.commit()
    return {"message": "favoriterecipe removed"}