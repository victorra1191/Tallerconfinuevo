import sys
from pathlib import Path
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

# Inyección de ruta para que Python vea la carpeta backend
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

import database
import models
import data_seeder 
from routes import products, services, quotes, appointments, contact, newsletter, blog, admin

app = FastAPI(title="Confiautos API v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Creamos un router de API para agrupar todo bajo un mismo nivel
api_router = APIRouter()

# Registro de rutas: Asegúrate que en products.py el router NO tenga prefix
api_router.include_router(products.router, prefix="/products", tags=["Prod"])
api_router.include_router(services.router, prefix="/services", tags=["Serv"])
api_router.include_router(blog.router, prefix="/blog", tags=["Blog"])
api_router.include_router(appointments.router, prefix="/appointments")

# Unimos todo al app principal
app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    # Sincronización forzada de esquemas
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/health")
def check_health():
    return {"status": "online", "db": "connected", "version": "2.0"}

@app.get("/seed-db")
def execute_seeding():
    try:
        data_seeder.seed_all()
        return {"status": "success", "items_loaded": 62}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Importante: Vercel necesita que el objeto se llame 'app'
