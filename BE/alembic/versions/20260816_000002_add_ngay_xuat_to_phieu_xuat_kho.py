"""add ngay_xuat to phieu_xuat_kho

Revision ID: 20260816_000002
Revises: 20260816_000001
Create Date: 2026-08-16

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260816_000002"
down_revision: str | None = "20260816_000001"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("phieu_xuat_kho", sa.Column("ngay_xuat", sa.DateTime(), nullable=True))
    op.execute(
        "UPDATE phieu_xuat_kho SET ngay_xuat = ngay_thang_nam WHERE trang_thai = 'da_xuat'"
    )


def downgrade() -> None:
    op.drop_column("phieu_xuat_kho", "ngay_xuat")