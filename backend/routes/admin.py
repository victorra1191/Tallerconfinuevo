from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, status
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
from pydantic import BaseModel

# Importación de tus modelos y base de datos
from models import (
    AdminUser, BlogPost, BlogPostCreate, 
    BlogPostUpdate, Lead, LeadCreate, AnalyticsData, MediaFile,
    SuccessResponse, ErrorResponse, Product, ProductCreate, Service, ServiceCreate
)
from database import database
import logging

logger = logging.getLogger(__name__)

# DEFINICIÓN DEL ROUTER
router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()

# Variables de entorno
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 

# Zoho Calendar credentials
ZOHO_CLIENT_ID = "1000.3DUXZWBPP9M9SUDKYNA6ZLB6W6YJHY"
ZOHO_CLIENT_SECRET = "d868d55c7050ef4b6f01afe6254fba2079a79a0943"
ZOHO_REDIRECT_URI = "http://localhost:3000/admin/zoho-callback"
ZOHO_SCOPE = "ZohoCalendar.event.CREATE"

# --- MODELOS DE ENTRADA ---
class AdminLogin(BaseModel):
    username: str
    password: str

# --- FUNCIONES DE SEGURIDAD ---
def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica la contraseña comparando hashes SHA256"""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
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

# --- ENDPOINTS DE AUTENTICACIÓN ---

@router.post("/login")
async def admin_login(login_data: AdminLogin):
    """Login con validación de Hash SHA-256"""
    try:
        user = await database.get_admin_user_by_username(login_data.username)
        
        # Validación: Metemos el Hash de la entrada en la ecuación
        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        
        if not user.is_active:
            raise HTTPException(status_code=401, detail="Usuario desactivado")
        
        await database.update_admin_last_login(user.id)
        
        access_token = create_access_token(data={"sub": user.username})
        
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
        logger.error(f"Error en login: {e}")
        raise HTTPException(status_code=500, detail="Error interno")

@router.get("/me")
async def get_current_user_info(current_user: AdminUser = Depends(get_current_admin)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "last_login": current_user.last_login
    }

# --- DASHBOARD & ANALYTICS ---
@router.get("/dashboard", response_model=AnalyticsData)
async def get_dashboard_data(current_user: AdminUser = Depends(get_current_admin)):
    try:
        analytics = await database.get_analytics_data()
        return analytics
    except Exception as e:
        logger.error(f"Error dashboard: {e}")
        raise HTTPException(status_code=500, detail="Error cargando analytics")

# --- BLOG MANAGEMENT ---
@router.get("/blog/posts", response_model=List[BlogPost])
async def get_all_blog_posts(published_only: bool = False, current_user: AdminUser = Depends(get_current_admin)):
    return await database.get_blog_posts(published_only=published_only)

@router.post("/blog/posts", response_model=SuccessResponse)
async def create_blog_post(post_data: BlogPostCreate, current_user: AdminUser = Depends(get_current_admin)):
    slug = post_data.title.lower().replace(" ", "-").replace("ñ", "n")
    slug = "".join(c for c in slug if c.isalnum() or c == "-")
    blog_post = BlogPost(**post_data.dict(), slug=slug, seo_title=post_data.title)
    post_id = await database.create_blog_post(blog_post)
    return SuccessResponse(message="Post creado", data={"post_id": post_id})

@router.put("/blog/posts/{post_id}")
async def update_blog_post(post_id: str, update_data: BlogPostUpdate, current_user: AdminUser = Depends(get_current_admin)):
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    success = await database.update_blog_post(post_id, update_dict)
    if not success: raise HTTPException(status_code=404)
    return SuccessResponse(message="Post actualizado")

@router.delete("/blog/posts/{post_id}")
async def delete_blog_post(post_id: str, current_user: AdminUser = Depends(get_current_admin)):
    await database.delete_blog_post(post_id)
    return SuccessResponse(message="Post eliminado")

# --- MEDIA & UPLOADS ---
@router.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...), 
    category: str = Form("uploads"), 
    current_user: AdminUser = Depends(get_current_admin)
):
    upload_dir = Path(f"frontend/public/images/{category}")
    upload_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4()}{Path(file.filename).suffix}"
    file_path = upload_dir / filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    media_file = MediaFile(
        filename=filename, original_filename=file.filename,
        file_type="image", mime_type=file.content_type,
        size_bytes=file_path.stat().st_size, url=f"/images/{category}/{filename}",
        category=category, uploaded_by=current_user.id
    )
    await database.create_media_file(media_file)
    return {"url": media_file.url}

@router.get("/media", response_model=List[MediaFile])
async def get_media_files(category: Optional[str] = None, current_user: AdminUser = Depends(get_current_admin)):
    return await database.get_media_files(category=category)

# --- PRODUCTS CRUD ---
@router.get("/products", response_model=List[Product])
async def get_admin_products(current_user: AdminUser = Depends(get_current_admin)):
    return await database.get_products()

@router.post("/products")
async def create_admin_product(product_data: ProductCreate, current_user: AdminUser = Depends(get_current_admin)):
    product = Product(**product_data.dict())
    await database.create_product(product)
    return SuccessResponse(message="Producto creado")

@router.put("/products/{product_id}")
async def update_admin_product(product_id: str, update_data: dict, current_user: AdminUser = Depends(get_current_admin)):
    await database.update_product(product_id, update_data)
    return SuccessResponse(message="Producto actualizado")

@router.delete("/products/{product_id}")
async def delete_admin_product(product_id: str, current_user: AdminUser = Depends(get_current_admin)):
    await database.delete_product(product_id)
    return SuccessResponse(message="Producto eliminado")

# --- SERVICES CRUD ---
@router.get("/services", response_model=List[Service])
async def get_admin_services(current_user: AdminUser = Depends(get_current_admin)):
    return await database.get_services()

@router.post("/services")
async def create_admin_service(service_data: ServiceCreate, current_user: AdminUser = Depends(get_current_admin)):
    service = Service(**service_data.dict())
    await database.create_service(service)
    return SuccessResponse(message="Servicio creado")

@router.delete("/services/{service_id}")
async def delete_admin_service(service_id: str, current_user: AdminUser = Depends(get_current_admin)):
    await database.delete_service(service_id)
    return SuccessResponse(message="Servicio eliminado")

# --- ZOHO INTEGRATION ---
@router.get("/zoho/auth-url")
async def get_zoho_auth_url(current_user: AdminUser = Depends(get_current_admin)):
    auth_url = (
        f"https://accounts.zoho.com/oauth/v2/auth?"
        f"scope={ZOHO_SCOPE}&"
        f"client_id={ZOHO_CLIENT_ID}&"
        f"response_type=code&"
        f"redirect_uri={urllib.parse.quote(ZOHO_REDIRECT_URI)}&"
        f"access_type=offline"
    )
    return {"auth_url": auth_url}

@router.post("/zoho/callback")
async def handle_zoho_callback(code: str, current_user: AdminUser = Depends(get_current_admin)):
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
        return SuccessResponse(message="Zoho Calendar autorizado")
    raise HTTPException(status_code=400, detail="Error en Zoho")

# --- CITAS, COTIZACIONES Y LEADS ---
@router.get("/appointments")
async def get_appointments(current_user: AdminUser = Depends(get_current_admin)):
    appointments = await database.get_appointments()
    return {"appointments": appointments}

@router.get("/quotes")
async def get_quotes(current_user: AdminUser = Depends(get_current_admin)):
    quotes = await database.get_quotes()
    return {"quotes": quotes}

@router.get("/leads")
async def get_all_leads(current_user: AdminUser = Depends(get_current_admin)):
    leads = await database.get_leads()
    return {"leads": leads}

@router.get("/customers/detailed")
async def get_detailed_customers(current_user: AdminUser = Depends(get_current_admin)):
    customers = await database.get_customers()
    return {"customers": customers, "total_customers": len(customers)}
