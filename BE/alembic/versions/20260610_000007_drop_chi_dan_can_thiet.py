"""drop chi_dan_can_thiet from phieu_kham_suc_khoe

Revision ID: 20260610_000007
Revises: 20260610_000006
Create Date: 2026-06-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260610_000007"
down_revision: Union[str, None] = "20260610_000006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("phieu_kham_suc_khoe", "chi_dan_can_thiet")


def downgrade() -> None:
    op.add_column("phieu_kham_suc_khoe", sa.Column("chi_dan_can_thiet", sa.Text(), nullable=True))
