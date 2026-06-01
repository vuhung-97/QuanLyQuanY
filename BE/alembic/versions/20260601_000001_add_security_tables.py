"""add security tables

Revision ID: 20260601_000001
Revises: 66cc453126cf
Create Date: 2026-06-01 00:00:01

"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "20260601_000001"
down_revision: str | None = "66cc453126cf"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("quyen"):
        op.create_table(
            "quyen",
            sa.Column("id", sa.String(length=20), nullable=False),
            sa.Column("ten_quyen", sa.String(length=100), nullable=False),
            sa.Column("mo_ta", sa.Text(), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )

    if not inspector.has_table("vai_tro"):
        op.create_table(
            "vai_tro",
            sa.Column("id", sa.String(length=20), nullable=False),
            sa.Column("ten_vai_tro", sa.String(length=100), nullable=False),
            sa.Column("mo_ta", sa.Text(), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )

    if not inspector.has_table("nguoi_dung"):
        op.create_table(
            "nguoi_dung",
            sa.Column("id", sa.String(length=20), nullable=False),
            sa.Column("ten_dang_nhap", sa.String(length=50), nullable=False),
            sa.Column("mat_khau_hash", sa.Text(), nullable=False),
            sa.Column("ho_ten", sa.String(length=100), nullable=False),
            sa.Column("id_vai_tro", sa.String(length=20), nullable=True),
            sa.Column("id_quan_nhan", sa.String(length=20), nullable=True),
            sa.Column("trang_thai", sa.Boolean(), nullable=True),
            sa.ForeignKeyConstraint(["id_vai_tro"], ["vai_tro.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )

    if not inspector.has_table("vai_tro_quyen"):
        op.create_table(
            "vai_tro_quyen",
            sa.Column("id_vai_tro", sa.String(length=20), nullable=False),
            sa.Column("id_quyen", sa.String(length=20), nullable=False),
            sa.ForeignKeyConstraint(["id_quyen"], ["quyen.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["id_vai_tro"], ["vai_tro.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id_vai_tro", "id_quyen"),
        )

    if not inspector.has_table("nhat_ky_dang_nhap"):
        op.create_table(
            "nhat_ky_dang_nhap",
            sa.Column("id", sa.String(length=20), nullable=False),
            sa.Column("id_nguoi_dung", sa.String(length=20), nullable=True),
            sa.Column("thoi_gian", sa.DateTime(), nullable=True),
            sa.Column("trang_thai_thanh_cong", sa.Boolean(), nullable=True),
            sa.Column("thiet_bi", sa.Text(), nullable=True),
            sa.ForeignKeyConstraint(["id_nguoi_dung"], ["nguoi_dung.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )

    if not inspector.has_table("nhat_ky_thao_tac"):
        op.create_table(
            "nhat_ky_thao_tac",
            sa.Column("id", sa.String(length=20), nullable=False),
            sa.Column("id_nguoi_dung", sa.String(length=20), nullable=True),
            sa.Column("thoi_gian", sa.DateTime(), nullable=True),
            sa.Column("hanh_dong", sa.String(length=50), nullable=True),
            sa.Column("ten_bang", sa.String(length=50), nullable=True),
            sa.Column("du_lieu_cu", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
            sa.Column("du_lieu_moi", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
            sa.Column("dia_chi_ip", sa.String(length=50), nullable=True),
            sa.ForeignKeyConstraint(["id_nguoi_dung"], ["nguoi_dung.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )

    if not inspector.has_table("nhat_ky_backup"):
        op.create_table(
            "nhat_ky_backup",
            sa.Column("id", sa.String(length=20), nullable=False),
            sa.Column("thoi_gian_backup", sa.DateTime(), nullable=True),
            sa.Column("duong_dan", sa.String(length=100), nullable=True),
            sa.Column("id_nguoi_dung", sa.String(length=20), nullable=True),
            sa.ForeignKeyConstraint(["id_nguoi_dung"], ["nguoi_dung.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("nhat_ky_backup"):
        op.drop_table("nhat_ky_backup")
    if inspector.has_table("nhat_ky_thao_tac"):
        op.drop_table("nhat_ky_thao_tac")
    if inspector.has_table("nhat_ky_dang_nhap"):
        op.drop_table("nhat_ky_dang_nhap")
    if inspector.has_table("vai_tro_quyen"):
        op.drop_table("vai_tro_quyen")
    if inspector.has_table("nguoi_dung"):
        op.drop_table("nguoi_dung")
    if inspector.has_table("vai_tro"):
        op.drop_table("vai_tro")
    if inspector.has_table("quyen"):
        op.drop_table("quyen")
