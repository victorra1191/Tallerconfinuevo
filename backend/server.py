from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import os
import logging

# 1. Importamos la conexión a Neon y las tablas
from database import engine, DBManager
import models

# Crear las tablas físicamente en Neon.tech al arrancar
models.Base.metadata.create_all(bind=engine)

# Import route modules
from routes import products, services, quotes, appointments, contact, newsletter, blog, admin

# Create the main app
app = FastAPI(
    title="Confiautos API",
    description="API para el sistema de gestión de Confiautos Panama",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {
        "message": "Confiautos API is running",
        "version": "1.0.0",
        "status": "healthy",
        "location": "Panama City"
    }

# Include all route modules
api_router.include_router(products.router)
api_router.include_router(services.router)
api_router.include_router(quotes.router)
api_router.include_router(appointments.router)
api_router.include_router(contact.router)
api_router.include_router(newsletter.router)
api_router.include_router(blog.router)
api_router.include_router(admin.router)

app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Confiautos API iniciando en Vercel...")
    # Aquí podrías poner lógica para crear el admin inicial si la tabla está vacía
