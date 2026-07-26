from pydantic import BaseModel

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