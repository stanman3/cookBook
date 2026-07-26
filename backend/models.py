from database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String)
    username = Column(String, index=True)
    passwordHash = Column(String)

class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(Integer, primary_key=True, index=True)
    authorId = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, index=True)
    description = Column(String)
    cookingTime = Column(Integer)
    difficulty = Column(String)
    imageUrl = Column(String)
    createdAt = Column(DateTime)

class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(Integer, primary_key=True, index=True)
    recipeId = Column(Integer, ForeignKey("recipes.id"), index=True)
    name = Column(String)
    quantity = Column(Integer)

class FavoriteRecipe(Base):
    __tablename__ = 'favoriterecipes'

    userId = Column(Integer, ForeignKey("users.id"), primary_key=True)
    recipeId = Column(Integer, ForeignKey("recipes.id"), primary_key=True)

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, index=True)
    recipeId = Column(Integer, ForeignKey('recipes.id'), index=True)
    authorId = Column(Integer, ForeignKey('users.id'), index=True)
    content = Column(String)
    createdAt = Column(DateTime)

class MealPlan(Base):
    __tablename__ = 'mealplans'

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey('users.id'), index=True)
    date = Column(DateTime)
    recipeId = Column(Integer, ForeignKey('recipes.id'), index=True)
