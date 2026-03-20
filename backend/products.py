from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import database

# ESTA LÍNEA ES LA CLAVE: Definimos el prefijo que Vercel espera
router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/")
def read_products(db: Session = Depends(database.get_db)):
    try:
        # Consultamos los 62 productos en Neon
        products = db.query(models.Product).all()
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}")
def read_product(product_id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product
