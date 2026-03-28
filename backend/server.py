import sys
import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

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

# REGISTRO LIMPIO
# Si pones prefix="/api" aquí, y en Vercel también, se crea el error /api/api/
app.include_router(products.router)
app.include_router(admin.router)

@app.on_event("startup")
async def startup_event():
    # Esto conecta Python con Neon
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/api/health")
def health():
    return {"status": "ok", "msg": "Servidor Confiautos Activo"}
