from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import models
from database import get_db
from datetime import datetime

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("/")
def create_appointment(appointment: models.AppointmentCreate, db: Session = Depends(get_db)):
    try:
        new_app = models.Appointment(
            customer_name=appointment.customer_name,
            email=appointment.email,
            phone=appointment.phone,
            service_id=appointment.service_id,
            appointment_date=appointment.appointment_date,
            status="pending"
        )
        db.add(new_app)
        db.commit()
        db.refresh(new_app)
        return new_app
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
