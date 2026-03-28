import sys
import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Asegurar que los módulos locales sean visibles
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
# Importante: Ambos llevan el prefijo /api para que coincidan con el vercel.json
app.include_router(products.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/api/health")
def health():
    return {"status": "ok", "msg": "Servidor Confiautos Activo"}
