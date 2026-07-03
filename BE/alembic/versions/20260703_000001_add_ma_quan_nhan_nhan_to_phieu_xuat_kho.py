"""add ma_quan_nhan_nhan to phieu_xuat_kho

Revision ID: 20260703_000001
Revises: 20260630_000003
Create Date: 2026-07-03

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260703_000001"
down_revision: Union[str, None] = "20260630_000003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("phieu_xuat_kho", sa.Column("ma_quan_nhan_nhan", sa.String(length=10), nullable=True))


def downgrade() -> None:
    op.drop_column("phieu_xuat_kho", "ma_quan_nhan_nhan")
