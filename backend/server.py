import sys
import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Permitir que el código vea los módulos locales
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import database
import models
from routes import products, admin 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REGISTRO DE RUTAS
# Productos: prefix="/api" porque el frontend usa /api/products
app.include_router(products.router, prefix="/api")

# Admin: AQUÍ NO SE PONE PREFIJO. El archivo admin.py ya trae /admin
app.include_router(admin.router)

@app.on_event("startup")
async def startup_event():
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok", "msg": "Conectado a Confiautos"}
