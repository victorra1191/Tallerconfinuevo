from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
import logging

import models
from database import get_db

logger = logging.getLogger(__name__)

# QUITAMOS el prefix="/products" de aquí
router = APIRouter(tags=["products"])

@router.get("/")
def get_products(
    brand: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(models.Product)
        if brand:
            query = query.filter(models.Product.brand == brand)
        if type:
            query = query.filter(models.Product.type == type)
        
        return query.all()
    except Exception as e:
        logger.error(f"Error en DB: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product
