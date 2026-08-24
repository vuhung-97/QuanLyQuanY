"""widen nguoi_lap / nguoi_nhap to fit 20-char user ids

Revision ID: 20260824_000001
Revises: 20260823_000002
Create Date: 2026-08-24

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260824_000001"
down_revision: Union[str, None] = "20260823_000002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "phieu_du_tru",
        "nguoi_lap",
        existing_type=sa.String(10),
        type_=sa.String(20),
        existing_nullable=True,
    )
    op.alter_column(
        "phieu_nhap_kho",
        "nguoi_nhap",
        existing_type=sa.String(10),
        type_=sa.String(20),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "phieu_nhap_kho",
        "nguoi_nhap",
        existing_type=sa.String(20),
        type_=sa.String(10),
        existing_nullable=True,
    )
    op.alter_column(
        "phieu_du_tru",
        "nguoi_lap",
        existing_type=sa.String(20),
        type_=sa.String(10),
        existing_nullable=True,
    )
