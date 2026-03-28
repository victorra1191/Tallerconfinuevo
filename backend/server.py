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

# REGISTRO DE RUTAS SIN DUPLICAR /API
# Quitamos el prefix="/api" de aquí porque ya lo maneja el vercel.json y el router interno
app.include_router(products.router)
app.include_router(admin.router)

@app.on_event("startup")
async def startup_event():
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/api/health")
def health():
    return {"status": "ok", "msg": "Servidor Confiautos Activo"}
