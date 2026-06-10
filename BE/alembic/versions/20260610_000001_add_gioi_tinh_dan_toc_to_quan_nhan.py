"""add gioi_tinh dan_toc to quan_nhan

Revision ID: 20260610_000001
Revises: 20260609_000002
Create Date: 2026-06-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260610_000001"
down_revision: Union[str, None] = "20260609_000002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("quan_nhan", sa.Column("gioi_tinh", sa.Boolean(), nullable=True))
    op.add_column("quan_nhan", sa.Column("dan_toc", sa.String(length=50), nullable=True))
    op.create_foreign_key(
        "fk_quan_nhan_don_vi", "quan_nhan", "don_vi",
        ["ma_don_vi"], ["ma_don_vi"], ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_quan_nhan_don_vi", "quan_nhan", type_="foreignkey")
    op.drop_column("quan_nhan", "dan_toc")
    op.drop_column("quan_nhan", "gioi_tinh")
