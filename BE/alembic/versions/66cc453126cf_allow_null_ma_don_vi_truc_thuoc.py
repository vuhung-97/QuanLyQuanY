"""allow null ma_don_vi_truc_thuoc

Revision ID: 66cc453126cf
Revises: 20260528_0001
Create Date: 2026-05-28 16:42:15.096130
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa



revision: str = '66cc453126cf'
down_revision: str | None = '20260528_0001'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column(
        "don_vi",
        "ma_don_vi_truc_thuoc",
        existing_type=sa.String(length=10),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "don_vi",
        "ma_don_vi_truc_thuoc",
        existing_type=sa.String(length=10),
        nullable=False,
    )
