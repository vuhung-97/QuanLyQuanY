"""add_dm_nhom_benh

Revision ID: f8e7d6c5b4a3
Revises: 20260707_000001
Create Date: 2026-07-08 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f8e7d6c5b4a3'
down_revision: Union[str, None] = '20260707_000001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('CREATE TABLE IF NOT EXISTS dm_nhom_benh (ma_nhom VARCHAR(10) NOT NULL, ten_nhom VARCHAR(255) NOT NULL, mo_ta TEXT, PRIMARY KEY (ma_nhom))')
    op.execute('DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=\'kham_benh\' AND column_name=\'ma_nhom_benh\') THEN ALTER TABLE kham_benh ADD COLUMN ma_nhom_benh VARCHAR(10); END IF; END $$;')
    op.execute('DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=\'benh_an\' AND column_name=\'ma_nhom_benh\') THEN ALTER TABLE benh_an ADD COLUMN ma_nhom_benh VARCHAR(10); END IF; END $$;')
    op.execute('DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name=\'fk_kham_benh_ma_nhom_benh\') THEN ALTER TABLE kham_benh ADD CONSTRAINT fk_kham_benh_ma_nhom_benh FOREIGN KEY (ma_nhom_benh) REFERENCES dm_nhom_benh (ma_nhom); END IF; END $$;')
    op.execute('DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name=\'fk_benh_an_ma_nhom_benh\') THEN ALTER TABLE benh_an ADD CONSTRAINT fk_benh_an_ma_nhom_benh FOREIGN KEY (ma_nhom_benh) REFERENCES dm_nhom_benh (ma_nhom); END IF; END $$;')


def downgrade() -> None:
    op.execute('ALTER TABLE benh_an DROP CONSTRAINT IF EXISTS fk_benh_an_ma_nhom_benh')
    op.execute('ALTER TABLE benh_an DROP COLUMN IF EXISTS ma_nhom_benh')
    op.execute('ALTER TABLE kham_benh DROP CONSTRAINT IF EXISTS fk_kham_benh_ma_nhom_benh')
    op.execute('ALTER TABLE kham_benh DROP COLUMN IF EXISTS ma_nhom_benh')
    op.execute('DROP TABLE IF EXISTS dm_nhom_benh')
