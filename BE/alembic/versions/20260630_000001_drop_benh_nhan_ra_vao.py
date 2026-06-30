"""drop benh_nhan_ra_vao table — ngay_ra moved to benh_an.tong_ket_benh_an

Revision ID: 20260630_000001
Revises: 58d46ddc1b0c
Create Date: 2026-06-30
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260630_000001"
down_revision: Union[str, None] = "58d46ddc1b0c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("benh_nhan_ra_vao")


def downgrade() -> None:
    op.create_table(
        "benh_nhan_ra_vao",
        sa.Column("ma_ra_vao", sa.String(10), nullable=False),
        sa.Column("ma_benh_an", sa.String(10), nullable=True),
        sa.Column("ma_kham_benh", sa.String(10), nullable=True),
        sa.Column("ngay_thang_nam", sa.Date(), nullable=True),
        sa.Column("ly_do", sa.Text(), nullable=True),
        sa.Column("ngay_vao", sa.Date(), nullable=True),
        sa.Column("ngay_ra", sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(["ma_benh_an"], ["benh_an.ma_benh_an"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["ma_kham_benh"], ["kham_benh.ma_kham_benh"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("ma_ra_vao"),
    )
