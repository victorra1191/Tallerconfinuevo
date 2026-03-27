import sys
import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Permitir que el código vea los módulos locales
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import database
import models
from routes import products, admin  # Asegúrate de que admin esté aquí

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REGISTRO DE RUTAS
# Para los productos: NO usamos prefijo extra porque el frontend ya busca /api/products
app.include_router(products.router)

# Para el admin: NO usamos prefijo /api aquí porque Vercel ya se lo pone 
# y el archivo admin.py ya tiene el suyo propio interno.
app.include_router(admin.router)

@app.on_event("startup")
async def startup_event():
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok", "msg": "Conectado a Confiautos"}
