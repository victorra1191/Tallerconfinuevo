from fastapi import APIRouter, HTTPException
from typing import List
from models import AppointmentCreate, Appointment, Customer, Vehicle, SuccessResponse
from database import database
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("/book", response_model=SuccessResponse)
async def book_appointment(appointment_data: AppointmentCreate):
    """Book a new appointment"""
    try:
        # Create or get customer
        customer = Customer(
            name=appointment_data.name,
            phone=appointment_data.phone,
            email=appointment_data.email
        )
        customer_id = await database.create_customer(customer)
        
        # Create vehicle if provided
        vehicle_id = None
        if appointment_data.vehicle_brand and appointment_data.vehicle_model:
            vehicle = Vehicle(
                customer_id=customer_id,
                brand=appointment_data.vehicle_brand,
                model=appointment_data.vehicle_model,
                year=appointment_data.vehicle_year or "N/A"
            )
            vehicle_id = await database.create_vehicle(vehicle)
        
        # Parse appointment datetime
        appointment_datetime = datetime.strptime(
            f"{appointment_data.appointment_date} {appointment_data.appointment_time}",
            "%Y-%m-%d %H:%M"
        )
        
        # Create appointment
        appointment = Appointment(
            customer_id=customer_id,
            vehicle_id=vehicle_id,
            appointment_date=appointment_datetime,
            appointment_time=appointment_data.appointment_time,
            notes=appointment_data.notes
        )
        
        appointment_id = await database.create_appointment(appointment)
        
        return SuccessResponse(
            message="Cita agendada exitosamente. Te confirmaremos por WhatsApp.",
            data={
                "appointment_id": appointment_id,
                "date": appointment_data.appointment_date,
                "time": appointment_data.appointment_time
            }
        )
        
    except ValueError as e:
        logger.error(f"Invalid date/time format: {e}")
        raise HTTPException(status_code=400, detail="Formato de fecha/hora inválido")
    except Exception as e:
        logger.error(f"Error booking appointment: {e}")
        raise HTTPException(status_code=500, detail="Error agendando la cita")

@router.get("/customer/{customer_id}", response_model=List[Appointment])
async def get_customer_appointments(customer_id: str):
    """Get all appointments for a customer"""
    try:
        appointments = await database.get_appointments(customer_id=customer_id)
        return appointments
    except Exception as e:
        logger.error(f"Error getting customer appointments: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo citas")

@router.get("/", response_model=List[Appointment])
async def get_all_appointments():
    """Get all appointments (admin use)"""
    try:
        appointments = await database.get_appointments()
        return appointments
    except Exception as e:
        logger.error(f"Error getting appointments: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo citas")
