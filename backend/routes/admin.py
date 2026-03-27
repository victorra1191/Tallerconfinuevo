from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import models
import hashlib
from database import get_db
from pydantic import BaseModel

# El prefijo /admin es interno. No se debe repetir en el server.py
router = APIRouter(prefix="/admin", tags=["admin"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # Buscamos en la tabla admin_users
    admin = db.query(models.AdminUser).filter(models.AdminUser.username == data.username).first()
    
    if not admin:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    # Hasheo compatible con tu base de datos (SHA-256)
    hashed_input = hashlib.sha256(data.password.encode()).hexdigest()
    
    if hashed_input != admin.password:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {
        "status": "success",
        "user": {
            "username": admin.username,
            "full_name": admin.full_name,
            "role": admin.role
        }
    }

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "total_products": db.query(models.Product).count(),
        "total_appointments": db.query(models.Appointment).count(),
        "total_quotes": db.query(models.Quote).count()
    }
