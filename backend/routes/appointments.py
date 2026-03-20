from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import models
from database import get_db

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("/")
def create_appointment(appointment: models.AppointmentCreate, db: Session = Depends(get_db)):
    try:
        new_app = models.Appointment(
            customer_name=appointment.customer_name,
            email=appointment.email,
            phone=appointment.phone,
            service_id=appointment.service_id,
            appointment_date=appointment.appointment_date
        )
        db.add(new_app)
        db.commit()
        db.refresh(new_app)
        return {"status": "success", "id": new_app.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_all_appointments(db: Session = Depends(get_db)):
    return db.query(models.Appointment).all()
