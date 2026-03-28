from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import models
import hashlib
from database import get_db
from pydantic import BaseModel

# El prefijo es /admin. Al sumarse al /api del server.py, da /api/admin/
router = APIRouter(prefix="/admin", tags=["admin"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    admin_user = db.query(models.AdminUser).filter(models.AdminUser.username == data.username).first()
    
    if not admin_user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    # Hasheo SHA-256 para comparar con tu base de datos de Neon
    hashed_input = hashlib.sha256(data.password.encode()).hexdigest()
    
    if hashed_input != admin_user.password:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {
        "status": "success",
        "user": {"username": admin_user.username, "full_name": admin_user.full_name}
    }

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "total_products": db.query(models.Product).count(),
        "total_appointments": db.query(models.Appointment).count(),
        "total_quotes": db.query(models.Quote).count()
    }
