"""initial schema from SQLAlchemy models

Revision ID: 20260528_0001
Revises:
Create Date: 2026-05-28
"""
from collections.abc import Sequence

from alembic import op
from sqlalchemy import MetaData

from app.database.base import Base
from app.database import models  # noqa: F401


revision: str = "20260528_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


SECURITY_TABLES = {
    "nguoi_dung",
    "vai_tro",
    "quyen",
    "vai_tro_quyen",
    "nhat_ky_dang_nhap",
    "nhat_ky_thao_tac",
    "nhat_ky_backup",
}


def _business_metadata() -> MetaData:
    metadata = MetaData()
    for table in Base.metadata.sorted_tables:
        if table.name not in SECURITY_TABLES:
            table.to_metadata(metadata)
    return metadata


def upgrade() -> None:
    _business_metadata().create_all(bind=op.get_bind())


def downgrade() -> None:
    _business_metadata().drop_all(bind=op.get_bind())
