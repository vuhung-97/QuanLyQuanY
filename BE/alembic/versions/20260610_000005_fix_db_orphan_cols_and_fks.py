"""fix DB: drop orphan cols, add missing FK constraints

- Drop orphan columns: don_thuoc.gioi_tinh, giay_gioi_thieu.so_suc_khoe
- Add missing FK constraints on 6 tables

Revision ID: 20260610_000005
Revises: 20260610_000004
Create Date: 2026-06-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260610_000005"
down_revision: Union[str, None] = "20260610_000004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # === Drop orphan columns added by mistake ===
    op.drop_column("don_thuoc", "gioi_tinh")
    op.drop_column("giay_gioi_thieu", "so_suc_khoe")

    # === Add missing FK constraints ===
    # 1. phieu_cham_soc.ma_benh_an -> benh_an.ma_benh_an
    op.create_foreign_key(
        "fk_phieu_cham_soc_benh_an", "phieu_cham_soc", "benh_an",
        ["ma_benh_an"], ["ma_benh_an"], ondelete="CASCADE",
    )
    # 2. phieu_kham_suc_khoe.ma_quan_nhan -> quan_nhan.ma_quan_nhan
    op.create_foreign_key(
        "fk_phieu_kham_suc_khoe_quan_nhan", "phieu_kham_suc_khoe", "quan_nhan",
        ["ma_quan_nhan"], ["ma_quan_nhan"], ondelete="CASCADE",
    )
    # 3. phieu_xuat_kho.ma_don_vi_nhan -> don_vi.ma_don_vi
    op.create_foreign_key(
        "fk_phieu_xuat_kho_don_vi", "phieu_xuat_kho", "don_vi",
        ["ma_don_vi_nhan"], ["ma_don_vi"], ondelete="SET NULL",
    )
    # 4. ra_benh_xa.ma_benh_an -> benh_an.ma_benh_an
    op.create_foreign_key(
        "fk_ra_benh_xa_benh_an", "ra_benh_xa", "benh_an",
        ["ma_benh_an"], ["ma_benh_an"], ondelete="CASCADE",
    )
    # 5. so_nhap_xuat.ma_thuoc_vtyt -> thuoc_vtyt.ma_thuoc_vtyt
    op.create_foreign_key(
        "fk_so_nhap_xuat_thuoc_vtyt", "so_nhap_xuat", "thuoc_vtyt",
        ["ma_thuoc_vtyt"], ["ma_thuoc_vtyt"], ondelete="RESTRICT",
    )
    # 6. vai_tro_quyen.id_vai_tro -> vai_tro.id
    op.create_foreign_key(
        "fk_vai_tro_quyen_vai_tro", "vai_tro_quyen", "vai_tro",
        ["id_vai_tro"], ["id"], ondelete="CASCADE",
    )
    # 7. vai_tro_quyen.id_quyen -> quyen.id
    op.create_foreign_key(
        "fk_vai_tro_quyen_quyen", "vai_tro_quyen", "quyen",
        ["id_quyen"], ["id"], ondelete="CASCADE",
    )


def downgrade() -> None:
    # Drop added FK constraints
    op.drop_constraint("fk_vai_tro_quyen_quyen", "vai_tro_quyen", type_="foreignkey")
    op.drop_constraint("fk_vai_tro_quyen_vai_tro", "vai_tro_quyen", type_="foreignkey")
    op.drop_constraint("fk_so_nhap_xuat_thuoc_vtyt", "so_nhap_xuat", type_="foreignkey")
    op.drop_constraint("fk_ra_benh_xa_benh_an", "ra_benh_xa", type_="foreignkey")
    op.drop_constraint("fk_phieu_xuat_kho_don_vi", "phieu_xuat_kho", type_="foreignkey")
    op.drop_constraint("fk_phieu_kham_suc_khoe_quan_nhan", "phieu_kham_suc_khoe", type_="foreignkey")
    op.drop_constraint("fk_phieu_cham_soc_benh_an", "phieu_cham_soc", type_="foreignkey")

    # Restore orphan columns
    op.add_column("giay_gioi_thieu", sa.Column("so_suc_khoe", sa.String(100), nullable=True))
    op.add_column("don_thuoc", sa.Column("gioi_tinh", sa.String(20), nullable=True))
