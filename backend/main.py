from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import recipes, auth, comments, favorites, mealplans
import models
from database import engine

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

app.add_middleware(CORSMiddleware, allow_origins=[
        "http://localhost:3000",
        "https://frontend-production-babd.up.railway.app",
        "https://cookbook.stanislavmanolov.com"
    ], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(recipes.router)
app.include_router(auth.router)
app.include_router(comments.router, prefix='/recipes')
app.include_router(favorites.router)
app.include_router(mealplans.router)