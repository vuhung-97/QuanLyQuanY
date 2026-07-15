from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.nguoi_dung import NguoiDung
from app.database.phan_cong_nhiem_vu import PhanCongNhiemVu
from app.database.session import get_db
from app.database.vai_tro import VaiTro
from app.database.vai_tro_tam_thoi import VaiTroTamThoi
from app.core.dependencies import require_permissions
from app.schemas.phan_cong_nhiem_vu import PhanCongNhiemVuRead

router = APIRouter(prefix="/lich_kham_sk_nam/{ma_lich_kham}/phan-cong", tags=["phan_cong_nhiem_vu"])

read_deps = [Depends(require_permissions("phan_cong_nhiem_vu:read"))]


def _enrich_pcnv_list(items: list[PhanCongNhiemVu], db: Session) -> list[dict]:
    user_ids = {p.id_nguoi_dung for p in items}
    role_ids = {p.ma_vai_tro for p in items}
    users = {u.id: u.ho_ten for u in db.query(NguoiDung).filter(NguoiDung.id.in_(user_ids)).all()}
    roles = {r.ma_vai_tro: r.ten_vai_tro for r in db.query(VaiTroTamThoi).filter(VaiTroTamThoi.ma_vai_tro.in_(role_ids)).all()}

    user_role_ids = {u.id: u.id_vai_tro for u in db.query(NguoiDung).filter(NguoiDung.id.in_(user_ids)).all()}
    all_role_ids = {v for v in user_role_ids.values() if v}
    role_names = {}
    if all_role_ids:
        role_names = {r.id: r.ten_vai_tro for r in db.query(VaiTro).filter(VaiTro.id.in_(all_role_ids)).all()}

    result = []
    for p in items:
        d = PhanCongNhiemVuRead.model_validate(p).model_dump(mode="json")
        d["ten_nguoi_dung"] = users.get(p.id_nguoi_dung, "")
        d["ten_vai_tro"] = roles.get(p.ma_vai_tro, "")
        d["chuc_vu"] = role_names.get(user_role_ids.get(p.id_nguoi_dung, ""), "")
        result.append(d)
    return result


@router.get("", dependencies=read_deps, response_model=list[PhanCongNhiemVuRead])
def list_assignments(ma_lich_kham: str, db: Session = Depends(get_db)):
    items = db.query(PhanCongNhiemVu).filter(PhanCongNhiemVu.ma_lich_kham == ma_lich_kham).all()
    return _enrich_pcnv_list(items, db)
