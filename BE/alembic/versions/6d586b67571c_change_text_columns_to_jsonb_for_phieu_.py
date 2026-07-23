"""change_text_columns_to_jsonb_for_phieu_kham_suc_khoe

Revision ID: 6d586b67571c
Revises: 20260721_000002
Create Date: 2026-07-23 16:15:44.954601

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6d586b67571c'
down_revision: Union[str, None] = '20260721_000002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


JSONB_COLUMNS = ["tong_quan", "kham_lam_sang", "xet_nghiem", "chan_doan_hinh_anh", "ket_luan"]


def upgrade() -> None:
    for col in JSONB_COLUMNS:
        op.execute(
            f"ALTER TABLE phieu_kham_suc_khoe ALTER COLUMN {col} TYPE JSONB USING {col}::jsonb"
        )


def downgrade() -> None:
    for col in JSONB_COLUMNS:
        op.execute(
            f"ALTER TABLE phieu_kham_suc_khoe ALTER COLUMN {col} TYPE TEXT USING {col}::text"
        )
