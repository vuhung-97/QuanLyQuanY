from pathlib import Path
from typing import ClassVar

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent.parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "data_med"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    API_PORT: int = 8000
    FRONTEND_URLS: str = ""
    DATABASE_URL: str | None = None
    JWT_SECRET_KEY: str = "jwt:BA8@9r#.30g7"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ADMIN_PASSWORD: str = "admin123"
    BACKUP_DIR: str = "backups"


settings = Settings()


def setup_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
