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

# --- CONFIGURACIÓN DE RUTAS ---

# 1. Productos: Se queda igual para que sigan funcionando.
app.include_router(products.router, prefix="/api")

# 2. Admin: Quitamos el prefijo "/api" aquí porque el archivo admin.py 
# ya tiene internamente un prefijo que causa conflicto con Vercel.
app.include_router(admin.router)

# ------------------------------

@app.on_event("startup")
async def startup_event():
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok", "msg": "Conectado a Confiautos"}
