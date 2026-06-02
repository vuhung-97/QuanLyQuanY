"""increase quyen.id and vai_tro_quyen.id_quyen to String(100)

Revision ID: 20260602_000003
Revises: 20260601_000002
Create Date: 2026-06-02 00:00:03

"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260602_000003"
down_revision: str | None = "20260601_000002"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("quyen"):
        col_info = [c for c in inspector.get_columns("quyen") if c["name"] == "id"]
        if col_info and col_info[0]["type"].length == 20:
            op.alter_column("quyen", "id", type_=sa.String(100))

    if inspector.has_table("vai_tro_quyen"):
        col_info = [c for c in inspector.get_columns("vai_tro_quyen") if c["name"] == "id_quyen"]
        if col_info and col_info[0]["type"].length == 20:
            op.alter_column("vai_tro_quyen", "id_quyen", type_=sa.String(100))


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("quyen"):
        col_info = [c for c in inspector.get_columns("quyen") if c["name"] == "id"]
        if col_info and col_info[0]["type"].length == 100:
            op.alter_column("quyen", "id", type_=sa.String(20))

    if inspector.has_table("vai_tro_quyen"):
        col_info = [c for c in inspector.get_columns("vai_tro_quyen") if c["name"] == "id_quyen"]
        if col_info and col_info[0]["type"].length == 100:
            op.alter_column("vai_tro_quyen", "id_quyen", type_=sa.String(20))
