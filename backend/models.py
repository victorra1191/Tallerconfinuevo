from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer
from database import Base
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ==========================================
# 1. MODELOS DE BASE DE DATOS (SQLAlchemy)
# ==========================================

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String, index=True)
    type = Column(String, index=True)
    price = Column(Float)
    image = Column(String)
    description = Column(String)
    in_stock = Column(Boolean, default=True)

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price_range = Column(String)
    icon = Column(String)

class Quote(Base):
    __tablename__ = "quotes"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    email = Column(String)
    phone = Column(String)
    service_type = Column(String)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    email = Column(String)
    phone = Column(String)
    service_id = Column(Integer)
    appointment_date = Column(DateTime)
    status = Column(String, default="pending")

class Newsletter(Base):
    __tablename__ = "newsletter"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    subject = Column(String)
    message = Column(String)

# ==========================================
# 2. ESQUEMAS DE VALIDACIÓN (Pydantic)
# ==========================================

class QuoteCreate(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    service_type: str
    message: Optional[str] = None

class AppointmentCreate(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    service_id: int
    appointment_date: datetime

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class NewsletterSubscribe(BaseModel):
    email: EmailStr
