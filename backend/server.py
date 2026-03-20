import sys
import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Permitir que el código vea los módulos locales
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import database
import models
from routes import products

app = FastAPI()

# Configuración de CORS para que React pueda conectarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# RUTAS DE PRUEBA Y SALUD
@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok", "msg": "Conectado a Confiautos"}

# INCLUSIÓN DEL ROUTER (Sin prefijo extra aquí porque ya está en products.py)
app.include_router(products.router)

@app.on_event("startup")
async def startup_event():
    # Esto asegura que Neon cree las tablas al iniciar si no existen
    models.Base.metadata.create_all(bind=database.engine)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
