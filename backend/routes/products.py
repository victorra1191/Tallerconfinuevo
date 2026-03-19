from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models import Product, ProductFilter, SuccessResponse
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[Product])
async def get_products(
    brand: Optional[str] = Query(None, description="Filter by brand"),
    type: Optional[str] = Query(None, description="Filter by product type"),
    keyword: Optional[str] = Query(None, description="Search by keyword"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price")
):
    """Get all products with optional filtering"""
    try:
        filter_params = ProductFilter(
            brand=brand,
            type=type,
            keyword=keyword,
            min_price=min_price,
            max_price=max_price
        )
        products = await database.get_products(filter_params)
        return products
    except Exception as e:
        logger.error(f"Error getting products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a specific product by ID"""
    try:
        product = await database.get_product_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting product {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/brands/list")
async def get_brands():
    """Get list of all available brands"""
    try:
        products = await database.get_products()
        brands = list(set(product.brand for product in products))
        return {"brands": sorted(brands)}
    except Exception as e:
        logger.error(f"Error getting brands: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/types/list")
async def get_product_types():
    """Get list of all available product types"""
    try:
        products = await database.get_products()
        types = list(set(product.type for product in products))
        return {"types": sorted(types)}
    except Exception as e:
        logger.error(f"Error getting product types: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
