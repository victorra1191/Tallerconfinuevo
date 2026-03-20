import os
import sys
from pathlib import Path
from sqlalchemy.orm import Session

# Configuración de ruta
sys.path.append(str(Path(__file__).parent))

import database
import models

def seed_data():
    db = next(database.get_db())
    
    # 1. Limpiar datos viejos (opcional)
    db.query(models.Product).delete()
    db.query(models.Service).delete()

    # 2. Insertar Servicios
    servicios_iniciales = [
        models.Service(name="Cambio de Aceite", description="Mantenimiento preventivo con filtros premium", price_range="$45 - $85", icon="oil"),
        models.Service(name="Frenos", description="Revisión y cambio de pastillas/discos", price_range="$60 - $120", icon="brake"),
        models.Service(name="Diagnóstico Computarizado", description="Escaneo completo de sensores y motor", price_range="$35", icon="computer")
    ]
    
    # 3. Insertar Productos
    productos_iniciales = [
        models.Product(name="Aceite Sintético 5W-30", brand="Liqui Moly", type="Lubricantes", price=12.50, image="/images/marcas/liqui-moly.png", description="Aceite de alta calidad", in_stock=True),
        models.Product(name="Filtro de Aire", brand="WIX", type="Filtros", price=15.00, image="/images/marcas/generico.png", description="Filtro de alto flujo", in_stock=True)
    ]

    db.add_all(servicios_iniciales)
    db.add_all(productos_iniciales)
    db.commit()
    print("✅ Datos de Confiautos insertados con éxito")

if __name__ == "__main__":
    seed_data()
