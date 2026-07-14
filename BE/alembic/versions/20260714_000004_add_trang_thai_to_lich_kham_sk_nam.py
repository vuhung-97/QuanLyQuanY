"""replace da_duyet with trang_thai in lich_kham_sk_nam

Revision ID: 20260714_000004
Revises: 20260714_000003
Create Date: 2026-07-14 00:00:04

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260714_000004"
down_revision: str | None = "20260714_000003"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "lich_kham_sk_nam",
        sa.Column("trang_thai", sa.String(20), nullable=True),
    )
    op.execute(
        "UPDATE lich_kham_sk_nam SET trang_thai = 'da_duyet' WHERE da_duyet = true"
    )
    op.execute(
        "UPDATE lich_kham_sk_nam SET trang_thai = 'cho_gui' WHERE trang_thai IS NULL"
    )
    op.alter_column("lich_kham_sk_nam", "trang_thai", nullable=False)
    op.drop_column("lich_kham_sk_nam", "da_duyet")


def downgrade() -> None:
    op.add_column(
        "lich_kham_sk_nam",
        sa.Column("da_duyet", sa.Boolean(), nullable=True),
    )
    op.execute(
        "UPDATE lich_kham_sk_nam SET da_duyet = true WHERE trang_thai = 'da_duyet'"
    )
    op.execute(
        "UPDATE lich_kham_sk_nam SET da_duyet = false WHERE trang_thai != 'da_duyet'"
    )
    op.alter_column(
        "lich_kham_sk_nam",
        "da_duyet",
        nullable=False,
        server_default=sa.text("false"),
    )
    op.drop_column("lich_kham_sk_nam", "trang_thai")
