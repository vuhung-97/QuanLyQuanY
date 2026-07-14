"""add da_duyet column to lich_kham_sk_nam

Revision ID: 20260714_000001
Revises: 20260713_000001
Create Date: 2026-07-14 00:00:01

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260714_000001"
down_revision: str | None = "20260713_000001"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "lich_kham_sk_nam",
        sa.Column("da_duyet", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )


def downgrade() -> None:
    op.drop_column("lich_kham_sk_nam", "da_duyet")
