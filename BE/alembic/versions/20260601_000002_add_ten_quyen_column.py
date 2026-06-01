"""add ten_quyen column to quyen

Revision ID: 20260601_000002
Revises: 20260601_000001
Create Date: 2026-06-01 00:00:02

"""

from typing import Sequence

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260601_000002"
down_revision: str | None = "20260601_000001"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def _has_column(inspector: sa.Inspector, table_name: str, column_name: str) -> bool:
    if not inspector.has_table(table_name):
        return False
    return any(column["name"] == column_name for column in inspector.get_columns(table_name))


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("quyen") or _has_column(inspector, "quyen", "ten_quyen"):
        return

    op.add_column("quyen", sa.Column("ten_quyen", sa.String(length=100), nullable=True))
    op.execute(sa.text("UPDATE quyen SET ten_quyen = id WHERE ten_quyen IS NULL"))
    op.alter_column(
        "quyen",
        "ten_quyen",
        existing_type=sa.String(length=100),
        nullable=False,
    )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if _has_column(inspector, "quyen", "ten_quyen"):
        op.drop_column("quyen", "ten_quyen")
