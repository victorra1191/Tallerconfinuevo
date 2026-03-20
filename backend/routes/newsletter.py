from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import models
from database import get_db

router = APIRouter(prefix="/newsletter", tags=["newsletter"])

@router.post("/subscribe")
def subscribe(email_data: models.NewsletterSubscribe, db: Session = Depends(get_db)):
    existing = db.query(models.Newsletter).filter(models.Newsletter.email == email_data.email).first()
    if existing:
        return {"message": "Ya estás suscrito"}
    
    new_sub = models.Newsletter(email=email_data.email)
    db.add(new_sub)
    db.commit()
    return {"message": "Suscripción exitosa"}
