"""sync missing permissions: dm_nhom_benh, lich_kham_sk_nam_chi_tiet

Revision ID: 20260709_000001
Revises: f8e7d6c5b4a3
Create Date: 2026-07-09 00:00:01

"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260709_000001"
down_revision: str | None = "f8e7d6c5b4a3"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


MISSING_RESOURCES = ["dm_nhom_benh", "lich_kham_sk_nam_chi_tiet"]
ACTIONS = ["read", "create", "update", "delete"]


def seed_missing_permissions(bind):
    for res in MISSING_RESOURCES:
        for act in ACTIONS:
            perm = f"{res}:{act}"
            exists = bind.execute(
                sa.text("SELECT 1 FROM quyen WHERE id = :id"), {"id": perm}
            ).scalar()
            if not exists:
                op.execute(
                    sa.text("INSERT INTO quyen (id, ten_quyen) VALUES (:id, :ten)").bindparams(
                        id=perm, ten=perm
                    )
                )


def seed_admin_missing_permissions(bind):
    admin_exists = bind.execute(
        sa.text("SELECT 1 FROM vai_tro WHERE id = 'admin'")
    ).scalar()
    if not admin_exists:
        return

    for res in MISSING_RESOURCES:
        for act in ACTIONS:
            perm = f"{res}:{act}"
            exists = bind.execute(
                sa.text(
                    "SELECT 1 FROM vai_tro_quyen WHERE id_vai_tro = 'admin' AND id_quyen = :perm"
                ),
                {"perm": perm},
            ).scalar()
            if not exists:
                op.execute(
                    sa.text(
                        "INSERT INTO vai_tro_quyen (id_vai_tro, id_quyen) VALUES ('admin', :perm)"
                    ).bindparams(perm=perm)
                )


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        inspector = sa.inspect(bind)
        if not inspector.has_table("quyen"):
            return

    seed_missing_permissions(bind)
    seed_admin_missing_permissions(bind)


def downgrade() -> None:
    bind = op.get_bind()
    for res in MISSING_RESOURCES:
        for act in ACTIONS:
            perm = f"{res}:{act}"
            op.execute(
                sa.text("DELETE FROM vai_tro_quyen WHERE id_quyen = :perm").bindparams(perm=perm)
            )
            op.execute(
                sa.text("DELETE FROM quyen WHERE id = :id").bindparams(id=perm)
            )
