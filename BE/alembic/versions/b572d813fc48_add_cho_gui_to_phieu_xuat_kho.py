"""add_cho_gui_to_phieu_xuat_kho

Revision ID: b572d813fc48
Revises: 20260714_000004
Create Date: 2026-07-14 22:03:17.437756

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b572d813fc48'
down_revision: Union[str, None] = '20260714_000004'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # set existing NULL values to 'cho_gui'
    op.execute("UPDATE phieu_xuat_kho SET trang_thai = 'cho_gui' WHERE trang_thai IS NULL")
    # add NOT NULL constraint (Python default handles new records)
    op.alter_column('phieu_xuat_kho', 'trang_thai',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)


def downgrade() -> None:
    op.alter_column('phieu_xuat_kho', 'trang_thai',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
