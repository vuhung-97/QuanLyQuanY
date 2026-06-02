from .base import Base

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, Session
from ..core.config import settings


def build_database_url() -> str | URL:
    if settings.DATABASE_URL:
        return settings.DATABASE_URL

    if not all([settings.DB_HOST, settings.DB_PORT, settings.DB_NAME, settings.DB_USER, settings.DB_PASSWORD]):
        missing = [
            key
            for key, value in {
                "DB_HOST": settings.DB_HOST,
                "DB_PORT": settings.DB_PORT,
                "DB_NAME": settings.DB_NAME,
                "DB_USER": settings.DB_USER,
                "DB_PASSWORD": settings.DB_PASSWORD,
            }.items()
            if not value
        ]
        raise RuntimeError("Missing required env vars: " + ", ".join(missing))

    if not 1 <= settings.DB_PORT <= 65535:
        raise RuntimeError("DB_PORT must be between 1 and 65535")

    db_url = URL.create(
        drivername="postgresql+psycopg",
        username=settings.DB_USER,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        database=settings.DB_NAME,
    )
    return db_url


engine = create_engine(build_database_url())
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def create_db():
    Base.metadata.create_all(engine)
    print("Tables created.")


def get_db():
    """Hàm dependency để lấy một database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
