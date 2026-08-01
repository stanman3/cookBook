from fastapi import APIRouter, HTTPException
from schemas import CommentCreate
from auth import db_dependency
import models

router = APIRouter()

@router.get('/{recipeId}/comments/')
async def get_comments(recipeId: int, db: db_dependency):
    result = db.query(models.Comment).filter(models.Comment.recipeId == recipeId).all()
    return result

@router.post('/{recipeId}/comments/')
async def add_comment(recipeId: int, comment: CommentCreate, db: db_dependency):
    db_comment = models.Comment(recipeId = recipeId, authorId = 1, content = comment.content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete('/{recipeId}/comments/{id}')
async def delete_comment(recipeId: int, id: int, db: db_dependency):
    comment = db.query(models.Comment).filter(models.Comment.recipeId == recipeId, models.Comment.id == id).first()
    if not comment:
        raise HTTPException(status_code=404, detail='Comment not found')
    db.delete(comment)
    db.commit()
    return {"message": "Comment removed"}