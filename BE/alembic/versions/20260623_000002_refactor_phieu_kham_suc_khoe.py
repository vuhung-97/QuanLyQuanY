"""add ma_lich_kham, trang_thai, rename tien_su_benh_tat to tong_quan

Revision ID: 20260623_000002
Revises: 20260623_000001
Create Date: 2026-06-23
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260623_000002"
down_revision: Union[str, None] = "20260623_000001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column("phieu_kham_suc_khoe", "tien_su_benh_tat", new_column_name="tong_quan")
    op.add_column("phieu_kham_suc_khoe", sa.Column("ma_lich_kham", sa.String(10), nullable=True))
    op.create_foreign_key("fk_phieu_lich_kham", "phieu_kham_suc_khoe", "lich_kham_sk_nam", ["ma_lich_kham"], ["ma_lich_kham"], ondelete="SET NULL")
    op.add_column("phieu_kham_suc_khoe", sa.Column("trang_thai", sa.String(20), nullable=True, server_default="chua_kham"))


def downgrade():
    op.drop_column("phieu_kham_suc_khoe", "trang_thai")
    op.drop_constraint("fk_phieu_lich_kham", "phieu_kham_suc_khoe", type_="foreignkey")
    op.drop_column("phieu_kham_suc_khoe", "ma_lich_kham")
    op.alter_column("phieu_kham_suc_khoe", "tong_quan", new_column_name="tien_su_benh_tat")
