"""rename_trieu_chung_chan_doan_and_ket_qua

Revision ID: cbc0b66b51df
Revises: 38161b76d3c7
Create Date: 2026-06-12 10:39:27.256597

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cbc0b66b51df'
down_revision: Union[str, None] = '38161b76d3c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('kham_benh', 'trieu_chung_chan_doan', new_column_name='trieu_chung')
    op.alter_column('kham_benh', 'ket_qua', new_column_name='chan_doan')


def downgrade() -> None:
    op.alter_column('kham_benh', 'chan_doan', new_column_name='ket_qua')
    op.alter_column('kham_benh', 'trieu_chung', new_column_name='trieu_chung_chan_doan')
