"""rename thoi_gian_backup -> thoi_gian in nhat_ky_backup

Revision ID: 20260604_000001
Revises: 20260602_000004
Create Date: 2026-06-04 00:00:01

"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "20260604_000001"
down_revision: str | None = "20260602_000004"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column("nhat_ky_backup", "thoi_gian_backup", new_column_name="thoi_gian")


def downgrade() -> None:
    op.alter_column("nhat_ky_backup", "thoi_gian", new_column_name="thoi_gian_backup")
