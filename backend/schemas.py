from pydantic import BaseModel
from datetime import datetime

class TokenData(BaseModel):
    username: str | None = None

class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        from_attributes = True

class RecipeCreate(BaseModel):
    title: str
    description: str
    cookingTime: int
    difficulty: str
    imageUrl: str

class RecipeResponse(BaseModel):
    id: int
    title: str
    description: str
    cookingTime: int
    difficulty: str
    imageUrl: str

    class Config:
        from_attributes = True

class IngredientCreate(BaseModel):
    name: str
    quantity: int

class IngredientResponse(BaseModel):
    id: int
    recipeId: int
    name: str
    quantity: str

    class Config:
        from_attributes = True

class FavoriteRecipeCreate(BaseModel):
    recipeId: int

class FavoriteRecipeResponse(BaseModel):
    userId: int
    recipeId: int

    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    recipeId: int
    content: str

class CommentResponse(BaseModel):
    id: int
    recipeId: int
    authorId: int
    content: str
    createdAt: datetime

    class Config:
        from_attributes = True

class MealPlanCreate(BaseModel):
    recipeId: int
    date: datetime

class MealPlanResponse(BaseModel):
    id: int
    userId: int
    recipeId: int
    date: datetime

    class Config:
        from_attributes = True