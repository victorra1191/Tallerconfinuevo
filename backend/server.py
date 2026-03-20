import sys
from pathlib import Path
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Asegurar que Vercel encuentre los módulos
sys.path.append(str(Path(__file__).parent))

import database
import models
import data_seeder 
from routes import products, services, quotes, appointments, contact, newsletter, blog, admin

app = FastAPI(title="Confiautos API")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de rutas individuales
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(services.router, prefix="/services", tags=["services"])
app.include_router(quotes.router, prefix="/quotes", tags=["quotes"])
app.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
app.include_router(contact.router, prefix="/contact", tags=["contact"])
app.include_router(newsletter.router, prefix="/newsletter", tags=["newsletter"])
app.include_router(blog.router, prefix="/blog", tags=["blog"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])

@app.on_event("startup")
async def startup_event():
    # Crea las tablas si no existen al arrancar
    database.Base.metadata.create_all(bind=database.engine)

@app.get("/")
async def health():
    return {"status": "online", "message": "Confiautos Backend Rodando"}

# RUTA DE EMERGENCIA PARA EL SEEDER
@app.get("/seed-db")
def emergency_seed():
    try:
        data_seeder.seed_all()
        return {"status": "success", "message": "¡Base de datos cargada con éxito!"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
