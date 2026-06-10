"""drop orphan columns gioi_tinh, nghe_nghiep, dan_toc from benh_an

These columns were accidentally added to benh_an (raw SQL, no migration).
They belong to quan_nhan table and have been migrated there.

Revision ID: 20260610_000004
Revises: 20260610_000003
Create Date: 2026-06-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260610_000004"
down_revision: Union[str, None] = "20260610_000003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("benh_an", "gioi_tinh")
    op.drop_column("benh_an", "nghe_nghiep")
    op.drop_column("benh_an", "dan_toc")


def downgrade() -> None:
    op.add_column("benh_an", sa.Column("gioi_tinh", sa.String(20), nullable=True))
    op.add_column("benh_an", sa.Column("nghe_nghiep", sa.String(100), nullable=True))
    op.add_column("benh_an", sa.Column("dan_toc", sa.String(50), nullable=True))
