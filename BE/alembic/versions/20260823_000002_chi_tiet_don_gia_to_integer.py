"""convert don_gia to Integer in chi_tiet_phieu_nhap_kho

Revision ID: 20260823_000002
Revises: 20260823_000001
Create Date: 2026-08-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260823_000002"
down_revision: Union[str, None] = "20260823_000001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "chi_tiet_phieu_nhap_kho",
        "don_gia",
        existing_type=sa.Numeric(15, 2),
        type_=sa.Integer(),
        using="ROUND(don_gia)::INTEGER",
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "chi_tiet_phieu_nhap_kho",
        "don_gia",
        existing_type=sa.Integer(),
        type_=sa.Numeric(15, 2),
        existing_nullable=True,
    )
