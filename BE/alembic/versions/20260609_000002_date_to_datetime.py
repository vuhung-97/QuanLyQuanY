"""change Date columns to DateTime(TZ) for lich_kham_sk_nam

Revision ID: 20260609_000002
Revises: 20260609_000001
Create Date: 2026-06-09 00:00:02

"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260609_000002"
down_revision: str | None = "20260609_000001"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def table_has_column(table, column):
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if not inspector.has_table(table):
        return False
    return any(c["name"] == column for c in inspector.get_columns(table))


def upgrade() -> None:
    for table in ["lich_kham_sk_nam", "lich_kham_sk_nam_chi_tiet"]:
        for col in ["thoi_gian_bat_dau", "thoi_gian_ket_thuc"]:
            if table_has_column(table, col):
                op.alter_column(
                    table,
                    col,
                    type_=sa.DateTime(),
                    postgresql_using=f"{col}::timestamp",
                )


def downgrade() -> None:
    for table in ["lich_kham_sk_nam", "lich_kham_sk_nam_chi_tiet"]:
        for col in ["thoi_gian_bat_dau", "thoi_gian_ket_thuc"]:
            if table_has_column(table, col):
                op.alter_column(
                    table,
                    col,
                    type_=sa.Date(),
                    postgresql_using=f"{col}::date",
                )
