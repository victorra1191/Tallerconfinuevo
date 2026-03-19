from fastapi import APIRouter, HTTPException
from models import NewsletterSubscription, SuccessResponse
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/newsletter", tags=["newsletter"])

@router.post("/subscribe", response_model=SuccessResponse)
async def subscribe_newsletter(email: str):
    """Subscribe to newsletter"""
    try:
        subscription = NewsletterSubscription(email=email)
        subscription_id = await database.subscribe_newsletter(subscription)
        
        return SuccessResponse(
            message="¡Suscripción exitosa! Recibirás ofertas especiales y consejos automotrices.",
            data={"subscription_id": subscription_id}
        )
        
    except Exception as e:
        logger.error(f"Error subscribing to newsletter: {e}")
        raise HTTPException(status_code=500, detail="Error en la suscripción")

@router.post("/unsubscribe", response_model=SuccessResponse)
async def unsubscribe_newsletter(email: str):
    """Unsubscribe from newsletter"""
    try:
        # Update subscription status
        from datetime import datetime
        result = await database.db.newsletter_subscriptions.update_one(
            {"email": email},
            {
                "$set": {
                    "status": "unsubscribed",
                    "unsubscribed_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Email no encontrado")
        
        return SuccessResponse(
            message="Te has desuscrito exitosamente del newsletter."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error unsubscribing from newsletter: {e}")
        raise HTTPException(status_code=500, detail="Error en la desuscripción")
