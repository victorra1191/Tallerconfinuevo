import sys
from pathlib import Path
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

# Inyectar el path para que Vercel encuentre los módulos
sys.path.append(str(Path(__file__).parent))

import database
import models
from routes import products, services, quotes, appointments, contact, newsletter, blog, admin

app = FastAPI(
    title="Confiautos API",
    root_path="/api"
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router principal
main_router = APIRouter()

# Registro de todas tus rutas existentes
main_router.include_router(products.router)
main_router.include_router(services.router)
main_router.include_router(quotes.router)
main_router.include_router(appointments.router)
main_router.include_router(contact.router)
main_router.include_router(newsletter.router)
main_router.include_router(blog.router)
main_router.include_router(admin.router)

app.include_router(main_router)

@app.on_event("startup")
async def startup_event():
    # Sincroniza las tablas con Neon
    database.Base.metadata.create_all(bind=database.engine)

@app.get("/")
async def health():
    return {"status": "online", "server": "Confiautos Panama"}
@app.get("/seed")
def run_seed():
    import seed
    seed.seed_data()
    return {"message": "Database seeded successfully"}
