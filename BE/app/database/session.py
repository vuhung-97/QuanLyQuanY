import os
from .base import Base

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from ..core.config import load_env


def build_database_url() -> str:
    load_env()

    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    name = os.getenv("DB_NAME")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")

    missing = [
        key
        for key, value in {
            "DB_NAME": name,
            "DB_USER": user,
            "DB_PASSWORD": password,
        }.items()
        if not value
    ]
    if missing:
        raise RuntimeError("Missing required env vars: " + ", ".join(missing))

    return f"postgresql+psycopg://{user}:{password}@{host}:{port}/{name}"


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
