from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import sys
from pathlib import Path

# Añadir el directorio actual al path para evitar ModuleNotFoundError
sys.path.append(str(Path(__file__).parent))

# Importamos la conexión y los modelos
from .database import engine, Base
from . import models
from .routes import products, services, quotes, appointments, contact, newsletter, blog, admin

# UNIFICADO: Solo una instancia de FastAPI
app = FastAPI(
    title="Confiautos API",
    description="Sistema de gestión para Confiautos Panama",
    version="1.0.0",
    root_path="/api"  # Importante para Vercel
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter() # Quitamos el prefijo aquí porque el rewrite de Vercel ya lo maneja

@api_router.get("/")
async def root():
    return {"status": "online", "message": "Confiautos API Ready"}

# Incluir rutas
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
    # Creamos las tablas aquí para asegurar que la conexión esté lista
    try:
        models.Base.metadata.create_all(bind=engine)
        print("🚀 Tablas creadas/verificadas en Neon")
    except Exception as e:
        print(f"❌ Error en DB: {e}")
