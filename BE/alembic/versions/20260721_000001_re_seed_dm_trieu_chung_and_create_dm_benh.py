"""re-seed dm_trieu_chung from symptoms.json and create dm_benh table

Revision ID: 20260721_000001
Revises: 20260714_000005
Create Date: 2026-07-21 00:00:01
"""

import json
from typing import Sequence

from alembic import op
import sqlalchemy as sa

from app.services.id_helper import generate_id


revision: str = "20260721_000001"
down_revision: str | None = "20260714_000005"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()

    # --- 1. Re-seed dm_trieu_chung from symptoms.json ---
    op.execute("DELETE FROM dm_trieu_chung")

    with open("model_ai/symptoms.json", encoding="utf-8") as f:
        data = json.load(f)

    symptoms = data["symptoms"]
    for ten in symptoms:
        ma = generate_id(10)
        op.execute(
            sa.text(
                "INSERT INTO dm_trieu_chung (ma_trieu_chung, ten_trieu_chung, mo_ta) "
                "VALUES (:ma, :ten, :mo_ta)"
            ).bindparams(ma=ma, ten=ten, mo_ta=ten)
        )

    # --- 2. Create dm_benh table ---
    op.execute(
        "CREATE TABLE IF NOT EXISTS dm_benh ("
        "ma_benh VARCHAR(10) NOT NULL, "
        "ten_benh VARCHAR(255) NOT NULL, "
        "ma_nhom_benh VARCHAR(10), "
        "mo_ta TEXT, "
        "PRIMARY KEY (ma_benh), "
        "FOREIGN KEY (ma_nhom_benh) REFERENCES dm_nhom_benh(ma_nhom)"
        ")"
    )

    # --- 3. Seed dm_benh from diseases.json ---
    with open("model_ai/diseases.json", encoding="utf-8") as f:
        data = json.load(f)

    diseases = data["diseases"]
    for ten in diseases:
        exists = bind.execute(
            sa.text("SELECT 1 FROM dm_benh WHERE ten_benh = :ten"),
            {"ten": ten},
        ).scalar()
        if not exists:
            ma = generate_id(10)
            op.execute(
                sa.text(
                    "INSERT INTO dm_benh (ma_benh, ten_benh, ma_nhom_benh, mo_ta) "
                    "VALUES (:ma, :ten, NULL, :mo_ta)"
                ).bindparams(ma=ma, ten=ten, mo_ta=ten)
            )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS dm_benh")
    # Restore old symptoms from FE trieu_chung.json
    op.execute("DELETE FROM dm_trieu_chung")
    with open("../FE/src/data/trieu_chung.json", encoding="utf-8") as f:
        items = json.load(f)
    for ten in items:
        ma = generate_id(10)
        op.execute(
            sa.text(
                "INSERT INTO dm_trieu_chung (ma_trieu_chung, ten_trieu_chung, mo_ta) "
                "VALUES (:ma, :ten, :mo_ta)"
            ).bindparams(ma=ma, ten=ten, mo_ta=ten)
        )
