"""add dm_trieu_chung table and seed data

Revision ID: 20260709_000003
Revises: 20260709_000002
Create Date: 2026-07-09 00:00:03
"""

import json
from typing import Sequence

from alembic import op
import sqlalchemy as sa

from app.services.id_helper import generate_id


revision: str = "20260709_000003"
down_revision: str | None = "20260709_000002"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        "CREATE TABLE IF NOT EXISTS dm_trieu_chung ("
        "ma_trieu_chung VARCHAR(10) NOT NULL, "
        "ten_trieu_chung VARCHAR(255) NOT NULL, "
        "mo_ta TEXT, "
        "PRIMARY KEY (ma_trieu_chung)"
        ")"
    )

    bind = op.get_bind()
    with open("../FE/src/data/trieu_chung.json", encoding="utf-8") as f:
        items = json.load(f)

    for ten in items:
        exists = bind.execute(
            sa.text("SELECT 1 FROM dm_trieu_chung WHERE ten_trieu_chung = :ten"),
            {"ten": ten},
        ).scalar()
        if not exists:
            ma = generate_id(10)
            op.execute(
                sa.text(
                    "INSERT INTO dm_trieu_chung (ma_trieu_chung, ten_trieu_chung, mo_ta) "
                    "VALUES (:ma, :ten, :mo_ta)"
                ).bindparams(ma=ma, ten=ten, mo_ta=ten)
            )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS dm_trieu_chung")
