from fastapi import FastAPI
from routers import recipes, auth, comments, favorites, mealplans
import models
from database import engine

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

app.include_router(recipes.router)
app.include_router(auth.router)
app.include_router(comments.router, prefix='/recipes')
app.include_router(favorites.router)
app.include_router(mealplans.router)