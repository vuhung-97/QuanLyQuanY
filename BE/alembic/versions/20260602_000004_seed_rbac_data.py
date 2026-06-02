"""seed RBAC data: permissions, admin role, mapping, admin user

Revision ID: 20260602_000004
Revises: 20260602_000003
Create Date: 2026-06-02 00:00:04

"""

import os
from typing import Sequence

from alembic import op
import sqlalchemy as sa
from passlib.context import CryptContext

from app.core.security import get_all_permissions


revision: str = "20260602_000004"
down_revision: str | None = "20260602_000003"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def seed_permissions(bind):
    perms = get_all_permissions()
    for perm in perms:
        exists = bind.execute(
            sa.text("SELECT 1 FROM quyen WHERE id = :id"), {"id": perm}
        ).scalar()
        if not exists:
            op.execute(sa.text("INSERT INTO quyen (id, ten_quyen) VALUES (:id, :ten)").bindparams(id=perm, ten=perm))


def seed_admin_role(bind):
    exists = bind.execute(
        sa.text("SELECT 1 FROM vai_tro WHERE id = 'admin'")
    ).scalar()
    if not exists:
        op.execute(
            sa.text("INSERT INTO vai_tro (id, ten_vai_tro, mo_ta) VALUES ('admin', 'Admin', 'Toàn quyền hệ thống')")
        )


def seed_admin_permissions(bind):
    perms = get_all_permissions()
    for perm in perms:
        exists = bind.execute(
            sa.text("SELECT 1 FROM vai_tro_quyen WHERE id_vai_tro = 'admin' AND id_quyen = :perm"),
            {"perm": perm},
        ).scalar()
        if not exists:
            op.execute(sa.text("INSERT INTO vai_tro_quyen (id_vai_tro, id_quyen) VALUES ('admin', :perm)").bindparams(perm=perm))


def seed_admin_user(bind):
    exists = bind.execute(
        sa.text("SELECT 1 FROM nguoi_dung WHERE ten_dang_nhap = 'admin'")
    ).scalar()
    if not exists:
        password = os.getenv("ADMIN_PASSWORD", "admin123")
        pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hashed = pwd_ctx.hash(password)
        op.execute(
            sa.text(
                "INSERT INTO nguoi_dung (id, ten_dang_nhap, mat_khau_hash, ho_ten, id_vai_tro, trang_thai) "
                "VALUES ('admin', 'admin', :hash, 'Administrator', 'admin', true)"
            ).bindparams(hash=hashed)
        )


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        inspector = sa.inspect(bind)
        if not inspector.has_table("quyen"):
            return

    seed_permissions(bind)
    seed_admin_role(bind)
    seed_admin_permissions(bind)
    seed_admin_user(bind)


def downgrade() -> None:
    pass
