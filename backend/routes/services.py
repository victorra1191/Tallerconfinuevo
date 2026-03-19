from fastapi import APIRouter, HTTPException
from typing import List
from models import Service, ServiceRequestCreate, SuccessResponse
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/services", tags=["services"])

@router.get("/", response_model=List[Service])
async def get_services():
    """Get all available services"""
    try:
        services = await database.get_services()
        return services
    except Exception as e:
        logger.error(f"Error getting services: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Get a specific service by ID"""
    try:
        service = await database.get_service_by_id(service_id)
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
        return service
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting service {service_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/request", response_model=SuccessResponse)
async def request_service(request: ServiceRequestCreate):
    """Submit a service request"""
    try:
        from models import Customer, Vehicle, ServiceRequest
        from datetime import datetime
        
        # Create or get customer
        customer = Customer(
            name=request.name,
            phone=request.phone,
            email=request.email
        )
        customer_id = await database.create_customer(customer)
        
        # Create vehicle
        vehicle = Vehicle(
            customer_id=customer_id,
            brand=request.vehicle_brand,
            model=request.vehicle_model,
            year=request.vehicle_year
        )
        vehicle_id = await database.create_vehicle(vehicle)
        
        # Create service request
        service_request = ServiceRequest(
            customer_id=customer_id,
            service_id=request.service_id,
            vehicle_id=vehicle_id,
            urgency=request.urgency,
            preferred_date=request.preferred_date,
            preferred_time=request.preferred_time,
            description=request.description,
            contact_method=request.contact_method
        )
        
        request_id = await database.create_service_request(service_request)
        
        return SuccessResponse(
            message="Solicitud de servicio enviada exitosamente. Te contactaremos pronto.",
            data={"request_id": request_id}
        )
        
    except Exception as e:
        logger.error(f"Error creating service request: {e}")
        raise HTTPException(status_code=500, detail="Error procesando la solicitud")
