"""make ma_lay_mau unique per lich_kham (composite unique)

Revision ID: e9d1b2c3a4f5
Revises: 5a67d8f99a1b
Create Date: 2026-06-23 19:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e9d1b2c3a4f5'
down_revision: Union[str, None] = '5a67d8f99a1b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('phieu_kham_suc_khoe_ma_lay_mau_key', 'phieu_kham_suc_khoe', type_='unique')
    op.create_unique_constraint('uq_phieu_lich_ma_lay_mau', 'phieu_kham_suc_khoe', ['ma_lich_kham', 'ma_lay_mau'])


def downgrade() -> None:
    op.drop_constraint('uq_phieu_lich_ma_lay_mau', 'phieu_kham_suc_khoe', type_='unique')
    op.create_unique_constraint('phieu_kham_suc_khoe_ma_lay_mau_key', 'phieu_kham_suc_khoe', ['ma_lay_mau'])
