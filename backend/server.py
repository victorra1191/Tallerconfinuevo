import sys
import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Asegura que Python vea los módulos internos
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

# REGISTRO DE RUTAS SIN PREFIJOS DUPLICADOS
# No pongas "/api" aquí. Deja que vercel.json lo maneje.
app.include_router(products.router)
app.include_router(admin.router)

@app.on_event("startup")
async def startup_event():
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/api/health")
def health():
    return {"status": "ok", "msg": "Servidor Confiautos Activo"}
