import os
import sys
import hashlib
import logging
from pathlib import Path
from sqlalchemy.orm import Session
from datetime import datetime

# Configuración de ruta para que encuentre los módulos locales en Vercel
sys.path.append(str(Path(__file__).parent))

import database
import models

logger = logging.getLogger(__name__)

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# === DATA MAESTRA ===
ADMIN_USER_DATA = {
    "username": "admin",
    "email": "admin@confiautos.com.pa",
    "password": "confiautos123",
    "full_name": "Administrador Confiautos",
    "role": "admin"
}

# Aquí están tus 62 productos reales
PRODUCTS_DATA = [
    {"name": "Engine Flush Plus", "price": 12.95, "sku": "4100420026577", "type": "Aditivo de Limpieza", "brand": "Genérico", "description": "Limpia residuos internos del motor y mejora la eficiencia."},
    {"name": "Tapa Fugas De Aceite", "price": 15.00, "sku": "4100420025013", "type": "Aceite", "brand": "Genérico", "description": "Lubrica el motor y mejora el rendimiento general."},
    {"name": "Carburador Cleaner A1", "price": 8.50, "sku": "CASBU-450", "type": "Limpiador de Carburador", "brand": "A1", "description": "Elimina depósitos en el carburador y mejora la mezcla aire-combustible."},
    {"name": "Filtro De Aceite Al-3593", "price": 12.50, "sku": "AL-3593", "type": "Filtro de Aceite", "brand": "Genérico", "description": "Retiene impurezas del aceite y protege componentes internos."},
    {"name": "Grasa Multiuso Wurth", "price": 18.50, "sku": "4046777424942", "type": "Grasa", "brand": "Wurth", "description": "Lubricación de alta resistencia para reducir fricción y desgaste."},
    {"name": "Liquido De Freno Brake Fluid A1", "price": 6.50, "sku": "6297001486382", "type": "Fluido de Frenos", "brand": "A1", "description": "Fluido de frenos de alta performance para sistemas hidráulicos."},
    {"name": "Electronics Cleaner A1", "price": 6.50, "sku": "A1-LE-450", "type": "Limpiador", "brand": "A1", "description": "Disuelve grasa, polvo y residuos en superficies metálicas."},
    {"name": "Brake Cleaner A1", "price": 6.00, "sku": "A1-LF-500", "type": "Limpiador", "brand": "A1", "description": "Disuelve grasa, polvo y residuos en superficies metálicas."},
    {"name": "Acido Coil Brite", "price": 8.50, "sku": "COIL-BRITE", "type": "Limpiador", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Hsw 200 Plus Wurt Bombas Olor", "price": 12.50, "sku": "4065746391443", "type": "Eliminador de Olores", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Car Clean Set Wurt", "price": 25.00, "sku": "4052703649211", "type": "Kit de Limpieza", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Reparador De Pneus Auto Wurt 220 Ml", "price": 15.00, "sku": "7891799462574", "type": "Reparador de Neumáticos", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Limpieza Del Motor Wurth 500Ml", "price": 18.00, "sku": "10649008", "type": "Limpiador de Motor", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Sellador De Radiador Wurt 250Ml", "price": 12.00, "sku": "910854511730", "type": "Sellador", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Desengraxante Express Wurt 500Ml", "price": 14.00, "sku": "4099618249501", "type": "Desengrasante", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Silicona En Spray Wurt 300Ml", "price": 10.00, "sku": "4056807076942", "type": "Sellador/Silicona", "brand": "Wurth", "description": "Sella juntas y previene fugas en motores y carrocerías."},
    {"name": "Adictivo De Nafta Wurt 300Ml", "price": 8.00, "sku": "4065746019422", "type": "Aditivo", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Limpiador De Válvulas De Gasolina Wurt 300Ml", "price": 9.50, "sku": "8460075507330", "type": "Limpiador", "brand": "Wurth", "description": "Disuelve grasa, polvo y residuos en superficies metálicas."},
    {"name": "Liquido De Frenos Wurt 250Ml", "price": 8.50, "sku": "4065746757737", "type": "Fluido de Frenos", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Limpia Parabrisas Wurt 100Ml", "price": 6.00, "sku": "4045989514038", "type": "Limpiador", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Pintura Aerosol Wurt 400Ml", "price": 12.00, "sku": "4056807623832", "type": "Pintura", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Tapafugas De Radiador", "price": 8.50, "sku": "4100420025051", "type": "Sellador", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Grasa Dielectrica Wurt 85 Gr", "price": 10.50, "sku": "4056807695013", "type": "Grasa", "brand": "Wurth", "description": "Lubricación de alta resistencia para reducir fricción y desgaste."},
    {"name": "Bombillo Wurt", "price": 8.00, "sku": "BOMBILLO-WURT", "type": "Bombillo", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Limpiador De Inyectores Presurizado Wurt 500Ml", "price": 16.50, "sku": "INYECT-500", "type": "Limpiador", "brand": "Wurth", "description": "Disuelve grasa, polvo y residuos en superficies metálicas."},
    {"name": "Engine Clean Motor Systemreiniger Motul 300Ml", "price": 18.50, "sku": "5716304275994", "type": "Limpiador de Motor", "brand": "Motul", "description": "Producto automotriz para uso especializado."},
    {"name": "Super Diésel Additiv Liqui Moly 250Ml", "price": 14.50, "sku": "4100420025044", "type": "Aditivo", "brand": "Liqui Moly", "description": "Producto automotriz para uso especializado."},
    {"name": "Bujias Iridium D-Lfr5Aix", "price": 25.00, "sku": "5648169728639", "type": "Repuesto", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Varniz De Motor 135Ml Wurt", "price": 9.50, "sku": "7891799524609", "type": "Protector", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Brillant 750 Ml", "price": 12.00, "sku": "8027486744916", "type": "Abrillantador", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Air Filter 28113-1W000 Filtro Motor", "price": 12.50, "sku": "28113-1W000", "type": "Filtro", "brand": "Genérico", "description": "Filtración eficiente de partículas y contaminantes."},
    {"name": "Cabin Filter Ac-87139-Yzz20 Filtro De Cabina", "price": 15.50, "sku": "AC-87139-YZZ20", "type": "Filtro", "brand": "Genérico", "description": "Filtración eficiente de partículas y contaminantes."},
    {"name": "Cabin Filter Ac-83236 Filtro De Cabina", "price": 14.50, "sku": "AC-83236", "type": "Filtro", "brand": "Genérico", "description": "Filtración eficiente de partículas y contaminantes."},
    {"name": "Cinta Eléctrica", "price": 3.50, "sku": "4045989541669", "type": "Accesorio", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Cabin Filter Ac-81950 Filtro Cabina", "price": 13.50, "sku": "AC-81950", "type": "Filtro", "brand": "Genérico", "description": "Filtración eficiente de partículas y contaminantes."},
    {"name": "Air Filter 28113-1W000", "price": 11.50, "sku": "28113-1W000-B", "type": "Filtro", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Air Filter Ak 91001", "price": 10.50, "sku": "AK-91001", "type": "Filtro", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Air Filter Ak-16546-02N00", "price": 9.50, "sku": "AK-16546-02N00", "type": "Filtro", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Filtros De Gasolina 16405-02N10", "price": 8.50, "sku": "16405-02N10", "type": "Filtro", "brand": "Genérico", "description": "Filtración eficiente de partículas y contaminantes."},
    {"name": "Filtros De Gasolina 31112-1Rp000", "price": 9.50, "sku": "31112-1RP000", "type": "Filtro", "brand": "Genérico", "description": "Filtración eficiente de partículas y contaminantes."},
    {"name": "Air Filter Ak-21050", "price": 8.50, "sku": "AK-21050", "type": "Filtro", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Atf Multi Eni 1L", "price": 12.50, "sku": "8423178020175", "type": "Aceite ATF", "brand": "ENI", "description": "Producto automotriz para uso especializado."},
    {"name": "Mp 80W-90 Manual Transmisión Eni 4L", "price": 35.00, "sku": "8003699012646", "type": "Aceite de Transmisión", "brand": "ENI", "description": "Producto automotriz para uso especializado."},
    {"name": "10W-30 Aceite Motul 4L", "price": 45.00, "sku": "3374650415550", "type": "Aceite", "brand": "Motul", "description": "Lubrica el motor y mejora el rendimiento general."},
    {"name": "10W-30 1L Aceite Motul", "price": 15.00, "sku": "370960410042", "type": "Aceite", "brand": "Motul", "description": "Lubrica el motor y mejora el rendimiento general."},
    {"name": "5W-30 Aceite Eni 1L", "price": 12.00, "sku": "8003699010826", "type": "Aceite", "brand": "ENI", "description": "Lubrica el motor y mejora el rendimiento general."},
    {"name": "Aticogelante 1Galon", "price": 18.00, "sku": "ANTICONG-1GAL", "type": "Anticongelante", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Aceite Diésel 15W-40 19L A1", "price": 85.00, "sku": "DIESEL-15W40-19L", "type": "Aceite", "brand": "A1", "description": "Lubrica el motor y mejora el rendimiento general."},
    {"name": "Limpiador De Manos Wurth 4L", "price": 22.00, "sku": "4099618626777", "type": "Limpiador", "brand": "Wurth", "description": "Disuelve grasa, polvo y residuos en superficies metálicas."},
    {"name": "Silicon Negro Wurth 200Ml", "price": 8.50, "sku": "7891799499549", "type": "Sellador/Silicona", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Super Limpiador De Parabrisas", "price": 6.50, "sku": "1003989678863", "type": "Limpiador", "brand": "Genérico", "description": "Disuelve grasa, polvo y residuos en superficies metálicas."},
    {"name": "Aceite Motul 15W-40 5L", "price": 38.00, "sku": "3374650257730", "type": "Aceite", "brand": "Motul", "description": "Lubrica el motor y mejora el rendimiento general."},
    {"name": "Adesivo Liquido Para Metal Wurth 25Gr", "price": 12.50, "sku": "4065746292412", "type": "Adhesivo", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Colá Multiuso Wurth 400Ml", "price": 14.00, "sku": "COLA-MULTI-400", "type": "Adhesivo", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Pulidor De Metal Wurth", "price": 11.50, "sku": "PULIDOR-METAL", "type": "Pulidor", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Adesivo De Parabrisas", "price": 16.00, "sku": "ADESIVO-PARAB", "type": "Adhesivo", "brand": "Genérico", "description": "Producto automotriz para uso especializado."},
    {"name": "Sellador De Carrocería Wurth", "price": 18.50, "sku": "SELLADOR-CARROCERIA", "type": "Sellador", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Adhesivo Instantáneo 2G Wurth", "price": 8.50, "sku": "4058794437478", "type": "Adhesivo", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Rost Off Aflojatuercas Wurth", "price": 13.50, "sku": "4058794504781", "type": "Desoxidante", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Limpia Parabrisas Wurth 21", "price": 7.50, "sku": "LIMPIA-21", "type": "Escobilla", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Limpia Parabrisas Wurth 26", "price": 8.00, "sku": "LIMPIA-26", "type": "Escobilla", "brand": "Wurth", "description": "Producto automotriz para uso especializado."},
    {"name": "Limpia Parabrisas 14 Wurth", "price": 6.50, "sku": "LIMPIA-14", "type": "Escobilla", "brand": "Wurth", "description": "Producto automotriz para uso especializado."}
]

# Servicios completos
SERVICES_DATA = [
    {"name": "Aire Acondicionado Automotriz", "description": "Diagnóstico, reparación y mantenimiento completo del sistema de A/C", "price_range": "$40 - $200", "icon": "snowflake"},
    {"name": "Chapistería y Pintura", "description": "Reparación de carrocería y pintura profesional", "price_range": "3-7 días", "icon": "brush"},
    {"name": "Mecánica Ligera", "description": "Reparaciones menores y mantenimiento preventivo", "price_range": "1-3 horas", "icon": "settings"},
    {"name": "Cambio de Aceite y Filtros", "description": "Servicio completo de lubricación con aceites premium", "price_range": "45 min", "icon": "oil"},
    {"name": "Diagnóstico Computarizado", "description": "Escaneo completo con equipos de última generación", "price_range": "30-60 min", "icon": "computer"},
    {"name": "Instalación de Papel Ahumado", "description": "Polarizado profesional con films de alta calidad", "price_range": "2-3 horas", "icon": "sun"},
    {"name": "Reparación de Frenos", "description": "Servicio completo de sistema de frenos", "price_range": "2-4 horas", "icon": "brake"},
    {"name": "Suspensión y Dirección", "description": "Diagnóstico y reparación de sistema de suspensión", "price_range": "3-5 horas", "icon": "truck"}
]

# Blog completo
BLOG_POSTS_DATA = [
    {"title": "¿Cuándo hacer mantenimiento preventivo?", "excerpt": "Intervalos ideales según aceite.", "content": "Contenido completo...", "author": "Miguel Herrera", "category": "Mantenimiento", "read_time": "5 min"},
    {"title": "Aire Acondicionado: Señales de servicio", "excerpt": "Identifica cuándo necesita atención.", "content": "Contenido completo...", "author": "Luis Morales", "category": "Aire Acondicionado", "read_time": "4 min"},
    {"title": "Aceites Motul vs ENI", "excerpt": "Comparación técnica entre marcas.", "content": "Contenido completo...", "author": "Miguel Herrera", "category": "Productos", "read_time": "6 min"}
]

def seed_admin_user(db: Session):
    logger.info("Verificando usuario administrador...")
    existing_admin = db.query(models.AdminUser).filter(models.AdminUser.username == ADMIN_USER_DATA["username"]).first()
    if not existing_admin:
        admin_user = models.AdminUser(
            username=ADMIN_USER_DATA["username"],
            email=ADMIN_USER_DATA["email"],
            password_hash=hash_password(ADMIN_USER_DATA["password"]),
            full_name=ADMIN_USER_DATA["full_name"],
            role=ADMIN_USER_DATA["role"]
        )
        db.add(admin_user)
        logger.info("Admin creado.")

def seed_products(db: Session):
    logger.info("Sincronizando productos...")
    for p_data in PRODUCTS_DATA:
        existing = db.query(models.Product).filter(models.Product.name == p_data["name"]).first()
        if not existing:
            # Generar imagen basada en marca
            marca_file = p_data.get('brand', 'generico').lower().replace(' ', '-')
            product = models.Product(
                name=p_data["name"],
                price=p_data["price"],
                brand=p_data.get("brand", "Genérico"),
                type=p_data.get("type", "General"),
                description=p_data.get("description", ""),
                image=f"/images/marcas/{marca_file}.png",
                in_stock=True
            )
            db.add(product)

def seed_services(db: Session):
    logger.info("Sincronizando servicios...")
    for s_data in SERVICES_DATA:
        existing = db.query(models.Service).filter(models.Service.name == s_data["name"]).first()
        if not existing:
            service = models.Service(
                name=s_data["name"],
                description=s_data["description"],
                price_range=s_data.get("price_range", "Consultar"),
                icon=s_data.get("icon", "settings")
            )
            db.add(service)

def seed_blog_posts(db: Session):
    logger.info("Sincronizando blog...")
    for b_data in BLOG_POSTS_DATA:
        existing = db.query(models.BlogPost).filter(models.BlogPost.title == b_data["title"]).first()
        if not existing:
            post = models.BlogPost(**b_data)
            db.add(post)

def seed_all():
    """Función de entrada para Vercel"""
    db = next(database.get_db())
    try:
        seed_admin_user(db)
        seed_products(db)
        seed_services(db)
        seed_blog_posts(db)
        db.commit()
        print("✅ Base de datos sincronizada con 62 productos.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_all()
