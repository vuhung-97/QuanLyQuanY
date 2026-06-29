"""rename_ngoai_kieu_to_ly_do_nhap_vien_add_ma_nguoi_dung

Revision ID: 58d46ddc1b0c
Revises: f352dc123a83
Create Date: 2026-06-29 10:23:39.387358

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '58d46ddc1b0c'
down_revision: Union[str, None] = 'f352dc123a83'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('benh_an', 'ngoai_kieu', new_column_name='ly_do_nhap_vien')
    op.add_column('benh_an', sa.Column('ma_nguoi_dung', sa.String(length=20), nullable=True))


def downgrade() -> None:
    op.drop_column('benh_an', 'ma_nguoi_dung')
    op.alter_column('benh_an', 'ly_do_nhap_vien', new_column_name='ngoai_kieu')
