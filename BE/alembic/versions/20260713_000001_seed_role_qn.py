"""seed ROLE_QN and permissions

Revision ID: 20260713_000001
Revises: 20260709_000003
Create Date: 2026-07-13 00:00:01

"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260713_000001"
down_revision: str | None = "20260709_000003"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None

QN_PERMISSIONS = [
    "quan_nhan:read",
    "phieu_kham_suc_khoe:read",
    "kham_benh:read",
    "benh_an:read",
]


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        inspector = sa.inspect(bind)
        if not inspector.has_table("vai_tro"):
            return

    exists = bind.execute(
        sa.text("SELECT 1 FROM vai_tro WHERE id = 'ROLE_QN'")
    ).scalar()
    if not exists:
        op.execute(
            sa.text(
                "INSERT INTO vai_tro (id, ten_vai_tro, mo_ta) "
                "VALUES ('ROLE_QN', 'Quân nhân', 'Xem thông tin cá nhân, báo cáo')"
            )
        )

    for perm in QN_PERMISSIONS:
        exists = bind.execute(
            sa.text(
                "SELECT 1 FROM vai_tro_quyen "
                "WHERE id_vai_tro = 'ROLE_QN' AND id_quyen = :perm"
            ),
            {"perm": perm},
        ).scalar()
        if not exists:
            op.execute(
                sa.text(
                    "INSERT INTO vai_tro_quyen (id_vai_tro, id_quyen) "
                    "VALUES ('ROLE_QN', :perm)"
                ).bindparams(perm=perm)
            )


def downgrade() -> None:
    bind = op.get_bind()
    for perm in QN_PERMISSIONS:
        op.execute(
            sa.text(
                "DELETE FROM vai_tro_quyen WHERE id_vai_tro = 'ROLE_QN' AND id_quyen = :perm"
            ).bindparams(perm=perm)
        )
    op.execute(
        sa.text("DELETE FROM vai_tro WHERE id = 'ROLE_QN'")
    )
