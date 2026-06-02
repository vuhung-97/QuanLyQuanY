from __future__ import annotations

import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlalchemy.engine import URL

from app.core.config import settings
from app.database.base import Base
import app.database.models  # noqa: F401


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_database_url() -> str:
    """Lấy DB URL cho Alembic từ settings, fallback alembic.ini."""
    if settings.DATABASE_URL:
        return settings.DATABASE_URL

    if all([settings.DB_HOST, settings.DB_PORT, settings.DB_NAME, settings.DB_USER, settings.DB_PASSWORD]):
        if not 1 <= settings.DB_PORT <= 65535:
            return config.get_main_option("sqlalchemy.url")

        return URL.create(
            drivername="postgresql+psycopg",
            username=settings.DB_USER,
            password=settings.DB_PASSWORD,
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            database=settings.DB_NAME,
        ).render_as_string(hide_password=False)

    return config.get_main_option("sqlalchemy.url")


def run_migrations_offline() -> None:
    url = get_database_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    config.set_main_option("sqlalchemy.url", get_database_url())

    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
