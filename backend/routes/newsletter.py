from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import models
from database import get_db

router = APIRouter(prefix="/newsletter", tags=["newsletter"])

@router.post("/subscribe")
def subscribe(data: models.NewsletterSubscribe, db: Session = Depends(get_db)):
    existing = db.query(models.Newsletter).filter(models.Newsletter.email == data.email).first()
    if existing:
        return {"message": "Ya registrado"}
    
    new_sub = models.Newsletter(email=data.email)
    db.add(new_sub)
    db.commit()
    return {"status": "success"}
