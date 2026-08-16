"""add so_luong_thuc_xuat to chi_tiet_xuat_kho

Revision ID: 20260816_000001
Revises: 20260804_000002
Create Date: 2026-08-16

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260816_000001"
down_revision: str | None = "20260804_000002"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("chi_tiet_xuat_kho", sa.Column("so_luong_thuc_xuat", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("chi_tiet_xuat_kho", "so_luong_thuc_xuat")