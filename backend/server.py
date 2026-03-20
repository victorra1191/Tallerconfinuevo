import sys
from pathlib import Path
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

sys.path.append(str(Path(__file__).parent))

import database
import models
import data_seeder 
from routes import products, services, blog

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ahora la ruta será /api/products/ (Limpia y sin duplicados)
app.include_router(products.router, prefix="/products")
app.include_router(services.router, prefix="/services")
app.include_router(blog.router, prefix="/blog")

@app.on_event("startup")
async def startup_event():
    # Crea las tablas en Neon
    database.Base.metadata.create_all(bind=database.engine)

@app.get("/health")
def health():
    return {"status": "ok", "db": "connected"}

@app.get("/seed-db")
def run_seed():
    try:
        data_seeder.seed_all()
        return {"status": "success", "msg": "62 productos cargados"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
