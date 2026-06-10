"""tach lich_kham_sk_nam -> master + chi_tiet

Revision ID: 20260609_000001
Revises: 20260604_000001
Create Date: 2026-06-09 00:00:01

"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260609_000001"
down_revision: str | None = "20260604_000001"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def table_has_column(table, column):
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if not inspector.has_table(table):
        return False
    return any(c["name"] == column for c in inspector.get_columns(table))


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # 1. Create chi_tiet table only if not exists
    if not inspector.has_table("lich_kham_sk_nam_chi_tiet"):
        op.create_table(
            "lich_kham_sk_nam_chi_tiet",
            sa.Column("ma_lich_kham", sa.String(10), primary_key=True),
            sa.Column("ma_don_vi", sa.String(10), primary_key=True),
            sa.Column("thoi_gian_bat_dau", sa.Date(), nullable=True),
            sa.Column("thoi_gian_ket_thuc", sa.Date(), nullable=True),
            sa.Column("dia_diem", sa.Text(), nullable=True),
        )

        # Add FK constraints separately
        op.create_foreign_key(
            "fk_lich_kham_sk_nam_chi_tiet_master",
            "lich_kham_sk_nam_chi_tiet", "lich_kham_sk_nam",
            ["ma_lich_kham"], ["ma_lich_kham"],
            ondelete="CASCADE",
        )
        op.create_foreign_key(
            "fk_lich_kham_sk_nam_chi_tiet_don_vi",
            "lich_kham_sk_nam_chi_tiet", "don_vi",
            ["ma_don_vi"], ["ma_don_vi"],
            ondelete="CASCADE",
        )

        # Migrate existing data
        conn = op.get_bind()
        if inspector.has_table("lich_kham_sk_nam"):
            rows = conn.execute(
                sa.text(
                    "SELECT ma_lich_kham, ma_don_vi, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem "
                    "FROM lich_kham_sk_nam WHERE ma_don_vi IS NOT NULL"
                )
            ).fetchall()
            for row in rows:
                conn.execute(
                    sa.text(
                        "INSERT INTO lich_kham_sk_nam_chi_tiet "
                        "(ma_lich_kham, ma_don_vi, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem) "
                        "VALUES (:mlk, :mdv, :tgbd, :tgkt, :dd) ON CONFLICT DO NOTHING"
                    ),
                    {"mlk": row[0], "mdv": row[1], "tgbd": row[2], "tgkt": row[3], "dd": row[4]},
                )

    # 2. Drop ma_don_vi FK from lich_kham_sk_nam
    if inspector.has_table("lich_kham_sk_nam"):
        for fk in inspector.get_foreign_keys("lich_kham_sk_nam"):
            if fk["constrained_columns"] == ["ma_don_vi"]:
                op.drop_constraint(fk["name"], "lich_kham_sk_nam", type_="foreignkey")

    # 3. Drop columns from lich_kham_sk_nam
    if table_has_column("lich_kham_sk_nam", "ma_don_vi"):
        op.drop_column("lich_kham_sk_nam", "ma_don_vi")
    if table_has_column("lich_kham_sk_nam", "dia_diem"):
        op.drop_column("lich_kham_sk_nam", "dia_diem")


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # 1. Add columns back
    if inspector.has_table("lich_kham_sk_nam"):
        if not table_has_column("lich_kham_sk_nam", "ma_don_vi"):
            op.add_column("lich_kham_sk_nam", sa.Column("ma_don_vi", sa.String(10), nullable=True))
            op.create_foreign_key(
                "fk_lich_kham_sk_nam_don_vi",
                "lich_kham_sk_nam", "don_vi",
                ["ma_don_vi"], ["ma_don_vi"],
                ondelete="CASCADE",
            )
        if not table_has_column("lich_kham_sk_nam", "dia_diem"):
            op.add_column("lich_kham_sk_nam", sa.Column("dia_diem", sa.Text(), nullable=True))

    # 2. Restore first detail per master
    if inspector.has_table("lich_kham_sk_nam_chi_tiet") and inspector.has_table("lich_kham_sk_nam"):
        conn = op.get_bind()
        rows = conn.execute(
            sa.text(
                "SELECT DISTINCT ON (ma_lich_kham) ma_lich_kham, ma_don_vi, dia_diem "
                "FROM lich_kham_sk_nam_chi_tiet ORDER BY ma_lich_kham, ma_don_vi"
            )
        ).fetchall()
        for row in rows:
            conn.execute(
                sa.text("UPDATE lich_kham_sk_nam SET ma_don_vi = :mdv, dia_diem = :dd WHERE ma_lich_kham = :mlk"),
                {"mlk": row[0], "mdv": row[1], "dd": row[2]},
            )

    # 3. Drop chi_tiet table
    if inspector.has_table("lich_kham_sk_nam_chi_tiet"):
        op.drop_constraint("fk_lich_kham_sk_nam_chi_tiet_master", "lich_kham_sk_nam_chi_tiet", type_="foreignkey")
        op.drop_constraint("fk_lich_kham_sk_nam_chi_tiet_don_vi", "lich_kham_sk_nam_chi_tiet", type_="foreignkey")
        op.drop_table("lich_kham_sk_nam_chi_tiet")
