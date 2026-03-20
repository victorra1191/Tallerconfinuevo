from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import models
from database import get_db

router = APIRouter(prefix="/quotes", tags=["quotes"])

@router.post("/")
def create_quote(quote: models.QuoteCreate, db: Session = Depends(get_db)):
    """Crea una nueva solicitud de cotización en Neon"""
    try:
        # Mapeo de datos del esquema Pydantic al modelo SQLAlchemy
        new_quote = models.Quote(
            customer_name=quote.customer_name,
            email=quote.email,
            phone=quote.phone,
            service_type=quote.service_type,
            message=quote.message
        )
        
        db.add(new_quote)
        db.commit()
        db.refresh(new_quote)
        
        return {
            "status": "success", 
            "message": "Cotización recibida exitosamente",
            "id": new_quote.id
        }
    except Exception as e:
        db.rollback()
        # Log del error para depuración en Vercel
        print(f"Error al crear cotización: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Error interno al procesar la cotización"
        )

@router.get("/")
def get_all_quotes(db: Session = Depends(get_db)):
    """Endpoint administrativo para ver todas las cotizaciones"""
    try:
        return db.query(models.Quote).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
