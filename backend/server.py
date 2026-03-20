from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import os
import sys
from pathlib import Path

# Configurar rutas para encontrar los módulos locales
sys.path.append(str(Path(__file__).parent))

# Importar la base de datos y modelos DESPUÉS de configurar el path
from .database import engine, Base
from . import models
from .routes import products, services, quotes, appointments, contact, newsletter, blog, admin

app = FastAPI(
    title="Confiautos API",
    root_path="/api"
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router principal
router = APIRouter()

@router.get("/")
async def root():
    return {"status": "online", "message": "Confiautos API Ready"}

# Inclusión de rutas
router.include_router(products.router)
router.include_router(services.router)
router.include_router(quotes.router)
router.include_router(appointments.router)
router.include_router(contact.router)
router.include_router(newsletter.router)
router.include_router(blog.router)
router.include_router(admin.router)

app.include_router(router)

# Evento de inicio para crear tablas
@app.on_event("startup")
async def startup_event():
    try:
        # Esto crea las tablas en Neon si no existen
        models.Base.metadata.create_all(bind=engine)
        print("✅ Base de datos sincronizada")
    except Exception as e:
        print(f"❌ Error al sincronizar DB: {str(e)}")
