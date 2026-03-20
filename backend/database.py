import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. URL de Neon desde variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Corrección de protocolo para SQLAlchemy
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Motor de base de datos
engine = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True,
    pool_recycle=300
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 4. Generador de sesiones para las rutas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
