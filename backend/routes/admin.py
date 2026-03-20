from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
import models
from database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    try:
        return {
            "total_products": db.query(models.Product).count(),
            "total_appointments": db.query(models.Appointment).count(),
            "total_quotes": db.query(models.Quote).count()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/appointments")
def get_all_appointments(db: Session = Depends(get_db)):
    return db.query(models.Appointment).all()
