"""add nghe_nghiep column to quan_nhan

Revision ID: 20260610_000003
Revises: 20260610_000002
Create Date: 2026-06-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260610_000003"
down_revision: Union[str, None] = "20260610_000002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("quan_nhan", sa.Column("nghe_nghiep", sa.String(length=100), nullable=True))


def downgrade() -> None:
    op.drop_column("quan_nhan", "nghe_nghiep")
