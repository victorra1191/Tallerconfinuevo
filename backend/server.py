from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import os
import sys
from pathlib import Path

# Esto es lo que permite que los imports funcionen en Vercel
root_path = Path(__file__).parent
sys.path.append(str(root_path))

# CAMBIO: Imports absolutos (sin el punto inicial)
import database
import models
from routes import products, services, quotes, appointments, contact, newsletter, blog, admin

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

@app.on_event("startup")
async def startup_event():
    try:
        models.Base.metadata.create_all(bind=database.engine)
        print("✅ Tablas sincronizadas en Neon")
    except Exception as e:
        print(f"❌ Error DB: {str(e)}")
