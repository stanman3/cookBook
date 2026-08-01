from fastapi import APIRouter, HTTPException
from schemas import FavoriteRecipeCreate, FavoriteRecipeResponse
import models
from auth import db_dependency

router = APIRouter()

@router.get('/favoriterecipes/')
async def get_favoriterecipes(db: db_dependency):
    result = db.query(models.FavoriteRecipe).filter(models.FavoriteRecipe.userId == 1).all()
    return result

@router.get('/favoriterecipes/{recipeId}')
async def get_favoriterecipe(recipeId: int, db: db_dependency):
    result = db.query(models.FavoriteRecipe).filter(models.FavoriteRecipe.userId == 1, models.FavoriteRecipe.recipeId == recipeId).first()
    if not result:
        raise HTTPException(status_code=404, detail='Recipe not found')
    return result

@router.post('/favoriterecipes/')
async def add_favoriterecipe(recipe: FavoriteRecipeCreate, db: db_dependency):
    db_favoriterecipe = models.FavoriteRecipe(recipeId = recipe.recipeId, userId = 1)
    db.add(db_favoriterecipe)
    db.commit()
    db.refresh(db_favoriterecipe)
    return db_favoriterecipe

@router.delete('/favoriterecipes/{recipeId}')
async def delete_favoriterecipe(recipeId: int, db: db_dependency):
    favoriterecipe = db.query(models.FavoriteRecipe).filter(models.FavoriteRecipe.recipeId == recipeId).first()
    if not favoriterecipe:
        raise HTTPException(status_code=404, detail='Favorite recipe not found')
    db.delete(favoriterecipe)
    db.commit()
    return {"message": "favoriterecipe removed"}