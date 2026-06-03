from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.nguoi_dung import NguoiDung
from app.database.vai_tro import VaiTro


def attach_vai_tro_names(db: Session, users: list[NguoiDung]) -> None:
    role_ids = {u.id_vai_tro for u in users if u.id_vai_tro}
    if not role_ids:
        return
    rows = db.execute(
        select(VaiTro.id, VaiTro.ten_vai_tro).where(VaiTro.id.in_(role_ids))
    ).all()
    role_map = {r.id: r.ten_vai_tro for r in rows}
    for u in users:
        u.ten_vai_tro = role_map.get(u.id_vai_tro)


def attach_vai_tro_name(db: Session, user: NguoiDung) -> None:
    if user.id_vai_tro:
        role = db.get(VaiTro, user.id_vai_tro)
        user.ten_vai_tro = role.ten_vai_tro if role else None
