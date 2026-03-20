from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import sys
app = FastAPI(
    title="Confiautos API",
    root_path="/api"
)
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

# Importamos la conexión y los modelos
from .database import engine, Base
from . import models

# Intentar crear las tablas en Neon al cargar el archivo
try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Error inicializando tablas: {e}")

# Importamos las rutas (Asegúrate que estos archivos existan en /routes)
from .routes import products, services, quotes, appointments, contact, newsletter, blog, admin
    
app = FastAPI(
    title="Confiautos API",
    description="Sistema de gestión para Confiautos Panama",
    version="1.0.0"
)

# Configuración de CORS para que React pueda hablar con la API
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prefijo /api para todas las rutas
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"status": "online", "message": "Confiautos API Ready"}

# Incluimos los módulos de rutas
api_router.include_router(products.router)
api_router.include_router(services.router)
api_router.include_router(quotes.router)
api_router.include_router(appointments.router)
api_router.include_router(contact.router)
api_router.include_router(newsletter.router)
api_router.include_router(blog.router)
api_router.include_router(admin.router)

app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    print("🚀 Servidor Confiautos encendido exitosamente")
