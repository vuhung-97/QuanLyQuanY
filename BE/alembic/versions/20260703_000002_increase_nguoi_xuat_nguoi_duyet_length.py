"""increase nguoi_xuat and nguoi_duyet length to 50

Revision ID: 20260703_000002
Revises: 20260703_000001
Create Date: 2026-07-03

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260703_000002"
down_revision: Union[str, None] = "20260703_000001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("phieu_xuat_kho", "nguoi_xuat", type_=sa.String(50))
    op.alter_column("phieu_xuat_kho", "nguoi_duyet", type_=sa.String(50))


def downgrade() -> None:
    op.alter_column("phieu_xuat_kho", "nguoi_xuat", type_=sa.String(10))
    op.alter_column("phieu_xuat_kho", "nguoi_duyet", type_=sa.String(10))
