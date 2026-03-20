from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, Text
from database import Base
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# === MODELOS DE BASE DE DATOS (SQLAlchemy) ===

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String, index=True)
    type = Column(String, index=True)
    price = Column(Float)
    sku = Column(String, unique=True, nullable=True) # AÑADIDO
    description = Column(Text, nullable=True)
    image = Column(String)
    in_stock = Column(Boolean, default=True)

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price_range = Column(String)
    icon = Column(String)

class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    full_name = Column(String)
    role = Column(String, default="admin")

class BlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    excerpt = Column(Text)
    content = Column(Text)
    author = Column(String)
    category = Column(String)
    read_time = Column(String)
    date = Column(DateTime, default=datetime.utcnow)

# === ESQUEMAS DE VALIDACIÓN (Pydantic para la API) ===
class QuoteCreate(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    service_type: str
    message: Optional[str] = None
