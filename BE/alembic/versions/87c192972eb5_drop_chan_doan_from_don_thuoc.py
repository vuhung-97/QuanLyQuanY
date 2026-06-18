"""drop_chan_doan_from_don_thuoc

Revision ID: 87c192972eb5
Revises: cbc0b66b51df
Create Date: 2026-06-18 15:53:44.468303

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '87c192972eb5'
down_revision: Union[str, None] = 'cbc0b66b51df'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('don_thuoc', 'chan_doan')


def downgrade() -> None:
    op.add_column('don_thuoc', sa.Column('chan_doan', sa.TEXT(), autoincrement=False, nullable=True))
