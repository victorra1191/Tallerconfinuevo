import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Obtenemos la URL de Vercel
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Reparación de protocolo (Muy importante para SQLAlchemy)
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Creamos el motor de base de datos
engine = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True, # Verifica si la conexión sigue viva
    pool_recycle=300    # Reinicia conexiones viejas
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Función para que las rutas usen la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
