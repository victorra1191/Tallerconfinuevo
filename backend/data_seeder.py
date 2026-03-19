"""
Data seeder to populate the database with initial data
"""
import asyncio
from database import database
from models import Product, Service, BlogPost, AdminUser
import hashlib
import logging

logger = logging.getLogger(__name__)

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# Admin user data
ADMIN_USER_DATA = {
    "username": "admin",
    "email": "admin@confiautos.com.pa",
    "password": "confiautos123",  # Will be hashed
    "full_name": "Administrador Confiautos",
    "role": "admin"
}

# Products data from mockData.js - ALL 62 PRODUCTS
PRODUCTS_DATA = [
    {"id": "1", "name": "Engine Flush Plus", "price": 12.95, "sku": "4100420026577", "type": "Aditivo de Limpieza", "brand": "Genérico", "uses": "Motores a gasolina o diésel", "description": "Limpia residuos internos del motor y mejora la eficiencia.", "keywords": ["motor", "limpieza", "aditivo", "gasolina", "diesel"]},
    {"id": "2", "name": "Tapa Fugas De Aceite", "price": 15.00, "sku": "4100420025013", "type": "Aceite", "brand": "Genérico", "uses": "Motores de autos, motos o maquinaria", "description": "Lubrica el motor y mejora el rendimiento general.", "keywords": ["aceite", "fugas", "motor", "lubricante"]},
    {"id": "3", "name": "Carburador Cleaner A1", "price": 8.50, "sku": "CASBU-450", "type": "Limpiador de Carburador", "brand": "A1", "uses": "Carburadores y sistemas de admisión", "description": "Elimina depósitos en el carburador y mejora la mezcla aire-combustible.", "keywords": ["carburador", "limpiador", "admision", "combustible"]},
    {"id": "4", "name": "Filtro De Aceite Al-3593", "price": 12.50, "sku": "AL-3593", "type": "Filtro de Aceite", "brand": "Genérico", "uses": "Motores automotrices", "description": "Retiene impurezas del aceite y protege componentes internos.", "keywords": ["filtro", "aceite", "motor", "proteccion"]},
    {"id": "5", "name": "Grasa Multiuso Wurth", "price": 18.50, "sku": "4046777424942", "type": "Grasa", "brand": "Wurth", "uses": "Chasis, rodamientos, piezas móviles", "description": "Lubricación de alta resistencia para reducir fricción y desgaste.", "keywords": ["grasa", "lubricacion", "chasis", "rodamientos"]},
    {"id": "6", "name": "Liquido De Freno Brake Fluid A1", "price": 6.50, "sku": "6297001486382", "type": "Fluido de Frenos", "brand": "A1", "uses": "Sistema de frenos automotriz", "description": "Fluido de frenos de alta performance para sistemas hidráulicos.", "keywords": ["frenos", "fluido", "hidraulico", "seguridad"]},
    {"id": "7", "name": "Electronics Cleaner A1", "price": 6.50, "sku": "A1-LE-450", "type": "Limpiador", "brand": "A1", "uses": "Piezas metálicas y mecánicas", "description": "Disuelve grasa, polvo y residuos en superficies metálicas.", "keywords": ["limpiador", "electronico", "grasa", "metal"]},
    {"id": "8", "name": "Brake Cleaner A1", "price": 6.00, "sku": "A1-LF-500", "type": "Limpiador", "brand": "A1", "uses": "Piezas metálicas y mecánicas", "description": "Disuelve grasa, polvo y residuos en superficies metálicas.", "keywords": ["frenos", "limpiador", "grasa", "polvo"]},
    {"id": "9", "name": "Acido Coil Brite", "price": 8.50, "sku": "COIL-BRITE", "type": "Limpiador", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["acido", "limpieza", "serpentines", "aire"]},
    {"id": "10", "name": "Hsw 200 Plus Wurt Bombas Olor", "price": 12.50, "sku": "4065746391443", "type": "Eliminador de Olores", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["olor", "bomba", "eliminador", "interior"]},
    {"id": "11", "name": "Car Clean Set Wurt", "price": 25.00, "sku": "4052703649211", "type": "Kit de Limpieza", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["limpieza", "set", "completo", "auto"]},
    {"id": "12", "name": "Reparador De Pneus Auto Wurt 220 Ml", "price": 15.00, "sku": "7891799462574", "type": "Reparador de Neumáticos", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["neumaticos", "reparador", "emergencia", "sellador"]},
    {"id": "13", "name": "Limpieza Del Motor Wurth 500Ml", "price": 18.00, "sku": "10649008", "type": "Limpiador de Motor", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["motor", "limpieza", "desengrasante", "wurth"]},
    {"id": "14", "name": "Sellador De Radiador Wurt 250Ml", "price": 12.00, "sku": "910854511730", "type": "Sellador", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["radiador", "sellador", "fugas", "refrigeracion"]},
    {"id": "15", "name": "Desengraxante Express Wurt 500Ml", "price": 14.00, "sku": "4099618249501", "type": "Desengrasante", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["desengrasante", "express", "grasa", "limpieza"]},
    {"id": "16", "name": "Silicona En Spray Wurt 300Ml", "price": 10.00, "sku": "4056807076942", "type": "Sellador/Silicona", "brand": "Wurth", "uses": "Sellado de componentes mecánicos", "description": "Sella juntas y previene fugas en motores y carrocerías.", "keywords": ["silicona", "sellador", "spray", "juntas"]},
    {"id": "17", "name": "Adictivo De Nafta Wurt 300Ml", "price": 8.00, "sku": "4065746019422", "type": "Aditivo", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["aditivo", "nafta", "combustible", "motor"]},
    {"id": "18", "name": "Limpiador De Válvulas De Gasolina Wurt 300Ml", "price": 9.50, "sku": "8460075507330", "type": "Limpiador", "brand": "Wurth", "uses": "Piezas metálicas y mecánicas", "description": "Disuelve grasa, polvo y residuos en superficies metálicas.", "keywords": ["valvulas", "gasolina", "limpiador", "motor"]},
    {"id": "19", "name": "Liquido De Frenos Wurt 250Ml", "price": 8.50, "sku": "4065746757737", "type": "Fluido de Frenos", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["frenos", "liquido", "hidraulico", "wurth"]},
    {"id": "20", "name": "Limpia Parabrisas Wurt 100Ml", "price": 6.00, "sku": "4045989514038", "type": "Limpiador", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["parabrisas", "limpiador", "vidrio", "vision"]},
    {"id": "21", "name": "Pintura Aerosol Wurt 400Ml", "price": 12.00, "sku": "4056807623832", "type": "Pintura", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["pintura", "aerosol", "retoque", "color"]},
    {"id": "22", "name": "Tapafugas De Radiador", "price": 8.50, "sku": "4100420025051", "type": "Sellador", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["radiador", "tapafugas", "sellador", "refrigeracion"]},
    {"id": "23", "name": "Grasa Dielectrica Wurt 85 Gr", "price": 10.50, "sku": "4056807695013", "type": "Grasa", "brand": "Wurth", "uses": "Chasis, rodamientos, piezas móviles", "description": "Lubricación de alta resistencia para reducir fricción y desgaste.", "keywords": ["grasa", "dielectrica", "electrica", "contactos"]},
    {"id": "24", "name": "Bombillo Wurt", "price": 8.00, "sku": "BOMBILLO-WURT", "type": "Bombillo", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["bombillo", "luz", "iluminacion", "electrico"]},
    {"id": "25", "name": "Limpiador De Inyectores Presurizado Wurt 500Ml", "price": 16.50, "sku": "INYECT-500", "type": "Limpiador", "brand": "Wurth", "uses": "Piezas metálicas y mecánicas", "description": "Disuelve grasa, polvo y residuos en superficies metálicas.", "keywords": ["inyectores", "limpiador", "presurizado", "combustible"]},
    {"id": "26", "name": "Engine Clean Motor Systemreiniger Motul 300Ml", "price": 18.50, "sku": "5716304275994", "type": "Limpiador de Motor", "brand": "Motul", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["motor", "limpiador", "system", "motul"]},
    {"id": "27", "name": "Super Diésel Additiv Liqui Moly 250Ml", "price": 14.50, "sku": "4100420025044", "type": "Aditivo", "brand": "Liqui Moly", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["diesel", "aditivo", "liqui", "moly"]},
    {"id": "28", "name": "Bujias Iridium D-Lfr5Aix", "price": 25.00, "sku": "5648169728639", "type": "Repuesto", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["bujias", "iridium", "encendido", "motor"]},
    {"id": "29", "name": "Varniz De Motor 135Ml Wurt", "price": 9.50, "sku": "7891799524609", "type": "Protector", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["varniz", "motor", "protector", "acabado"]},
    {"id": "30", "name": "Brillant 750 Ml", "price": 12.00, "sku": "8027486744916", "type": "Abrillantador", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["brillant", "abrillantador", "shine", "brillo"]},
    {"id": "31", "name": "Air Filter 28113-1W000 Filtro Motor", "price": 12.50, "sku": "28113-1W000", "type": "Filtro", "brand": "Genérico", "uses": "Motores o sistemas hidráulicos", "description": "Filtración eficiente de partículas y contaminantes.", "keywords": ["filtro", "aire", "motor", "28113"]},
    {"id": "32", "name": "Cabin Filter Ac-87139-Yzz20 Filtro De Cabina", "price": 15.50, "sku": "AC-87139-YZZ20", "type": "Filtro", "brand": "Genérico", "uses": "Motores o sistemas hidráulicos", "description": "Filtración eficiente de partículas y contaminantes.", "keywords": ["filtro", "cabina", "aire", "ac"]},
    {"id": "33", "name": "Cabin Filter Ac-83236 Filtro De Cabina", "price": 14.50, "sku": "AC-83236", "type": "Filtro", "brand": "Genérico", "uses": "Motores o sistemas hidráulicos", "description": "Filtración eficiente de partículas y contaminantes.", "keywords": ["filtro", "cabina", "aire", "83236"]},
    {"id": "34", "name": "Cinta Eléctrica", "price": 3.50, "sku": "4045989541669", "type": "Accesorio", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["cinta", "electrica", "aislante", "cables"]},
    {"id": "35", "name": "Cabin Filter Ac-81950 Filtro Cabina", "price": 13.50, "sku": "AC-81950", "type": "Filtro", "brand": "Genérico", "uses": "Motores o sistemas hidráulicos", "description": "Filtración eficiente de partículas y contaminantes.", "keywords": ["filtro", "cabina", "aire", "81950"]},
    {"id": "36", "name": "Air Filter 28113-1W000", "price": 11.50, "sku": "28113-1W000-B", "type": "Filtro", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["filtro", "aire", "28113", "motor"]},
    {"id": "37", "name": "Air Filter Ak 91001", "price": 10.50, "sku": "AK-91001", "type": "Filtro", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["filtro", "aire", "ak", "91001"]},
    {"id": "38", "name": "Air Filter Ak-16546-02N00", "price": 9.50, "sku": "AK-16546-02N00", "type": "Filtro", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["filtro", "aire", "16546", "02n00"]},
    {"id": "39", "name": "Filtros De Gasolina 16405-02N10", "price": 8.50, "sku": "16405-02N10", "type": "Filtro", "brand": "Genérico", "uses": "Motores o sistemas hidráulicos", "description": "Filtración eficiente de partículas y contaminantes.", "keywords": ["filtro", "gasolina", "combustible", "16405"]},
    {"id": "40", "name": "Filtros De Gasolina 31112-1Rp000", "price": 9.50, "sku": "31112-1RP000", "type": "Filtro", "brand": "Genérico", "uses": "Motores o sistemas hidráulicos", "description": "Filtración eficiente de partículas y contaminantes.", "keywords": ["filtro", "gasolina", "combustible", "31112"]},
    {"id": "41", "name": "Air Filter Ak-21050", "price": 8.50, "sku": "AK-21050", "type": "Filtro", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["filtro", "aire", "ak", "21050"]},
    {"id": "42", "name": "Atf Multi Eni 1L", "price": 12.50, "sku": "8423178020175", "type": "Aceite ATF", "brand": "ENI", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["atf", "transmision", "automatica", "eni"]},
    {"id": "43", "name": "Mp 80W-90 Manual Transmisión Eni 4L", "price": 35.00, "sku": "8003699012646", "type": "Aceite de Transmisión", "brand": "ENI", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["transmision", "manual", "80w90", "eni"]},
    {"id": "44", "name": "10W-30 Aceite Motul 4L", "price": 45.00, "sku": "3374650415550", "type": "Aceite", "brand": "Motul", "uses": "Motores de autos, motos o maquinaria", "description": "Lubrica el motor y mejora el rendimiento general.", "keywords": ["aceite", "motor", "10w30", "motul"]},
    {"id": "45", "name": "10W-30 1L Aceite Motul", "price": 15.00, "sku": "370960410042", "type": "Aceite", "brand": "Motul", "uses": "Motores de autos, motos o maquinaria", "description": "Lubrica el motor y mejora el rendimiento general.", "keywords": ["aceite", "motor", "10w30", "1litro"]},
    {"id": "46", "name": "5W-30 Aceite Eni 1L", "price": 12.00, "sku": "8003699010826", "type": "Aceite", "brand": "ENI", "uses": "Motores de autos, motos o maquinaria", "description": "Lubrica el motor y mejora el rendimiento general.", "keywords": ["aceite", "motor", "5w30", "eni"]},
    {"id": "47", "name": "Aticogelante 1Galon", "price": 18.00, "sku": "ANTICONG-1GAL", "type": "Anticongelante", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["anticongelante", "refrigerante", "galon", "radiador"]},
    {"id": "48", "name": "Aceite Diésel 15W-40 19L A1", "price": 85.00, "sku": "DIESEL-15W40-19L", "type": "Aceite", "brand": "A1", "uses": "Motores de autos, motos o maquinaria", "description": "Lubrica el motor y mejora el rendimiento general.", "keywords": ["aceite", "diesel", "15w40", "19litros"]},
    {"id": "49", "name": "Limpiador De Manos Wurth 4L", "price": 22.00, "sku": "4099618626777", "type": "Limpiador", "brand": "Wurth", "uses": "Piezas metálicas y mecánicas", "description": "Disuelve grasa, polvo y residuos en superficies metálicas.", "keywords": ["limpiador", "manos", "wurth", "4litros"]},
    {"id": "50", "name": "Silicon Negro Wurth 200Ml", "price": 8.50, "sku": "7891799499549", "type": "Sellador/Silicona", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["silicon", "negro", "sellador", "wurth"]},
    {"id": "51", "name": "Super Limpiador De Parabrisas", "price": 6.50, "sku": "1003989678863", "type": "Limpiador", "brand": "Genérico", "uses": "Piezas metálicas y mecánicas", "description": "Disuelve grasa, polvo y residuos en superficies metálicas.", "keywords": ["limpiador", "parabrisas", "vidrio", "super"]},
    {"id": "52", "name": "Aceite Motul 15W-40 5L", "price": 38.00, "sku": "3374650257730", "type": "Aceite", "brand": "Motul", "uses": "Motores de autos, motos o maquinaria", "description": "Lubrica el motor y mejora el rendimiento general.", "keywords": ["aceite", "motul", "15w40", "5litros"]},
    {"id": "53", "name": "Adesivo Liquido Para Metal Wurth 25Gr", "price": 12.50, "sku": "4065746292412", "type": "Adhesivo", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["adhesivo", "metal", "wurth", "25gr"]},
    {"id": "54", "name": "Colá Multiuso Wurth 400Ml", "price": 14.00, "sku": "COLA-MULTI-400", "type": "Adhesivo", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["cola", "multiuso", "adhesivo", "wurth"]},
    {"id": "55", "name": "Pulidor De Metal Wurth", "price": 11.50, "sku": "PULIDOR-METAL", "type": "Pulidor", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["pulidor", "metal", "brillo", "wurth"]},
    {"id": "56", "name": "Adesivo De Parabrisas", "price": 16.00, "sku": "ADESIVO-PARAB", "type": "Adhesivo", "brand": "Genérico", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["adhesivo", "parabrisas", "vidrio", "instalacion"]},
    {"id": "57", "name": "Sellador De Carrocería Wurth", "price": 18.50, "sku": "SELLADOR-CARROCERIA", "type": "Sellador", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["sellador", "carroceria", "estructura", "wurth"]},
    {"id": "58", "name": "Adhesivo Instantáneo 2G Wurth", "price": 8.50, "sku": "4058794437478", "type": "Adhesivo", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["adhesivo", "instantaneo", "rapido", "2gr"]},
    {"id": "59", "name": "Rost Off Aflojatuercas Wurth", "price": 13.50, "sku": "4058794504781", "type": "Desoxidante", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["aflojatuercas", "oxidado", "penetrante", "wurth"]},
    {"id": "60", "name": "Limpia Parabrisas Wurth 21", "price": 7.50, "sku": "LIMPIA-21", "type": "Escobilla", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["escobilla", "parabrisas", "21", "wurth"]},
    {"id": "61", "name": "Limpia Parabrisas Wurth 26", "price": 8.00, "sku": "LIMPIA-26", "type": "Escobilla", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["escobilla", "parabrisas", "26", "wurth"]},
    {"id": "62", "name": "Limpia Parabrisas 14 Wurth", "price": 6.50, "sku": "LIMPIA-14", "type": "Escobilla", "brand": "Wurth", "uses": "Aplicación automotriz general", "description": "Producto automotriz para uso especializado.", "keywords": ["escobilla", "parabrisas", "14", "wurth"]}
]

# Services data from mockData.js
SERVICES_DATA = [
    {
        "id": "1",
        "name": "Aire Acondicionado Automotriz",
        "description": "Diagnóstico, reparación y mantenimiento completo del sistema de A/C con equipos de última generación",
        "duration": "2-4 horas",
        "includes": ["Diagnóstico computarizado completo", "Revisión de gas refrigerante", "Limpieza de filtros y evaporador", "Prueba de funcionamiento", "Garantía de 1 año"],
        "specialty": True,
        "badge": "ESPECIALIDAD",
        "category": "Climatización"
    },
    {
        "id": "2",
        "name": "Chapistería y Pintura",
        "description": "Reparación de carrocería y pintura profesional con técnicas avanzadas y garantía total",
        "duration": "3-7 días",
        "includes": ["Evaluación completa de daños", "Preparación profesional de superficie", "Aplicación de pintura automotriz", "Pulido y acabado final", "Garantía de color"],
        "specialty": True,
        "badge": "PREMIUM",
        "category": "Carrocería"
    },
    {
        "id": "3",
        "name": "Mecánica Ligera",
        "description": "Reparaciones menores y mantenimiento preventivo con técnicos certificados",
        "duration": "1-3 horas",
        "includes": ["Diagnóstico inicial gratuito", "Cambio de piezas menores", "Ajustes y calibraciones", "Recomendaciones preventivas", "Garantía del trabajo"],
        "category": "Mecánica"
    },
    {
        "id": "4",
        "name": "Cambio de Aceite y Filtros",
        "description": "Servicio completo de lubricación con aceites premium Motul y ENI",
        "duration": "45 minutos",
        "includes": ["Aceite premium a elección", "Filtro de aceite original", "Revisión completa de niveles", "Inspección general gratuita", "Registro de mantenimiento"],
        "badge": "RÁPIDO",
        "category": "Mantenimiento"
    },
    {
        "id": "5",
        "name": "Diagnóstico Computarizado",
        "description": "Escaneo completo con equipos profesionales de última generación",
        "duration": "30-60 minutos",
        "includes": ["Lectura completa de códigos", "Reporte técnico detallado", "Recomendaciones prioritarias", "Borrado de códigos", "Consulta técnica"],
        "badge": "TECNOLOGÍA",
        "category": "Diagnóstico"
    },
    {
        "id": "6",
        "name": "Instalación de Papel Ahumado",
        "description": "Polarizado profesional con films de alta calidad y garantía extendida",
        "duration": "2-3 horas",
        "includes": ["Medición y corte preciso", "Instalación libre de burbujas", "Films certificados", "Limpieza completa", "Garantía de 2 años"],
        "badge": "GARANTÍA 2 AÑOS",
        "category": "Accesorios"
    },
    {
        "id": "7",
        "name": "Reparación de Frenos",
        "description": "Servicio completo de sistema de frenos con repuestos originales",
        "duration": "2-4 horas",
        "includes": ["Inspección completa del sistema", "Cambio de pastillas/zapatas", "Revisión de discos/tambores", "Purgado del sistema", "Prueba de carretera"],
        "badge": "SEGURIDAD",
        "category": "Frenos"
    },
    {
        "id": "8",
        "name": "Suspensión y Dirección",
        "description": "Diagnóstico y reparación de sistema de suspensión y dirección",
        "duration": "3-5 horas",
        "includes": ["Diagnóstico computarizado", "Revisión de amortiguadores", "Inspección de rótulas", "Alineación incluida", "Prueba de manejo"],
        "category": "Suspensión"
    }
]

# Blog posts data
BLOG_POSTS_DATA = [
    {
        "id": "1",
        "title": "¿Cuándo hacer mantenimiento preventivo a tu auto?",
        "excerpt": "Conoce los intervalos ideales según el tipo de aceite: convencional, semi-sintético o sintético. Guía completa con kilometrajes y tiempos.",
        "content": "El mantenimiento preventivo es clave para la longevidad de tu vehículo. Con aceites Motul puedes extender los intervalos...",
        "author": "Ing. Miguel Herrera",
        "category": "Mantenimiento",
        "read_time": "5 min"
    },
    {
        "id": "2",
        "title": "Aire Acondicionado: Señales de que necesita servicio",
        "excerpt": "Aprende a identificar cuándo tu sistema de A/C necesita atención. Desde ruidos extraños hasta aire caliente.",
        "content": "El aire acondicionado es esencial en el clima panameño. Estas señales te indicarán cuándo necesita servicio...",
        "author": "Téc. Luis Morales",
        "category": "Aire Acondicionado",
        "read_time": "4 min"
    },
    {
        "id": "3",
        "title": "Aceites Motul vs ENI: ¿Cuál elegir para tu motor?",
        "excerpt": "Comparación técnica entre las marcas premium. Viscosidades, aditivos y rendimiento según el tipo de motor.",
        "content": "Tanto Motul como ENI son aceites premium, pero cada uno tiene características específicas...",
        "author": "Ing. Miguel Herrera",
        "category": "Productos",
        "read_time": "6 min"
    }
]

async def seed_products():
    """Seed products data"""
    logger.info("Seeding products...")
    
    # Check if products already exist
    existing_products = await database.get_products()
    if existing_products:
        logger.info(f"Products already exist ({len(existing_products)} found). Skipping product seeding.")
        return
    
    for product_data in PRODUCTS_DATA:
        product = Product(**product_data)
        await database.create_product(product)
    
    logger.info(f"Seeded {len(PRODUCTS_DATA)} products")

async def seed_services():
    """Seed services data"""
    logger.info("Seeding services...")
    
    # Check if services already exist
    existing_services = await database.get_services()
    if existing_services:
        logger.info(f"Services already exist ({len(existing_services)} found). Skipping service seeding.")
        return
    
    for service_data in SERVICES_DATA:
        service = Service(**service_data)
        await database.create_service(service)
    
    logger.info(f"Seeded {len(SERVICES_DATA)} services")

async def seed_admin_user():
    """Seed default admin user"""
    logger.info("Seeding admin user...")
    
    # Check if admin user already exists
    existing_admin = await database.get_admin_user_by_username(ADMIN_USER_DATA["username"])
    if existing_admin:
        logger.info("Admin user already exists. Skipping admin user seeding.")
        return
    
    # Create admin user
    admin_user = AdminUser(
        username=ADMIN_USER_DATA["username"],
        email=ADMIN_USER_DATA["email"],
        password_hash=hash_password(ADMIN_USER_DATA["password"]),
        full_name=ADMIN_USER_DATA["full_name"],
        role=ADMIN_USER_DATA["role"]
    )
    
    await database.create_admin_user(admin_user)
    logger.info(f"Created admin user: {ADMIN_USER_DATA['username']} / {ADMIN_USER_DATA['password']}")

async def seed_blog_posts():
    """Seed blog posts data"""
    logger.info("Seeding blog posts...")
    
    # Check if blog posts already exist
    existing_posts = await database.get_blog_posts(published_only=False)
    if existing_posts:
        logger.info(f"Blog posts already exist ({len(existing_posts)} found). Skipping blog post seeding.")
        return
    
    for post_data in BLOG_POSTS_DATA:
        post = BlogPost(**post_data)
        result = await database.create_blog_post(post)
    
    logger.info(f"Seeded {len(BLOG_POSTS_DATA)} blog posts")

async def seed_all_data():
    """Seed all initial data"""
    try:
        await database.connect()
        await seed_admin_user()  # Seed admin user first
        await seed_products()
        await seed_services()
        await seed_blog_posts()
        logger.info("Data seeding completed successfully")
    except Exception as e:
        logger.error(f"Error seeding data: {e}")
        raise
    finally:
        await database.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_all_data())
