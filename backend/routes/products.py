from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import database

# Prefijo exacto para que la ruta final sea /api/products
router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("")
def read_products(db: Session = Depends(database.get_db)):
    try:
        products = db.query(models.Product).all()
        return products
    except Exception as e:
        print(f"Error en Neon: {e}")
        raise HTTPException(status_code=500, detail="Error interno en la base de datos")

@router.get("/{product_id}")
def read_product(product_id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product
