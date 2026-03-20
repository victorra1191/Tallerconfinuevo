import sys
from pathlib import Path
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Inyectar el path
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

# Registro de rutas
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
    # Esto creará las tablas en Neon con la columna SKU incluida
    database.Base.metadata.create_all(bind=database.engine)

@app.get("/")
async def health():
    return {"status": "online", "server": "Confiautos Panama"}

@app.get("/seed-db")
def run_database_seed():
    try:
        data_seeder.seed_all()
        return {"status": "success", "message": "62 productos cargados en Neon"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
