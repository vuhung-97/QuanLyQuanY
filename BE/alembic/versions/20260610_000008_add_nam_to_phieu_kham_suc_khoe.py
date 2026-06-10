"""add nam column to phieu_kham_suc_khoe

Revision ID: 20260610_000008
Revises: 20260610_000007
Create Date: 2026-06-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260610_000008"
down_revision: Union[str, None] = "20260610_000007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("phieu_kham_suc_khoe", sa.Column("nam", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("phieu_kham_suc_khoe", "nam")
