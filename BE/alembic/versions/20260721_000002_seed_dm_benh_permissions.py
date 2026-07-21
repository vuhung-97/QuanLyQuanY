"""seed dm_benh permissions

Revision ID: 20260721_000002
Revises: 20260721_000001
Create Date: 2026-07-21 00:00:02
"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa

from app.core.security import Action


revision: str = "20260721_000002"
down_revision: str | None = "20260721_000001"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None

RESOURCE = "dm_benh"
PERMISSIONS = [f"{RESOURCE}:{act}" for act in [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE]]

ADMIN_ROLE = "ROLE_ADMIN"


def upgrade() -> None:
    bind = op.get_bind()
    for perm in PERMISSIONS:
        exists = bind.execute(
            sa.text("SELECT 1 FROM quyen WHERE id = :id"), {"id": perm}
        ).scalar()
        if not exists:
            op.execute(
                sa.text("INSERT INTO quyen (id, ten_quyen) VALUES (:id, :ten)").bindparams(id=perm, ten=perm)
            )

        role_exists = bind.execute(
            sa.text("SELECT 1 FROM vai_tro_quyen WHERE id_vai_tro = :role AND id_quyen = :perm"),
            {"role": ADMIN_ROLE, "perm": perm},
        ).scalar()
        if not role_exists:
            op.execute(
                sa.text("INSERT INTO vai_tro_quyen (id_vai_tro, id_quyen) VALUES (:role, :perm)").bindparams(role=ADMIN_ROLE, perm=perm)
            )


def downgrade() -> None:
    bind = op.get_bind()
    for perm in PERMISSIONS:
        op.execute(
            sa.text("DELETE FROM vai_tro_quyen WHERE id_vai_tro = :role AND id_quyen = :perm").bindparams(role=ADMIN_ROLE, perm=perm)
        )
        op.execute(
            sa.text("DELETE FROM quyen WHERE id = :id").bindparams(id=perm)
        )
