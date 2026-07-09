"""seed dm_nhom_benh with ICD-10 based disease groups

Revision ID: 20260709_000002
Revises: 20260709_000001
Create Date: 2026-07-09 00:00:02
"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260709_000002"
down_revision: str | None = "20260709_000001"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


NHOM_BENH = [
    ("I",   "Bệnh truyền nhiễm và ký sinh trùng"),
    ("II",  "Bệnh nội tiết, dinh dưỡng và chuyển hóa"),
    ("III", "Bệnh tâm thần và hành vi"),
    ("IV",  "Bệnh hệ thần kinh"),
    ("V",   "Bệnh mắt và phần phụ"),
    ("VI",  "Bệnh tai - mũi - họng"),
    ("VII", "Bệnh hệ tuần hoàn"),
    ("VIII","Bệnh hệ hô hấp"),
    ("IX",  "Bệnh hệ tiêu hóa"),
    ("X",   "Bệnh da và mô dưới da"),
    ("XI",  "Bệnh cơ xương khớp và mô liên kết"),
    ("XII", "Bệnh hệ tiết niệu - sinh dục"),
    ("XIII","Chấn thương, ngộ độc và tai nạn"),
    ("XIV", "Khác"),
]


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        inspector = sa.inspect(bind)
        if not inspector.has_table("dm_nhom_benh"):
            return

    for ma_nhom, ten_nhom in NHOM_BENH:
        exists = bind.execute(
            sa.text("SELECT 1 FROM dm_nhom_benh WHERE ma_nhom = :ma_nhom"),
            {"ma_nhom": ma_nhom},
        ).scalar()
        if not exists:
            op.execute(
                sa.text(
                    "INSERT INTO dm_nhom_benh (ma_nhom, ten_nhom, mo_ta) "
                    "VALUES (:ma_nhom, :ten_nhom, :mo_ta)"
                ).bindparams(ma_nhom=ma_nhom, ten_nhom=ten_nhom, mo_ta=ten_nhom)
            )


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        inspector = sa.inspect(bind)
        if not inspector.has_table("dm_nhom_benh"):
            return

    for ma_nhom, ten_nhom in NHOM_BENH:
        op.execute(
            sa.text("DELETE FROM dm_nhom_benh WHERE ma_nhom = :ma_nhom").bindparams(
                ma_nhom=ma_nhom
            )
        )
