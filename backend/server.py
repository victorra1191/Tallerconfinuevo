from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import sys
import logging
from pathlib import Path

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

from database import database

# Import route modules
from routes import products, services, quotes, appointments, contact, newsletter, blog, admin

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(
    title="Confiautos API",
    description="API para el sistema de gestión de Confiautos Panama",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {
        "message": "Confiautos API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected" if database.client else "disconnected"
    }

# Include all route modules
api_router.include_router(products.router)
api_router.include_router(services.router)
api_router.include_router(quotes.router)
api_router.include_router(appointments.router)
api_router.include_router(contact.router)
api_router.include_router(newsletter.router)
api_router.include_router(blog.router)
api_router.include_router(admin.router)

# Include the main router in the app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    """Connect to database on startup"""
    try:
        await database.connect()
        logger.info("Database connected successfully")
        
        # Seed initial data if needed
        try:
            from data_seeder import seed_all_data
            # Run seeding in the background (will skip if data exists)
            import asyncio
            asyncio.create_task(seed_data_if_needed())
        except Exception as e:
            logger.warning(f"Data seeding failed: {e}")
            
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_db_client():
    """Disconnect from database on shutdown"""
    await database.disconnect()

async def seed_data_if_needed():
    """Seed data if the database is empty"""
    try:
        # FORCE CREATE ADMIN USER
        existing_admin = await database.get_admin_user_by_username("admin")
        if not existing_admin:
            from models import AdminUser
            import hashlib
            
            admin_user = AdminUser(
                username="admin",
                email="admin@confiautos.com.pa",
                password_hash=hashlib.sha256("confiautos123".encode()).hexdigest(),
                full_name="Administrador Confiautos",
                role="admin"
            )
            
            await database.create_admin_user(admin_user)
            logger.info("✅ Admin user created: admin/confiautos123")
        else:
            logger.info("✅ Admin user already exists")
        
        # Check if we have any data
        products = await database.get_products()
        services = await database.get_services()
        
        if not products or not services:
            logger.info("Database appears empty, seeding initial data...")
            from data_seeder import seed_products, seed_services, seed_blog_posts
            
            if not products:
                await seed_products()
            if not services:
                await seed_services()
                
            await seed_blog_posts()
            logger.info("Initial data seeding completed")
        else:
            logger.info(f"Database has data: {len(products)} products, {len(services)} services")
            
    except Exception as e:
        logger.error(f"Error during data seeding: {e}")
