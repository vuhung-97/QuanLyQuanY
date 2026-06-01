import os
from .base import Base

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, Session
from ..core.config import load_env


def build_database_url() -> URL:
    load_env()

    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    name = os.getenv("DB_NAME")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")

    missing = [
        key
        for key, value in {
            "DB_HOST": host,
            "DB_PORT": port,
            "DB_NAME": name,
            "DB_USER": user,
            "DB_PASSWORD": password,
        }.items()
        if not value
    ]
    if missing:
        raise RuntimeError("Missing required env vars: " + ", ".join(missing))

    try:
        port_number = int(port)  # type: ignore[arg-type]
    except ValueError as exc:
        raise RuntimeError("DB_PORT must be an integer") from exc
    if not 1 <= port_number <= 65535:
        raise RuntimeError("DB_PORT must be between 1 and 65535")

    db_url = URL.create(
        drivername="postgresql+psycopg",
        username=user,
        password=password,
        host=host,
        port=port_number,
        database=name,
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
