"""fix nguoi_dung columns: trang_thai NOT NULL, id_quan_nhan VARCHAR(10)

Revision ID: 20260610_000002
Revises: 20260610_000001
Create Date: 2026-06-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260610_000002"
down_revision: Union[str, None] = "20260610_000001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Fix Issue 2: trang_thai nullable=True -> nullable=False, default=False
    op.execute("UPDATE nguoi_dung SET trang_thai = false WHERE trang_thai IS NULL")
    op.alter_column("nguoi_dung", "trang_thai", nullable=False, server_default=sa.text("false"))

    # Fix Issue 3: id_quan_nhan String(20) -> String(10)
    op.alter_column("nguoi_dung", "id_quan_nhan", type_=sa.String(10))


def downgrade() -> None:
    op.alter_column("nguoi_dung", "trang_thai", nullable=True, server_default=None)
    op.alter_column("nguoi_dung", "id_quan_nhan", type_=sa.String(20))
