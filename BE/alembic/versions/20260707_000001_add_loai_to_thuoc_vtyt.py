"""add loai column to thuoc_vtyt

Revision ID: 20260707_000001
Revises: 20260703_000002
Create Date: 2026-07-07 14:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260707_000001"
down_revision: Union[str, None] = "20260703_000002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "thuoc_vtyt",
        sa.Column("loai", sa.String(10), nullable=True),
    )
    op.execute(
        """
        UPDATE thuoc_vtyt
        SET loai = CASE
            WHEN phan_loai ILIKE '%vật tư%' THEN 'vat_tu'
            WHEN phan_loai IS NOT NULL THEN 'thuoc'
            ELSE NULL
        END
        """
    )


def downgrade() -> None:
    op.drop_column("thuoc_vtyt", "loai")
