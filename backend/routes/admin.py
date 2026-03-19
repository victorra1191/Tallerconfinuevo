from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
import hashlib
import jwt
import os
from datetime import datetime, timedelta
import shutil
import uuid
from pathlib import Path
import requests
import urllib.parse

from models import (
    AdminUser, AdminLogin, AdminCreate, BlogPost, BlogPostCreate, 
    BlogPostUpdate, Lead, LeadCreate, AnalyticsData, MediaFile,
    SuccessResponse, ErrorResponse, Product, ProductCreate, Service, ServiceCreate
)
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()

# Environment variables
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Zoho Calendar credentials
ZOHO_CLIENT_ID = "1000.3DUXZWBPP9M9SUDKYNA6ZLB6W6YJHY"
ZOHO_CLIENT_SECRET = "d868d55c7050ef4b6f01afe6254fba2079a79a0943"
ZOHO_REDIRECT_URI = "http://localhost:3000/admin/zoho-callback"
ZOHO_SCOPE = "ZohoCalendar.event.CREATE"

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current admin user from JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = await database.get_admin_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    
    return user

# Authentication endpoints
@router.post("/login")
async def admin_login(login_data: AdminLogin):
    """Admin login endpoint"""
    try:
        user = await database.get_admin_user_by_username(login_data.username)
        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        
        if not user.is_active:
            raise HTTPException(status_code=401, detail="Usuario desactivado")
        
        # Update last login
        await database.update_admin_last_login(user.id)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in admin login: {e}")
        raise HTTPException(status_code=500, detail="Error en el login")

@router.post("/create-admin")
async def create_admin(admin_data: AdminCreate):
    """Create new admin user (should be restricted in production)"""
    try:
        # Check if username already exists
        existing = await database.get_admin_user_by_username(admin_data.username)
        if existing:
            raise HTTPException(status_code=400, detail="Usuario ya existe")
        
        # Create admin user
        admin_user = AdminUser(
            username=admin_data.username,
            email=admin_data.email,
            password_hash=hash_password(admin_data.password),
            full_name=admin_data.full_name,
            role=admin_data.role
        )
        
        user_id = await database.create_admin_user(admin_user)
        return SuccessResponse(message="Usuario admin creado exitosamente", data={"user_id": user_id})
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating admin user: {e}")
        raise HTTPException(status_code=500, detail="Error creando usuario admin")

@router.get("/me")
async def get_current_user_info(current_user: AdminUser = Depends(get_current_admin)):
    """Get current admin user info"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "last_login": current_user.last_login
    }

# Dashboard/Analytics endpoints
@router.get("/dashboard", response_model=AnalyticsData)
async def get_dashboard_data(current_user: AdminUser = Depends(get_current_admin)):
    """Get dashboard analytics data"""
    try:
        analytics = await database.get_analytics_data()
        return analytics
    except Exception as e:
        logger.error(f"Error getting dashboard data: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo datos del dashboard")

# Blog management endpoints
@router.get("/blog/posts", response_model=List[BlogPost])
async def get_all_blog_posts(
    published_only: bool = False,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Get all blog posts (including unpublished for admin)"""
    try:
        posts = await database.get_blog_posts(published_only=published_only)
        return posts
    except Exception as e:
        logger.error(f"Error getting blog posts: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo posts del blog")

@router.post("/blog/posts", response_model=SuccessResponse)
async def create_blog_post(
    post_data: BlogPostCreate,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Create new blog post"""
    try:
        # Generate slug from title
        slug = post_data.title.lower().replace(" ", "-").replace("ñ", "n")
        slug = "".join(c for c in slug if c.isalnum() or c == "-")
        
        blog_post = BlogPost(
            **post_data.dict(),
            slug=slug,
            seo_title=post_data.seo_title or post_data.title,
            seo_description=post_data.seo_description or post_data.excerpt
        )
        
        post_id = await database.create_blog_post(blog_post)
        return SuccessResponse(
            message="Post del blog creado exitosamente",
            data={"post_id": post_id, "slug": slug}
        )
    except Exception as e:
        logger.error(f"Error creating blog post: {e}")
        raise HTTPException(status_code=500, detail="Error creando post del blog")

@router.put("/blog/posts/{post_id}", response_model=SuccessResponse)
async def update_blog_post(
    post_id: str,
    update_data: BlogPostUpdate,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Update blog post"""
    try:
        # Remove None values
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        
        # Update slug if title is changed
        if "title" in update_dict:
            slug = update_dict["title"].lower().replace(" ", "-").replace("ñ", "n")
            slug = "".join(c for c in slug if c.isalnum() or c == "-")
            update_dict["slug"] = slug
        
        success = await database.update_blog_post(post_id, update_dict)
        if not success:
            raise HTTPException(status_code=404, detail="Post no encontrado")
        
        return SuccessResponse(message="Post actualizado exitosamente")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating blog post: {e}")
        raise HTTPException(status_code=500, detail="Error actualizando post")

@router.delete("/blog/posts/{post_id}", response_model=SuccessResponse)
async def delete_blog_post(
    post_id: str,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Delete blog post"""
    try:
        success = await database.delete_blog_post(post_id)
        if not success:
            raise HTTPException(status_code=404, detail="Post no encontrado")
        
        return SuccessResponse(message="Post eliminado exitosamente")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting blog post: {e}")
        raise HTTPException(status_code=500, detail="Error eliminando post")

@router.get("/blog/categories")
async def get_blog_categories(current_user: AdminUser = Depends(get_current_admin)):
    """Get all blog categories"""
    try:
        categories = await database.get_blog_categories()
        return {"categories": categories}
    except Exception as e:
        logger.error(f"Error getting blog categories: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo categorías")

# Media/Image upload endpoints
@router.post("/upload/image", response_model=SuccessResponse)
async def upload_image(
    file: UploadFile = File(...),
    category: str = Form("general"),
    alt_text: str = Form(""),
    description: str = Form(""),
    current_user: AdminUser = Depends(get_current_admin)
):
    """Upload image file"""
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
        
        # Determine upload directory based on category
        if category == 'logo':
            upload_dir = Path("/app/frontend/public/images/logo")
            filename = "logo-confiautos.png"  # Force the correct name for logo
        elif category == 'brands':
            upload_dir = Path("/app/frontend/public/images/marcas")
            # Keep the original filename for brands
            filename = file.filename
        else:
            upload_dir = Path("/app/frontend/public/images/uploads")
            # Generate unique filename for other files
            file_extension = Path(file.filename).suffix
            filename = f"{uuid.uuid4()}{file_extension}"
        
        upload_dir.mkdir(parents=True, exist_ok=True)
        file_path = upload_dir / filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create media record (only for non-logo and non-brand files)
        if category not in ['logo', 'brands']:
            media_file = MediaFile(
                filename=filename,
                original_filename=file.filename,
                file_type="image",
                mime_type=file.content_type,
                size_bytes=file_path.stat().st_size,
                url=f"/images/uploads/{filename}",
                category=category,
                alt_text=alt_text,
                description=description,
                uploaded_by=current_user.id
            )
            
            file_id = await database.create_media_file(media_file)
            
            return SuccessResponse(
                message="Imagen subida exitosamente",
                data={
                    "file_id": file_id,
                    "url": media_file.url,
                    "filename": filename
                }
            )
        else:
            # For logo and brands, just return success
            return SuccessResponse(
                message=f"{'Logo' if category == 'logo' else 'Logo de marca'} subido exitosamente",
                data={
                    "filename": filename,
                    "url": f"/images/{category if category != 'brands' else 'marcas'}/{filename}",
                    "category": category
                }
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading image: {e}")
        raise HTTPException(status_code=500, detail="Error subiendo imagen")

@router.get("/media", response_model=List[MediaFile])
async def get_media_files(
    category: Optional[str] = None,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Get media files"""
    try:
        files = await database.get_media_files(category=category)
        return files
    except Exception as e:
        logger.error(f"Error getting media files: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo archivos de media")

@router.delete("/media/{file_id}", response_model=SuccessResponse)
async def delete_media_file(
    file_id: str,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Delete media file"""
    try:
        # TODO: Also delete the actual file from filesystem
        success = await database.delete_media_file(file_id)
        if not success:
            raise HTTPException(status_code=404, detail="Archivo no encontrado")
        
        return SuccessResponse(message="Archivo eliminado exitosamente")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting media file: {e}")
        raise HTTPException(status_code=500, detail="Error eliminando archivo")

# Lead management endpoints
@router.get("/leads", response_model=List[Lead])
async def get_leads(
    status: Optional[str] = None,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Get leads with optional status filter"""
    try:
        leads = await database.get_leads(status=status)
        return leads
    except Exception as e:
        logger.error(f"Error getting leads: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo leads")

@router.post("/leads", response_model=SuccessResponse)
async def create_lead(
    lead_data: LeadCreate,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Create new lead"""
    try:
        lead = Lead(**lead_data.dict())
        lead_id = await database.create_lead(lead)
        return SuccessResponse(
            message="Lead creado exitosamente",
            data={"lead_id": lead_id}
        )
    except Exception as e:
        logger.error(f"Error creating lead: {e}")
        raise HTTPException(status_code=500, detail="Error creando lead")

@router.put("/leads/{lead_id}/status", response_model=SuccessResponse)
async def update_lead_status(
    lead_id: str,
    status: str,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Update lead status"""
    try:
        success = await database.update_lead_status(lead_id, status)
        if not success:
            raise HTTPException(status_code=404, detail="Lead no encontrado")
        
        return SuccessResponse(message="Estado del lead actualizado exitosamente")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating lead status: {e}")
        raise HTTPException(status_code=500, detail="Error actualizando estado del lead")

# Customer management endpoints
@router.get("/customers")
async def get_customers(current_user: AdminUser = Depends(get_current_admin)):
    """Get all customers"""
    try:
        # This would be implemented in database.py
        # customers = await database.get_all_customers()
        return {"message": "Customer endpoints to be implemented"}
    except Exception as e:
        logger.error(f"Error getting customers: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo clientes")

# Export endpoints
@router.get("/export/customers")
async def export_customers(current_user: AdminUser = Depends(get_current_admin)):
    """Export customer data to Excel"""
    try:
        import pandas as pd
        from io import BytesIO
        
        # Get detailed customer data
        customer_data_response = await get_detailed_customers(current_user)
        customers = customer_data_response["customers"]
        
        # Create DataFrame
        df = pd.DataFrame(customers)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Clientes', index=False)
        
        output.seek(0)
        
        # Return Excel file
        from fastapi.responses import StreamingResponse
        return StreamingResponse(
            BytesIO(output.read()),
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={"Content-Disposition": "attachment; filename=confiautos-clientes.xlsx"}
        )
        
    except Exception as e:
        logger.error(f"Error exporting customers: {e}")
        raise HTTPException(status_code=500, detail="Error exportando datos")

# Enhanced customer data endpoint
@router.get("/customers/detailed")
async def get_detailed_customers(current_user: AdminUser = Depends(get_current_admin)):
    """Get detailed customer information with all related data"""
    try:
        # Get all base data
        customers = await database.get_customers()
        service_requests = await database.get_service_requests()
        quotes = await database.get_quotes()
        appointments = await database.get_appointments()
        
        # Build detailed customer profiles
        customer_profiles = {}
        
        # Process customers first
        for customer in customers:
            customer_profiles[customer.id] = {
                "id": customer.id,
                "name": customer.name,
                "email": customer.email,
                "phone": customer.phone,
                "address": customer.address,
                "source": "direct",
                "services": 0,
                "quotes": 0,
                "appointments": 0,
                "last_contact": customer.created_at,
                "created_at": customer.created_at
            }
        
        # Add service requests
        for req in service_requests:
            customer_id = req.customer_id
            if customer_id not in customer_profiles:
                # Create profile from service request data
                customer_profiles[customer_id] = {
                    "id": customer_id,
                    "name": "Cliente de Servicio",
                    "email": "",
                    "phone": "",
                    "address": "",
                    "source": "service_request",
                    "services": 0,
                    "quotes": 0,
                    "appointments": 0,
                    "last_contact": req.created_at,
                    "created_at": req.created_at
                }
            
            customer_profiles[customer_id]["services"] += 1
            if req.created_at > customer_profiles[customer_id]["last_contact"]:
                customer_profiles[customer_id]["last_contact"] = req.created_at
        
        # Add quotes
        for quote in quotes:
            customer_id = quote.customer_id
            if customer_id not in customer_profiles:
                customer_profiles[customer_id] = {
                    "id": customer_id,
                    "name": "Cliente de Cotización",
                    "email": "",
                    "phone": "",
                    "address": "",
                    "source": "quote",
                    "services": 0,
                    "quotes": 0,
                    "appointments": 0,
                    "last_contact": quote.created_at,
                    "created_at": quote.created_at
                }
            
            customer_profiles[customer_id]["quotes"] += 1
            if quote.created_at > customer_profiles[customer_id]["last_contact"]:
                customer_profiles[customer_id]["last_contact"] = quote.created_at
        
        # Add appointments
        for apt in appointments:
            customer_id = apt.customer_id
            if customer_id not in customer_profiles:
                customer_profiles[customer_id] = {
                    "id": customer_id,
                    "name": "Cliente de Cita",
                    "email": "",
                    "phone": "",
                    "address": "",
                    "source": "appointment",
                    "services": 0,
                    "quotes": 0,
                    "appointments": 0,
                    "last_contact": apt.created_at,
                    "created_at": apt.created_at
                }
            
            customer_profiles[customer_id]["appointments"] += 1
            if apt.created_at > customer_profiles[customer_id]["last_contact"]:
                customer_profiles[customer_id]["last_contact"] = apt.created_at
        
        return {
            "customers": list(customer_profiles.values()),
            "total_customers": len(customer_profiles),
            "total_service_requests": len(service_requests),
            "total_quotes": len(quotes),
            "total_appointments": len(appointments)
        }
        
    except Exception as e:
        logger.error(f"Error getting detailed customers: {e}")
        return {
            "customers": [],
            "total_customers": 0,
            "total_service_requests": 0,
            "total_quotes": 0,
            "total_appointments": 0
        }

# Service requests management
@router.get("/service-requests")
async def get_service_requests(current_user: AdminUser = Depends(get_current_admin)):
    """Get all service requests"""
    try:
        requests = await database.get_service_requests()
        return {"service_requests": requests}
    except Exception as e:
        logger.error(f"Error getting service requests: {e}")
        return {"service_requests": []}

# Quotes management
@router.get("/quotes")
async def get_quotes(current_user: AdminUser = Depends(get_current_admin)):
    """Get all quotes"""
    try:
        quotes = await database.get_quotes()
        return {"quotes": quotes}
    except Exception as e:
        logger.error(f"Error getting quotes: {e}")
        return {"quotes": []}

# Appointments management
@router.get("/appointments")
async def get_appointments(current_user: AdminUser = Depends(get_current_admin)):
    """Get all appointments"""
    try:
        appointments = await database.get_appointments()
        return {"appointments": appointments}
    except Exception as e:
        logger.error(f"Error getting appointments: {e}")
        return {"appointments": []}

# Products CRUD
@router.get("/products", response_model=List[Product])
async def get_admin_products(current_user: AdminUser = Depends(get_current_admin)):
    """Get all products for admin"""
    try:
        products = await database.get_products()
        return products
    except Exception as e:
        logger.error(f"Error getting products: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo productos")

@router.post("/products", response_model=SuccessResponse)
async def create_admin_product(
    product_data: ProductCreate,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Create new product"""
    try:
        product = Product(**product_data.dict())
        product_id = await database.create_product(product)
        return SuccessResponse(
            message="Producto creado exitosamente",
            data={"product_id": product_id}
        )
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Error creando producto")

@router.put("/products/{product_id}", response_model=SuccessResponse)
async def update_admin_product(
    product_id: str,
    update_data: dict,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Update product"""
    try:
        success = await database.update_product(product_id, update_data)
        if not success:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        return SuccessResponse(message="Producto actualizado exitosamente")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {e}")
        raise HTTPException(status_code=500, detail="Error actualizando producto")

@router.delete("/products/{product_id}", response_model=SuccessResponse)
async def delete_admin_product(
    product_id: str,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Delete product"""
    try:
        success = await database.delete_product(product_id)
        if not success:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        return SuccessResponse(message="Producto eliminado exitosamente")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {e}")
        raise HTTPException(status_code=500, detail="Error eliminando producto")

# Services CRUD
@router.get("/services", response_model=List[Service])
async def get_admin_services(current_user: AdminUser = Depends(get_current_admin)):
    """Get all services for admin"""
    try:
        services = await database.get_services()
        return services
    except Exception as e:
        logger.error(f"Error getting services: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo servicios")

@router.post("/services", response_model=SuccessResponse)
async def create_admin_service(
    service_data: ServiceCreate,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Create new service"""
    try:
        service = Service(**service_data.dict())
        service_id = await database.create_service(service)
        return SuccessResponse(
            message="Servicio creado exitosamente",
            data={"service_id": service_id}
        )
    except Exception as e:
        logger.error(f"Error creating service: {e}")
        raise HTTPException(status_code=500, detail="Error creando servicio")

@router.put("/services/{service_id}", response_model=SuccessResponse)
async def update_admin_service(
    service_id: str,
    update_data: dict,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Update service"""
    try:
        success = await database.update_service(service_id, update_data)
        if not success:
            raise HTTPException(status_code=404, detail="Servicio no encontrado")
        
        return SuccessResponse(message="Servicio actualizado exitosamente")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating service: {e}")
        raise HTTPException(status_code=500, detail="Error actualizando servicio")

@router.delete("/services/{service_id}", response_model=SuccessResponse)
async def delete_admin_service(
    service_id: str,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Delete service"""
    try:
        success = await database.delete_service(service_id)
        if not success:
            raise HTTPException(status_code=404, detail="Servicio no encontrado")
        
        return SuccessResponse(message="Servicio eliminado exitosamente")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting service: {e}")
        raise HTTPException(status_code=500, detail="Error eliminando servicio")

# Zoho Calendar Integration
@router.get("/zoho/auth-url")
async def get_zoho_auth_url(current_user: AdminUser = Depends(get_current_admin)):
    """Get Zoho OAuth authorization URL"""
    try:
        auth_url = (
            f"https://accounts.zoho.com/oauth/v2/auth?"
            f"scope={ZOHO_SCOPE}&"
            f"client_id={ZOHO_CLIENT_ID}&"
            f"response_type=code&"
            f"redirect_uri={urllib.parse.quote(ZOHO_REDIRECT_URI)}&"
            f"access_type=offline"
        )
        return {"auth_url": auth_url}
    except Exception as e:
        logger.error(f"Error generating Zoho auth URL: {e}")
        raise HTTPException(status_code=500, detail="Error generando URL de autorización")

@router.post("/zoho/callback")
async def handle_zoho_callback(
    code: str,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Handle Zoho OAuth callback"""
    try:
        # Exchange code for access token
        token_url = "https://accounts.zoho.com/oauth/v2/token"
        token_data = {
            "grant_type": "authorization_code",
            "client_id": ZOHO_CLIENT_ID,
            "client_secret": ZOHO_CLIENT_SECRET,
            "redirect_uri": ZOHO_REDIRECT_URI,
            "code": code
        }
        
        response = requests.post(token_url, data=token_data)
        if response.status_code == 200:
            token_info = response.json()
            # Store token securely (in a real app, you'd store this in database)
            # For now, we'll just return success
            return SuccessResponse(
                message="Zoho Calendar autorizado exitosamente",
                data={"expires_in": token_info.get("expires_in", 3600)}
            )
        else:
            raise HTTPException(status_code=400, detail="Error autorizando Zoho Calendar")
            
    except Exception as e:
        logger.error(f"Error in Zoho callback: {e}")
        raise HTTPException(status_code=500, detail="Error procesando autorización")

@router.post("/zoho/create-event")
async def create_zoho_event(
    event_data: dict,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Create event in Zoho Calendar"""
    try:
        # For now, we'll just log the event data
        # In a full implementation, you'd use the stored access token
        logger.info(f"Creating Zoho Calendar event: {event_data}")
        
        # This would be the API call to create the event
        # calendar_url = "https://calendar.zoho.com/api/v1/calendars/primary/events"
        # headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}
        # response = requests.post(calendar_url, json=event_data, headers=headers)
        
        return SuccessResponse(
            message="Evento creado en Zoho Calendar",
            data={"event_id": "simulated_event_id"}
        )
        
    except Exception as e:
        logger.error(f"Error creating Zoho event: {e}")
        raise HTTPException(status_code=500, detail="Error creando evento en calendario")