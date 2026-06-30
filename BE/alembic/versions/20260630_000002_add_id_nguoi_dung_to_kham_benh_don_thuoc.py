"""add id_nguoi_dung to kham_benh and don_thuoc

Revision ID: 20260630_000002
Revises: 20260630_000001
Create Date: 2026-06-30
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260630_000002"
down_revision: Union[str, None] = "20260630_000001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("kham_benh", sa.Column("id_nguoi_dung", sa.String(20), nullable=True))
    op.add_column("don_thuoc", sa.Column("id_nguoi_dung", sa.String(20), nullable=True))


def downgrade() -> None:
    op.drop_column("don_thuoc", "id_nguoi_dung")
    op.drop_column("kham_benh", "id_nguoi_dung")
