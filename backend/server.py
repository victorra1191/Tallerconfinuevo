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

# --- REGISTRO DE RUTAS ---

# 1. Productos: Necesita /api porque tu React (Products.jsx) lo busca ahí.
app.include_router(products.router, prefix="/api")

# 2. Admin: NO agregues /api aquí. 
# Vercel se encargará de enviarle la ruta limpia.
app.include_router(admin.router)

# --------------------------

@app.on_event("startup")
async def startup_event():
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok", "msg": "Conectado a Confiautos"}
