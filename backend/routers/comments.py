from fastapi import APIRouter, HTTPException, Depends
from schemas import CommentCreate
from auth import db_dependency, get_current_active_user
import models

router = APIRouter()

@router.get('/{recipeId}/comments/')
async def get_comments(recipeId: int, db: db_dependency):
    result = db.query(models.Comment).filter(models.Comment.recipeId == recipeId).all()
    return result

@router.post('/{recipeId}/comments/')
async def add_comment(recipeId: int, comment: CommentCreate, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    db_comment = models.Comment(recipeId = recipeId, authorId = current_user.id, content = comment.content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete('/{recipeId}/comments/{id}')
async def delete_comment(recipeId: int, id: int, db: db_dependency, current_user: models.User = Depends(get_current_active_user)):
    comment = db.query(models.Comment).filter(models.Comment.authorId == current_user.id, models.Comment.recipeId == recipeId, models.Comment.id == id).first()
    if not comment:
        raise HTTPException(status_code=404, detail='Comment not found')
    db.delete(comment)
    db.commit()
    return {"message": "Comment removed"}