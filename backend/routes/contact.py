from fastapi import APIRouter, HTTPException
from typing import List
from models import ContactMessage, SuccessResponse
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/contact", tags=["contact"])

@router.post("/message", response_model=SuccessResponse)
async def send_contact_message(message_data: ContactMessage):
    """Send a contact message"""
    try:
        message_id = await database.create_contact_message(message_data)
        
        return SuccessResponse(
            message="Mensaje enviado exitosamente. Te responderemos en las próximas 2 horas.",
            data={"message_id": message_id}
        )
        
    except Exception as e:
        logger.error(f"Error sending contact message: {e}")
        raise HTTPException(status_code=500, detail="Error enviando el mensaje")

@router.get("/messages", response_model=List[ContactMessage])
async def get_contact_messages():
    """Get all contact messages (admin use)"""
    try:
        messages = await database.get_contact_messages()
        return messages
    except Exception as e:
        logger.error(f"Error getting contact messages: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo mensajes")
