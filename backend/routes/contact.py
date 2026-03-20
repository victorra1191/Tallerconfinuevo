from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import models
from database import get_db

router = APIRouter(prefix="/contact", tags=["contact"])

@router.post("/")
def send_message(message: models.ContactMessageCreate, db: Session = Depends(get_db)):
    try:
        new_msg = models.ContactMessage(**message.dict())
        db.add(new_msg)
        db.commit()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
