"""increase trang_thai length in kham_benh from 20 to 50

Revision ID: 20260714_000003
Revises: 20260714_000002
Create Date: 2026-07-14 00:00:03

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260714_000003"
down_revision: str | None = "20260714_000002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column("kham_benh", "trang_thai", type_=sa.String(50))


def downgrade() -> None:
    op.alter_column("kham_benh", "trang_thai", type_=sa.String(20))
