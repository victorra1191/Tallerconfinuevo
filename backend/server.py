import sys
from pathlib import Path
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Asegurar que Vercel encuentre los módulos locales
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

# Registramos las rutas con el prefijo /api para que coincidan con vercel.json
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(services.router, prefix="/services", tags=["Services"])
app.include_router(quotes.router, prefix="/quotes", tags=["Quotes"])
app.include_router(appointments.router, prefix="/appointments", tags=["Appointments"])
app.include_router(contact.router, prefix="/contact", tags=["Contact"])
app.include_router(newsletter.router, prefix="/newsletter", tags=["Newsletter"])
app.include_router(blog.router, prefix="/blog", tags=["Blog"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.on_event("startup")
async def startup_event():
    # Crea las tablas en Neon (Asegúrate de haber hecho el DROP TABLE en Neon)
    database.Base.metadata.create_all(bind=database.engine)

@app.get("/")
async def health():
    return {"status": "online", "server": "Confiautos Panama"}

@app.get("/seed-db")
def run_database_seed():
    try:
        data_seeder.seed_all()
        return {
            "status": "success", 
            "message": "Tablas sincronizadas y 62 productos cargados en Neon"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
