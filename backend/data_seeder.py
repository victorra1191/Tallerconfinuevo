import os
import sys
import hashlib
import logging
from pathlib import Path
from sqlalchemy.orm import Session
from datetime import datetime

# Configuración de ruta para Vercel
sys.path.append(str(Path(__file__).parent))

import database
import models

logger = logging.getLogger(__name__)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# === 1. PRODUCTOS (LOS 62 REGISTROS) ===
PRODUCTS_DATA = [
    {"name": "Engine Flush Plus", "price": 12.95, "sku": "4100420026577", "type": "Aditivo de Limpieza", "brand": "Liqui Moly", "description": "Limpia residuos internos del motor y mejora la eficiencia."},
    {"name": "Tapa Fugas De Aceite", "price": 15.00, "sku": "4100420025013", "type": "Aceite", "brand": "Liqui Moly", "description": "Lubrica el motor y mejora el rendimiento general."},
    {"name": "Carburador Cleaner A1", "price": 8.50, "sku": "CASBU-450", "type": "Limpiador de Carburador", "brand": "A1", "description": "Elimina depósitos en el carburador."},
    {"name": "Filtro De Aceite Al-3593", "price": 12.50, "sku": "AL-3593", "type": "Filtro de Aceite", "brand": "Genérico", "description": "Retiene impurezas del aceite."},
    {"name": "Grasa Multiuso Wurth", "price": 18.50, "sku": "4046777424942", "type": "Grasa", "brand": "Wurth", "description": "Lubricación de alta resistencia."},
    {"name": "Liquido De Freno Brake Fluid A1", "price": 6.50, "sku": "6297001486382", "type": "Fluido de Frenos", "brand": "A1", "description": "Alta performance hidráulica."},
    {"name": "Electronics Cleaner A1", "price": 6.50, "sku": "A1-LE-450", "type": "Limpiador", "brand": "A1", "description": "Disuelve grasa en electrónica."},
    {"name": "Brake Cleaner A1", "price": 6.00, "sku": "A1-LF-500", "type": "Limpiador", "brand": "A1", "description": "Limpia residuos en frenos."},
    {"name": "Acido Coil Brite", "price": 8.50, "sku": "COIL-BRITE", "type": "Limpiador", "brand": "Genérico", "description": "Uso especializado automotriz."},
    {"name": "Hsw 200 Plus Wurt Bombas Olor", "price": 12.50, "sku": "4065746391443", "type": "Eliminador de Olores", "brand": "Wurth", "description": "Elimina olores persistentes."},
    {"name": "Car Clean Set Wurt", "price": 25.00, "sku": "4052703649211", "type": "Kit de Limpieza", "brand": "Wurth", "description": "Set de limpieza completo."},
    {"name": "Reparador De Pneus Auto Wurt 220 Ml", "price": 15.00, "sku": "7891799462574", "type": "Reparador de Neumáticos", "brand": "Wurth", "description": "Sellador de emergencia."},
    {"name": "Limpieza Del Motor Wurth 500Ml", "price": 18.00, "sku": "10649008", "type": "Limpiador de Motor", "brand": "Wurth", "description": "Desengrasante de motor."},
    {"name": "Sellador De Radiador Wurt 250Ml", "price": 12.00, "sku": "910854511730", "type": "Sellador", "brand": "Wurth", "description": "Sella fugas en radiadores."},
    {"name": "Desengraxante Express Wurt 500Ml", "price": 14.00, "sku": "4099618249501", "type": "Desengrasante", "brand": "Wurth", "description": "Limpieza rápida de grasa."},
    {"name": "Silicona En Spray Wurt 300Ml", "price": 10.00, "sku": "4056807076942", "type": "Sellador/Silicona", "brand": "Wurth", "description": "Protege gomas y plásticos."},
    {"name": "Adictivo De Nafta Wurt 300Ml", "price": 8.00, "sku": "4065746019422", "type": "Aditivo", "brand": "Wurth", "description": "Mejora combustión de nafta."},
    {"name": "Limpiador De Válvulas De Gasolina Wurt 300Ml", "price": 9.50, "sku": "8460075507330", "type": "Limpiador", "brand": "Wurth", "description": "Limpia válvulas y cámara."},
    {"name": "Liquido De Frenos Wurt 250Ml", "price": 8.50, "sku": "4065746757737", "type": "Fluido de Frenos", "brand": "Wurth", "description": "Calidad alemana para frenos."},
    {"name": "Limpia Parabrisas Wurt 100Ml", "price": 6.00, "sku": "4045989514038", "type": "Limpiador", "brand": "Wurth", "description": "Visión clara."},
    {"name": "Pintura Aerosol Wurt 400Ml", "price": 12.00, "sku": "4056807623832", "type": "Pintura", "brand": "Wurth", "description": "Acabado profesional."},
    {"name": "Tapafugas De Radiador", "price": 8.50, "sku": "4100420025051", "type": "Sellador", "brand": "Genérico", "description": "Evita sobrecalentamiento."},
    {"name": "Grasa Dielectrica Wurt 85 Gr", "price": 10.50, "sku": "4056807695013", "type": "Grasa", "brand": "Wurth", "description": "Protege contactos eléctricos."},
    {"name": "Bombillo Wurt", "price": 8.00, "sku": "BOMBILLO-WURT", "type": "Bombillo", "brand": "Wurth", "description": "Iluminación automotriz."},
    {"name": "Limpiador De Inyectores Presurizado Wurt 500Ml", "price": 16.50, "sku": "INYECT-500", "type": "Limpiador", "brand": "Wurth", "description": "Limpieza profunda."},
    {"name": "Engine Clean Motor Systemreiniger Motul 300Ml", "price": 18.50, "sku": "5716304275994", "type": "Limpiador de Motor", "brand": "Motul", "description": "Limpieza interna avanzada."},
    {"name": "Super Diésel Additiv Liqui Moly 250Ml", "price": 14.50, "sku": "4100420025044", "type": "Aditivo", "brand": "Liqui Moly", "description": "Optimiza motores diésel."},
    {"name": "Bujias Iridium D-Lfr5Aix", "price": 25.00, "sku": "5648169728639", "type": "Repuesto", "brand": "Genérico", "description": "Mejor chispa."},
    {"name": "Varniz De Motor 135Ml Wurt", "price": 9.50, "sku": "7891799524609", "type": "Protector", "brand": "Wurth", "description": "Protege contra corrosión."},
    {"name": "Brillant 750 Ml", "price": 12.00, "sku": "8027486744916", "type": "Abrillantador", "brand": "Genérico", "description": "Brillo intenso."},
    {"name": "Air Filter 28113-1W000 Filtro Motor", "price": 12.50, "sku": "28113-1W000", "type": "Filtro", "brand": "Genérico", "description": "Filtración eficiente."},
    {"name": "Cabin Filter Ac-87139-Yzz20 Filtro Cabina", "price": 15.50, "sku": "AC-87139-YZZ20", "type": "Filtro", "brand": "Genérico", "description": "Aire limpio en cabina."},
    {"name": "Cabin Filter Ac-83236 Filtro Cabina", "price": 14.50, "sku": "AC-83236", "type": "Filtro", "brand": "Genérico", "description": "Filtro de polen."},
    {"name": "Cinta Eléctrica", "price": 3.50, "sku": "4045989541669", "type": "Accesorio", "brand": "Genérico", "description": "Aislante de alta calidad."},
    {"name": "Cabin Filter Ac-81950 Filtro Cabina", "price": 13.50, "sku": "AC-81950", "type": "Filtro", "brand": "Genérico", "description": "Filtro para sistemas AC."},
    {"name": "Air Filter 28113-1W000-B", "price": 11.50, "sku": "28113-1W000-B", "type": "Filtro", "brand": "Genérico", "description": "Repuesto de aire."},
    {"name": "Air Filter Ak 91001", "price": 10.50, "sku": "AK-91001", "type": "Filtro", "brand": "Genérico", "description": "Filtro de aire estándar."},
    {"name": "Air Filter Ak-16546-02N00", "price": 9.50, "sku": "AK-16546-02N00", "type": "Filtro", "brand": "Genérico", "description": "Filtro de aire reemplazo."},
    {"name": "Filtros De Gasolina 16405-02N10", "price": 8.50, "sku": "16405-02N10", "type": "Filtro", "brand": "Genérico", "description": "Filtro de combustible."},
    {"name": "Filtros De Gasolina 31112-1Rp000", "price": 9.50, "sku": "31112-1RP000", "type": "Filtro", "brand": "Genérico", "description": "Protege la inyección."},
    {"name": "Air Filter Ak-21050", "price": 8.50, "sku": "AK-21050", "type": "Filtro", "brand": "Genérico", "description": "Filtro de aire económico."},
    {"name": "Atf Multi Eni 1L", "price": 12.50, "sku": "8423178020175", "type": "Aceite ATF", "brand": "ENI", "description": "Fluido transmisión automática."},
    {"name": "Mp 80W-90 Manual Eni 4L", "price": 35.00, "sku": "8003699012646", "type": "Aceite Transmisión", "brand": "ENI", "description": "Lubricante cajas manuales."},
    {"name": "10W-30 Aceite Motul 4L", "price": 45.00, "sku": "3374650415550", "type": "Aceite", "brand": "Motul", "description": "Aceite motor gasolina."},
    {"name": "10W-30 1L Aceite Motul", "price": 15.00, "sku": "370960410042", "type": "Aceite", "brand": "Motul", "description": "Lubricante motor 1L."},
    {"name": "5W-30 Aceite Eni 1L", "price": 12.00, "sku": "8003699010826", "type": "Aceite", "brand": "ENI", "description": "Aceite sintético moderno."},
    {"name": "Aticogelante 1Galon", "price": 18.00, "sku": "ANTICONG-1GAL", "type": "Anticongelante", "brand": "Genérico", "description": "Refrigerante listo para usar."},
    {"name": "Aceite Diésel 15W-40 19L A1", "price": 85.00, "sku": "DIESEL-15W40-19L", "type": "Aceite", "brand": "A1", "description": "Aceite diésel alto kilometraje."},
    {"name": "Limpiador De Manos Wurth 4L", "price": 22.00, "sku": "4099618626777", "type": "Limpiador", "brand": "Wurth", "description": "Remueve grasa pesada."},
    {"name": "Silicon Negro Wurth 200Ml", "price": 8.50, "sku": "7891799499549", "type": "Sellador/Silicona", "brand": "Wurth", "description": "Formador de juntas."},
    {"name": "Super Limpiador Parabrisas", "price": 6.50, "sku": "1003989678863", "type": "Limpiador", "brand": "Genérico", "description": "Limpieza de vidrios exterior."},
    {"name": "Aceite Motul 15W-40 5L", "price": 38.00, "sku": "3374650257730", "type": "Aceite", "brand": "Motul", "description": "Lubricante mineral avanzado."},
    {"name": "Adhesivo Metal Wurth 25Gr", "price": 12.50, "sku": "4065746292412", "type": "Adhesivo", "brand": "Wurth", "description": "Pegado de piezas metálicas."},
    {"name": "Cola Multiuso Wurth 400Ml", "price": 14.00, "sku": "COLA-MULTI-400", "type": "Adhesivo", "brand": "Wurth", "description": "Pegamento multiusos."},
    {"name": "Pulidor De Metal Wurth", "price": 11.50, "sku": "PULIDOR-METAL", "type": "Pulidor", "brand": "Wurth", "description": "Brillo para metales."},
    {"name": "Adhesivo Parabrisas", "price": 16.00, "sku": "ADESIVO-PARAB", "type": "Adhesivo", "brand": "Genérico", "description": "Sellado de vidrios."},
    {"name": "Sellador Carrocería Wurth", "price": 18.50, "sku": "SELLADOR-CARROCERIA", "type": "Sellador", "brand": "Wurth", "description": "Sella juntas estructura."},
    {"name": "Adhesivo Instantáneo 2G Wurth", "price": 8.50, "sku": "4058794437478", "type": "Adhesivo", "brand": "Wurth", "description": "Pegado rápido."},
    {"name": "Rost Off Aflojatuercas Wurth", "price": 13.50, "sku": "4058794504781", "type": "Desoxidante", "brand": "Wurth", "description": "Afloja piezas oxidadas."},
    {"name": "Escobilla Wurth 21", "price": 7.50, "sku": "LIMPIA-21", "type": "Escobilla", "brand": "Wurth", "description": "Limpiaparabrisas 21\"."},
    {"name": "Escobilla Wurth 26", "price": 8.00, "sku": "LIMPIA-26", "type": "Escobilla", "brand": "Wurth", "description": "Limpiaparabrisas 26\"."},
    {"name": "Escobilla Wurth 14", "price": 6.50, "sku": "LIMPIA-14", "type": "Escobilla", "brand": "Wurth", "description": "Limpiaparabrisas 14\"."}
]

# === 2. SERVICIOS ===
SERVICES_DATA = [
    {"name": "Aire Acondicionado Automotriz", "description": "Diagnóstico y mantenimiento completo sistema A/C", "price_range": "$40 - $200", "icon": "snowflake"},
    {"name": "Chapistería y Pintura", "description": "Reparación de carrocería profesional", "price_range": "3-7 días", "icon": "brush"},
    {"name": "Mecánica Ligera", "description": "Reparaciones menores y preventivo", "price_range": "1-3 horas", "icon": "settings"},
    {"name": "Cambio de Aceite y Filtros", "description": "Lubricación con aceites premium Motul/ENI", "price_range": "45 min", "icon": "oil"},
    {"name": "Diagnóstico Computarizado", "description": "Escaneo con equipos profesionales", "price_range": "30-60 min", "icon": "computer"},
    {"name": "Instalación de Papel Ahumado", "description": "Films de alta calidad y garantía", "price_range": "2-3 horas", "icon": "sun"},
    {"name": "Reparación de Frenos", "description": "Servicio de frenos con repuestos originales", "price_range": "2-4 horas", "icon": "brake"},
    {"name": "Suspensión y Dirección", "description": "Diagnóstico y reparación de sistema suspensión", "price_range": "3-5 horas", "icon": "truck"}
]

# === 3. BLOG POSTS ===
BLOG_DATA = [
    {"title": "¿Cuándo hacer mantenimiento preventivo?", "excerpt": "Intervalos ideales según aceite.", "content": "Contenido completo...", "author": "Miguel Herrera", "category": "Mantenimiento", "read_time": "5 min"},
    {"title": "Aire Acondicionado: Señales de servicio", "excerpt": "Identifica cuándo necesita atención.", "content": "Contenido completo...", "author": "Luis Morales", "category": "Aire Acondicionado", "read_time": "4 min"},
    {"title": "Aceites Motul vs ENI", "excerpt": "Comparación técnica entre marcas.", "content": "Contenido completo...", "author": "Miguel Herrera", "category": "Productos", "read_time": "6 min"}
]

def seed_all():
    db = next(database.get_db())
    try:
        # Sincronizar Admin
        if not db.query(models.AdminUser).filter_by(username="admin").first():
            db.add(models.AdminUser(username="admin", email="admin@confiautos.com.pa", password_hash=hash_password("confiautos123"), full_name="Administrador"))

        # Sincronizar Productos
        for p in PRODUCTS_DATA:
            if not db.query(models.Product).filter_by(name=p["name"]).first():
                marca_file = p['brand'].lower().replace(' ', '-')
                db.add(models.Product(**p, image=f"/images/marcas/{marca_file}.png"))

        # Sincronizar Servicios
        for s in SERVICES_DATA:
            if not db.query(models.Service).filter_by(name=s["name"]).first():
                db.add(models.Service(**s))

        # Sincronizar Blog
        for b in BLOG_DATA:
            if not db.query(models.BlogPost).filter_by(title=b["title"]).first():
                db.add(models.BlogPost(**b))

        db.commit()
        print("✅ Base de datos Confiautos sincronizada al 100%")
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_all()
