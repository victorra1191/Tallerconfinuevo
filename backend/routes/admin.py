from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
import models
import hashlib
from database import get_db
from pydantic import BaseModel

# Definición del router con el prefijo que espera el servidor
router = APIRouter(prefix="/admin", tags=["admin"])

# Modelo para recibir los datos del login
class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # Buscamos al usuario en la tabla admin_users
    admin = db.query(models.AdminUser).filter(models.AdminUser.username == data.username).first()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos"
        )

    # Hasheamos la contraseña recibida para comparar (usando SHA-256 como en tu DB)
    hashed_input = hashlib.sha256(data.password.encode()).hexdigest()
    
    if hashed_input != admin.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos"
        )

    # Si todo está bien, devolvemos los datos básicos (sin la contraseña)
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
