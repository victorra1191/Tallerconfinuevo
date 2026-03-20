from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import models
from database import get_db

router = APIRouter(prefix="/blog", tags=["blog"])

@router.get("/")
def get_posts(db: Session = Depends(get_db)):
    try:
        return db.query(models.BlogPost).order_by(models.BlogPost.date.desc()).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    return post
