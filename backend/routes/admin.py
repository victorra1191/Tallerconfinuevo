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

# Importamos tus modelos y base de datos
from models import (
    AdminUser, BlogPost, BlogPostCreate, 
    BlogPostUpdate, Lead, LeadCreate, AnalyticsData, MediaFile,
    SuccessResponse, ErrorResponse, Product, ProductCreate, Service, ServiceCreate
)
from database import database
import logging

logger = logging.getLogger(__name__)

# El prefijo /admin es vital para el ruteo
router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()

# Configuraciones de JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 

# Zoho Calendar
ZOHO_CLIENT_ID = "1000.3DUXZWBPP9M9SUDKYNA6ZLB6W6YJHY"
ZOHO_CLIENT_SECRET = "d868d55c7050ef4b6f01afe6254fba2079a79a0943"
ZOHO_REDIRECT_URI = "http://localhost:3000/admin/zoho-callback"
ZOHO_SCOPE = "ZohoCalendar.event.CREATE"

# --- MODELOS DE DATOS ---
class AdminLogin(BaseModel):
    username: str
    password: str

# --- SEGURIDAD ---
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
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

# --- LOGIN (CORRECCIÓN DEL HASH) ---
@router.post("/login")
async def admin_login(login_data: AdminLogin):
    try:
        user = await database.get_admin_user_by_username(login_data.username)
        
        # Sincronizamos el hash SHA-256
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
    except Exception as e:
        logger.error(f"Error 500 en login: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno al procesar el hash")

# --- TODAS LAS FUNCIONES ADICIONALES ---

@router.get("/me")
async def get_current_user_info(current_user: AdminUser = Depends(get_current_admin)):
    return {
        "id": current_user.id, "username": current_user.username,
        "email": current_user.email, "full_name": current_user.full_name,
        "role": current_user.role, "last_login": current_user.last_login
    }

@router.get("/dashboard", response_model=AnalyticsData)
async def get_dashboard_data(current_user: AdminUser = Depends(get_current_admin)):
    return await database.get_analytics_data()

@router.get("/blog/posts", response_model=List[BlogPost])
async def get_all_blog_posts(published_only: bool = False, current_user: AdminUser = Depends(get_current_admin)):
    return await database.get_blog_posts(published_only=published_only)

@router.post("/blog/posts")
async def create_blog_post(post_data: BlogPostCreate, current_user: AdminUser = Depends(get_current_admin)):
    slug = post_data.title.lower().replace(" ", "-").replace("ñ", "n")
    blog_post = BlogPost(**post_data.dict(), slug=slug)
    post_id = await database.create_blog_post(blog_post)
    return {"message": "Post creado", "id": post_id}

@router.post("/upload/image")
async def upload_image(file: UploadFile = File(...), category: str = Form("uploads"), current_user: AdminUser = Depends(get_current_admin)):
    upload_dir = Path(f"frontend/public/images/{category}")
    upload_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4()}{Path(file.filename).suffix}"
    file_path = upload_dir / filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"/images/{category}/{filename}"}

@router.get("/products", response_model=List[Product])
async def get_admin_products(current_user: AdminUser = Depends(get_current_admin)):
    return await database.get_products()

@router.post("/products")
async def create_product(product_data: ProductCreate, current_user: AdminUser = Depends(get_current_admin)):
    await database.create_product(Product(**product_data.dict()))
    return {"message": "Producto creado"}

@router.get("/services", response_model=List[Service])
async def get_admin_services(current_user: AdminUser = Depends(get_current_admin)):
    return await database.get_services()

@router.get("/appointments")
async def get_appointments(current_user: AdminUser = Depends(get_current_admin)):
    return {"appointments": await database.get_appointments()}

@router.get("/quotes")
async def get_quotes(current_user: AdminUser = Depends(get_current_admin)):
    return {"quotes": await database.get_quotes()}

@router.get("/zoho/auth-url")
async def get_zoho_auth_url(current_user: AdminUser = Depends(get_current_admin)):
    auth_url = f"https://accounts.zoho.com/oauth/v2/auth?scope={ZOHO_SCOPE}&client_id={ZOHO_CLIENT_ID}&response_type=code&redirect_uri={urllib.parse.quote(ZOHO_REDIRECT_URI)}&access_type=offline"
    return {"auth_url": auth_url}

@router.get("/customers/detailed")
async def get_detailed_customers(current_user: AdminUser = Depends(get_current_admin)):
    customers = await database.get_customers()
    return {"customers": customers, "total": len(customers)}
