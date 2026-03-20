import sys
from pathlib import Path
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Inyectar path para módulos locales
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

# Registro de rutas de la API
app.include_router(products.router, prefix="/products")
app.include_router(services.router, prefix="/services")
app.include_router(quotes.router, prefix="/quotes")
app.include_router(appointments.router, prefix="/appointments")
app.include_router(contact.router, prefix="/contact")
app.include_router(newsletter.router, prefix="/newsletter")
app.include_router(blog.router, prefix="/blog")
app.include_router(admin.router, prefix="/admin")

@app.on_event("startup")
async def startup_event():
    # Crea las tablas limpias en Neon
    database.Base.metadata.create_all(bind=database.engine)

@app.get("/")
async def health():
    return {"status": "online", "server": "Confiautos Panama"}

# ENDPOINT CRÍTICO PARA EL VOLCADO DE DATOS
@app.get("/seed-db")
def run_database_seed():
    try:
        data_seeder.seed_all()
        return {
            "status": "success", 
            "message": "Tablas creadas y 62 productos insertados correctamente en Neon"
        }
    except Exception as e:
        return {"status": "error", "detail": str(e)}
