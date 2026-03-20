import sys
import os
from pathlib import Path
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Esto es lo que permite que el código vea a 'database', 'models', etc.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import database
import models
import data_seeder
from routes import products

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# RUTAS DIRECTAS PARA EVITAR EL "NOT FOUND"
@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok", "msg": "Conectado a Confiautos"}

@app.get("/api/seed-db")
@app.get("/seed-db")
def run_seed():
    data_seeder.seed_all()
    return {"status": "success", "msg": "62 productos cargados"}

# Solo cargamos productos por ahora para probar estabilidad
app.include_router(products.router, prefix="/products")

@app.on_event("startup")
async def startup_event():
    # Esto asegura que Neon cree las tablas al primer contacto
    models.Base.metadata.create_all(bind=database.engine)
