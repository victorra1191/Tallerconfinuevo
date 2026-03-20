from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import os
import sys
from pathlib import Path

# Configuración de rutas para Vercel
sys.path.append(str(Path(__file__).parent))

# Importamos modelos y base de datos
from .database import engine, Base
from . import models
from .routes import products, services, quotes, appointments, contact, newsletter, blog, admin

app = FastAPI(
    title="Confiautos API",
    description="Sistema de gestión para Confiautos Panama",
    version="1.0.0",
    root_path="/api"
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definimos el Router principal
api_router = APIRouter()

@api_router.get("/")
async def root():
    return {"status": "online", "message": "Confiautos API Ready"}

# Inclusión de rutas
api_router.include_router(products.router)
api_router.include_router(services.router)
api_router.include_router(quotes.router)
api_router.include_router(appointments.router)
api_router.include_router(contact.router)
api_router.include_router(newsletter.router)
api_router.include_router(blog.router)
api_router.include_router(admin.router)

app.include_router(api_router)

# Crear tablas en Neon al iniciar
@app.on_event("startup")
async def startup_event():
    try:
        models.Base.metadata.create_all(bind=engine)
        print("🚀 Tablas verificadas en Neon")
    except Exception as e:
        print(f"❌ Error DB: {e}")
