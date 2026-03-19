from fastapi import APIRouter, HTTPException
from typing import List
from models import QuoteRequest, Quote, QuoteItem, Customer, SuccessResponse
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/quotes", tags=["quotes"])

@router.post("/request", response_model=SuccessResponse)
async def request_quote(quote_request: QuoteRequest):
    """Submit a quote request"""
    try:
        # Create or get customer
        customer = Customer(
            name=quote_request.name,
            phone=quote_request.phone,
            email=quote_request.email
        )
        customer_id = await database.create_customer(customer)
        
        # Create quote items
        quote_items = []
        total_amount = 0
        
        for product_data in quote_request.products:
            quantity = product_data.get('quantity', 1)
            unit_price = product_data.get('price', 0)
            subtotal = quantity * unit_price
            
            quote_item = QuoteItem(
                product_id=product_data.get('id'),
                quantity=quantity,
                unit_price=unit_price,
                subtotal=subtotal
            )
            quote_items.append(quote_item)
            total_amount += subtotal
        
        # Create quote
        quote = Quote(
            customer_id=customer_id,
            items=quote_items,
            total_amount=total_amount,
            notes=quote_request.notes
        )
        
        quote_id = await database.create_quote(quote)
        
        return SuccessResponse(
            message="Cotización solicitada exitosamente. Te enviaremos los precios por WhatsApp.",
            data={
                "quote_id": quote_id,
                "total_amount": total_amount,
                "items_count": len(quote_items)
            }
        )
        
    except Exception as e:
        logger.error(f"Error creating quote: {e}")
        raise HTTPException(status_code=500, detail="Error procesando la cotización")

@router.get("/customer/{customer_id}", response_model=List[Quote])
async def get_customer_quotes(customer_id: str):
    """Get all quotes for a customer"""
    try:
        quotes = await database.get_quotes(customer_id=customer_id)
        return quotes
    except Exception as e:
        logger.error(f"Error getting customer quotes: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo cotizaciones")
