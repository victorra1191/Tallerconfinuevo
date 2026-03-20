from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import models
from database import get_db

router = APIRouter(prefix="/services", tags=["services"])

@router.get("/")
def get_all_services(db: Session = Depends(get_db)):
    try:
        # Recupera los servicios de la tabla en Neon
        return db.query(models.Service).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{service_id}")
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Service not found")
    return service
