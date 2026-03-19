import os
import logging
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from models import * # Asegúrate de que tus modelos de Pydantic sigan igual

logger = logging.getLogger(__name__)

# 1. La conexión maestra con la llave de Vercel/Neon
DATABASE_URL = os.getenv("DATABASE_URL")

# Truco de compatibilidad para Vercel
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 2. Configuración del motor SQL
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Database:
    def __init__(self):
        self.session = None

    def connect(self):
        """Prueba la conexión a Neon.tech"""
        try:
            # Intentamos conectar
            with engine.connect() as connection:
                logger.info("¡Conectado exitosamente a PostgreSQL en Neon.tech!")
        except Exception as e:
            logger.error(f"Error al conectar a la base de datos: {e}")
            raise

    # Ejemplo de cómo se adaptan las funciones (Productos)
    # Nota: Aquí adaptaremos el resto poco a poco, pero esto ya enciende el motor
    async def get_products(self) -> List[Product]:
        db = SessionLocal()
        try:
            # Lógica para traer productos de SQL
            pass 
        finally:
            db.close()

# Instancia global
database = Database()
