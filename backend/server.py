import sys
from pathlib import Path
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# 1. Inyectar el path ANTES de los otros imports
sys.path.append(str(Path(__file__).parent))

import database
import models
import data_seeder # Asegúrate de que el nombre del archivo sea data_seeder.py
from routes import products, services, quotes, appointments, contact, newsletter, blog, admin

app = FastAPI(
    title="Confiautos API",
    # root_path se maneja en vercel.json, aquí lo dejamos limpio o lo quitamos
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Registro directo de routers (Evitamos main_router para que no haya conflictos de prefijos)
app.include_router(products.router)
app.include_router(services.router)
app.include_router(quotes.router)
app.include_router(appointments.router)
app.include_router(contact.router)
app.include_router(newsletter.router)
app.include_router(blog.router)
app.include_router(admin.router)

@app.on_event("startup")
async def startup_event():
    # Sincroniza las tablas con Neon (Asegúrate de haber hecho el DROP TABLE en Neon primero)
    database.Base.metadata.create_all(bind=database.engine)

@app.get("/")
async def health():
    return {"status": "online", "server": "Confiautos Panama"}

# 3. Endpoint de disparo para el Seeder
@app.get("/seed-db")
def run_database_seed():
    try:
        data_seeder.seed_all()
        return {
            "status": "success", 
            "message": "Base de datos de Confiautos poblada correctamente con 62 productos"
        }
    except Exception as e:
        # Esto te dirá exactamente qué columna falta si el DROP TABLE no se hizo
        return {"status": "error", "message": str(e)}
