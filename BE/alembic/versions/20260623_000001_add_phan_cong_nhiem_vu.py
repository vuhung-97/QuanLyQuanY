"""add phan_cong_nhiem_vu, vai_tro_tam_thoi, split kham_can_lam_sang

Revision ID: 20260623_000001
Revises: a1b2c3d4e5f6
Create Date: 2026-06-23
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260623_000001"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table("vai_tro_tam_thoi",
        sa.Column("ma_vai_tro", sa.String(30), primary_key=True),
        sa.Column("ten_vai_tro", sa.String(100), nullable=False),
    )
    op.execute("INSERT INTO vai_tro_tam_thoi (ma_vai_tro, ten_vai_tro) VALUES ('tong_quan', 'Tổng quan')")
    op.execute("INSERT INTO vai_tro_tam_thoi (ma_vai_tro, ten_vai_tro) VALUES ('lam_sang', 'Lâm sàng')")
    op.execute("INSERT INTO vai_tro_tam_thoi (ma_vai_tro, ten_vai_tro) VALUES ('xet_nghiem', 'Xét nghiệm')")
    op.execute("INSERT INTO vai_tro_tam_thoi (ma_vai_tro, ten_vai_tro) VALUES ('chan_doan_hinh_anh', 'Chẩn đoán hình ảnh')")
    op.execute("INSERT INTO vai_tro_tam_thoi (ma_vai_tro, ten_vai_tro) VALUES ('ket_luan', 'Kết luận')")

    op.create_table("phan_cong_nhiem_vu",
        sa.Column("id", sa.String(10), primary_key=True),
        sa.Column("ma_lich_kham", sa.String(10), sa.ForeignKey("lich_kham_sk_nam.ma_lich_kham", ondelete="CASCADE"), nullable=False),
        sa.Column("id_nguoi_dung", sa.String(20), nullable=False),
        sa.Column("ma_vai_tro", sa.String(30), sa.ForeignKey("vai_tro_tam_thoi.ma_vai_tro"), nullable=False),
    )

    op.add_column("phieu_kham_suc_khoe", sa.Column("xet_nghiem", sa.Text(), nullable=True))
    op.add_column("phieu_kham_suc_khoe", sa.Column("chan_doan_hinh_anh", sa.Text(), nullable=True))
    op.drop_column("phieu_kham_suc_khoe", "kham_can_lam_sang")


def downgrade() -> None:
    op.add_column("phieu_kham_suc_khoe", sa.Column("kham_can_lam_sang", sa.Text(), nullable=True))
    op.drop_column("phieu_kham_suc_khoe", "chan_doan_hinh_anh")
    op.drop_column("phieu_kham_suc_khoe", "xet_nghiem")
    op.drop_table("phan_cong_nhiem_vu")
    op.execute("DELETE FROM vai_tro_tam_thoi")
    op.drop_table("vai_tro_tam_thoi")
