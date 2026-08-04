"""add lay_mau and du_tru time columns to lich_kham_sk_nam

Revision ID: 20260804_000001
Revises: 6d586b67571c
Create Date: 2026-08-04 00:00:01

"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260804_000001"
down_revision: str | None = "6d586b67571c"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("lich_kham_sk_nam", sa.Column("thoi_gian_lay_mau_bat_dau", sa.DateTime(), nullable=True))
    op.add_column("lich_kham_sk_nam", sa.Column("thoi_gian_lay_mau_ket_thuc", sa.DateTime(), nullable=True))
    op.add_column("lich_kham_sk_nam", sa.Column("thoi_gian_du_tru_lay_mau_bat_dau", sa.DateTime(), nullable=True))
    op.add_column("lich_kham_sk_nam", sa.Column("thoi_gian_du_tru_lay_mau_ket_thuc", sa.DateTime(), nullable=True))
    op.add_column("lich_kham_sk_nam", sa.Column("thoi_gian_du_tru_kham_bat_dau", sa.DateTime(), nullable=True))
    op.add_column("lich_kham_sk_nam", sa.Column("thoi_gian_du_tru_kham_ket_thuc", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("lich_kham_sk_nam", "thoi_gian_du_tru_kham_ket_thuc")
    op.drop_column("lich_kham_sk_nam", "thoi_gian_du_tru_kham_bat_dau")
    op.drop_column("lich_kham_sk_nam", "thoi_gian_du_tru_lay_mau_ket_thuc")
    op.drop_column("lich_kham_sk_nam", "thoi_gian_du_tru_lay_mau_bat_dau")
    op.drop_column("lich_kham_sk_nam", "thoi_gian_lay_mau_ket_thuc")
    op.drop_column("lich_kham_sk_nam", "thoi_gian_lay_mau_bat_dau")
