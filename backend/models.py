from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, Boolean, JSON
from .database import Base  # Importante: Esto viene del archivo database.py que editamos

# ==========================================
# 1. TABLAS PARA NEON.TECH (SQLAlchemy)
# ==========================================

class ProductTable(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    price = Column(Float)
    sku = Column(String, unique=True)
    type = Column(String)
    brand = Column(String)
    description = Column(String)
    in_stock = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AppointmentTable(Base):
    __tablename__ = "appointments"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String)
    vehicle_brand = Column(String)
    vehicle_model = Column(String)
    appointment_date = Column(String)
    appointment_time = Column(String)
    notes = Column(String)
    status = Column(String, default="scheduled")
    created_at = Column(DateTime, default=datetime.utcnow)

class ContactTable(Base):
    __tablename__ = "contacts"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==========================================
# 2. MODELOS PARA LA API (Pydantic)
# --- Aquí dejas lo que ya tenías antes ---
# ==========================================

# Product Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    sku: str
    image: Optional[str] = None
    type: str
    brand: str
    uses: str
    description: str
    keywords: List[str] = []
    googleImageUrl: Optional[str] = None
    in_stock: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductFilter(BaseModel):
    brand: Optional[str] = None
    type: Optional[str] = None
    keyword: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None

# Service Models
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    duration: str
    includes: List[str] = []
    image: Optional[str] = None
    specialty: bool = False
    badge: Optional[str] = None
    category: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Customer Models
class Customer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[EmailStr] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Vehicle Models
class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    brand: str
    model: str
    year: str
    additional_info: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Service Request Models
class ServiceRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    service_id: str
    vehicle_id: str
    urgency: str  # baja, media, alta, urgente
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    description: Optional[str] = None
    status: str = "pending"  # pending, confirmed, in_progress, completed, cancelled
    contact_method: str = "whatsapp"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ServiceRequestCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    vehicle_brand: str
    vehicle_model: str
    vehicle_year: str
    service_id: str
    urgency: str
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    description: Optional[str] = None
    contact_method: str = "whatsapp"

# Quote Models
class QuoteItem(BaseModel):
    product_id: str
    quantity: int
    unit_price: float
    subtotal: float

class Quote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    items: List[QuoteItem]
    total_amount: float
    notes: Optional[str] = None
    status: str = "pending"  # pending, sent, accepted, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class QuoteRequest(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    products: List[dict]  # Contains product info and quantities
    notes: Optional[str] = None

# Appointment Models
class Appointment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    service_id: Optional[str] = None
    vehicle_id: Optional[str] = None
    appointment_date: datetime
    appointment_time: str
    duration_hours: int = 2
    status: str = "scheduled"  # scheduled, confirmed, completed, cancelled
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AppointmentCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    vehicle_brand: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_year: Optional[str] = None
    service_type: Optional[str] = None
    appointment_date: str
    appointment_time: str
    notes: Optional[str] = None

# Contact Models
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    status: str = "new"  # new, read, replied
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Newsletter Models
class NewsletterSubscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    status: str = "active"  # active, unsubscribed
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)
    unsubscribed_at: Optional[datetime] = None

# Product Models  
class ProductCreate(BaseModel):
    name: str
    price: float
    sku: str
    type: str
    brand: str
    uses: str
    description: str
    keywords: List[str] = []

# Service Models
class ServiceCreate(BaseModel):
    name: str
    description: str
    duration: str
    includes: List[str]
    specialty: bool = False
    badge: Optional[str] = None
    category: str
class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    author: str
    category: str
    image: Optional[str] = None
    featured_image: Optional[str] = None  # Main featured image
    gallery_images: List[str] = []  # Additional gallery images
    tags: List[str] = []
    read_time: str
    published: bool = True
    featured: bool = False  # For featured posts
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    slug: Optional[str] = None  # URL-friendly slug
    view_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    author: str
    category: str
    featured_image: Optional[str] = None
    gallery_images: List[str] = []
    tags: List[str] = []
    read_time: str
    published: bool = True
    featured: bool = False
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    featured_image: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    read_time: Optional[str] = None
    published: Optional[bool] = None
    featured: Optional[bool] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

# Admin User Models
class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password_hash: str
    full_name: str
    role: str = "admin"  # admin, editor, viewer
    is_active: bool = True
    last_login: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    role: str = "admin"

# Lead Models (for Mailchimp integration)
class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    source: str  # "website", "whatsapp", "manual"
    lead_type: str  # "service", "product", "quote", "contact"
    vehicle_type: Optional[str] = None
    interest: Optional[str] = None
    status: str = "new"  # new, contacted, converted, lost
    tags: List[str] = []
    metadata: dict = {}
    mailchimp_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class LeadCreate(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    source: str
    lead_type: str
    vehicle_type: Optional[str] = None
    interest: Optional[str] = None
    tags: List[str] = []
    metadata: dict = {}

# Analytics Models
class AnalyticsData(BaseModel):
    total_customers: int
    total_service_requests: int
    total_quotes: int
    total_appointments: int
    total_blog_posts: int
    total_leads: int
    recent_activity: List[dict]
    popular_services: List[dict]
    revenue_data: dict

# Media/Image Models
class MediaFile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    original_filename: str
    file_type: str  # "image", "document"
    mime_type: str
    size_bytes: int
    url: str
    category: str  # "blog", "promotion", "product", "service", "general"
    alt_text: Optional[str] = None
    description: Optional[str] = None
    uploaded_by: str  # admin user id
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Settings Models
class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    site_title: str = "Confiautos Panama"
    site_description: str = "Confianza y Garantía en servicios automotrices"
    contact_email: EmailStr
    contact_phone: str
    address: str
    business_hours: dict
    social_media: dict = {}
    seo_settings: dict = {}
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Response Models
class SuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error: Optional[str] = None
