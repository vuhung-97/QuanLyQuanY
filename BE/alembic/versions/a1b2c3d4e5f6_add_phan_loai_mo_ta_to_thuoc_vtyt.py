"""add phan_loai and mo_ta to thuoc_vtyt

Revision ID: a1b2c3d4e5f6
Revises: 87c192972eb5
Create Date: 2026-06-22 08:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '87c192972eb5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("thuoc_vtyt", sa.Column("phan_loai", sa.String(100), nullable=True))
    op.add_column("thuoc_vtyt", sa.Column("mo_ta", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("thuoc_vtyt", "mo_ta")
    op.drop_column("thuoc_vtyt", "phan_loai")
