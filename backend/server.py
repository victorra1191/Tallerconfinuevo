import sys
from pathlib import Path
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

# Inyectar path para módulos locales
sys.path.append(str(Path(__file__).parent))

import database
import models
import data_seeder 
from routes import products, services, quotes, appointments, contact, newsletter, blog, admin

app = FastAPI(title="Confiautos API")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de routers con prefijos claros
app.include_router(products.router, prefix="/products")
app.include_router(services.router, prefix="/services")
app.include_router(quotes.router, prefix="/quotes")
app.include_router(appointments.router, prefix="/appointments")
app.include_router(contact.router, prefix="/contact")
app.include_router(newsletter.router, prefix="/newsletter")
app.include_router(blog.router, prefix="/blog")
app.include_router(admin.router, prefix="/admin")

@app.get("/")
async def health():
    return {"status": "online", "server": "Confiautos Panama"}

# ESTA ES LA RUTA QUE VAMOS A USAR AHORA
@app.get("/seed-data-final")
def run_final_seed():
    try:
        data_seeder.seed_all()
        return {"status": "success", "message": "¡62 productos y servicios cargados en Neon!"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
