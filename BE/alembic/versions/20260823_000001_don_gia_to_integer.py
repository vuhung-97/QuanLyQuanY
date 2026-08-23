"""convert don_gia from Numeric(15,2) to Integer in thuoc_vtyt

Revision ID: 20260823_000001
Revises: 20260816_000002
Create Date: 2026-08-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260823_000001"
down_revision: Union[str, None] = "20260816_000002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            "UPDATE thuoc_vtyt SET don_gia = NULL WHERE don_gia IS NOT NULL "
            "AND don_gia != TRUNC(don_gia)"
        )
    )
    op.alter_column(
        "thuoc_vtyt",
        "don_gia",
        existing_type=sa.Numeric(15, 2),
        type_=sa.Integer(),
        using="don_gia::INTEGER",
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "thuoc_vtyt",
        "don_gia",
        existing_type=sa.Integer(),
        type_=sa.Numeric(15, 2),
        existing_nullable=True,
    )
