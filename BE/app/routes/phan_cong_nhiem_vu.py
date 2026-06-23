from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.crud.phan_cong_nhiem_vu import phan_cong_nhiem_vu_crud
from app.database.nguoi_dung import NguoiDung
from app.database.phan_cong_nhiem_vu import PhanCongNhiemVu
from app.database.nhat_ky_thao_tac import NhatKyThaoTac
from app.database.session import get_db
from app.database.vai_tro_tam_thoi import VaiTroTamThoi
from app.core.dependencies import get_current_user, require_permissions
from app.routes.base import _run_crud
from app.schemas.phan_cong_nhiem_vu import (
    PhanCongNhiemVuCreate as PhanCongNhiemVuCreateSchema,
    PhanCongNhiemVuRead,
    PhanCongNhiemVuUpdate,
)

router = APIRouter(prefix="/lich_kham_sk_nam/{ma_lich_kham}/phan-cong", tags=["phan_cong_nhiem_vu"])

read_deps = [Depends(require_permissions("phan_cong_nhiem_vu:read"))]
create_deps = [Depends(require_permissions("phan_cong_nhiem_vu:create"))]
update_deps = [Depends(require_permissions("phan_cong_nhiem_vu:update"))]
delete_deps = [Depends(require_permissions("phan_cong_nhiem_vu:delete"))]


def _enrich_pcnv_list(items: list[PhanCongNhiemVu], db: Session) -> list[dict]:
    user_ids = {p.id_nguoi_dung for p in items}
    role_ids = {p.ma_vai_tro for p in items}
    users = {u.id: u.ho_ten for u in db.query(NguoiDung).filter(NguoiDung.id.in_(user_ids)).all()}
    roles = {r.ma_vai_tro: r.ten_vai_tro for r in db.query(VaiTroTamThoi).filter(VaiTroTamThoi.ma_vai_tro.in_(role_ids)).all()}
    result = []
    for p in items:
        d = PhanCongNhiemVuRead.model_validate(p).model_dump(mode="json")
        d["ten_nguoi_dung"] = users.get(p.id_nguoi_dung, "")
        d["ten_vai_tro"] = roles.get(p.ma_vai_tro, "")
        result.append(d)
    return result


def _enrich_one(p: PhanCongNhiemVu, db: Session) -> dict:
    return _enrich_pcnv_list([p], db)[0]


@router.get("", dependencies=read_deps, response_model=list[PhanCongNhiemVuRead])
def list_assignments(ma_lich_kham: str, db: Session = Depends(get_db)):
    items = db.query(PhanCongNhiemVu).filter(PhanCongNhiemVu.ma_lich_kham == ma_lich_kham).all()
    return _enrich_pcnv_list(items, db)


@router.post("", dependencies=create_deps, status_code=status.HTTP_201_CREATED, response_model=PhanCongNhiemVuRead)
def create_assignment(
    ma_lich_kham: str,
    payload: PhanCongNhiemVuCreateSchema,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = PhanCongNhiemVu(ma_lich_kham=ma_lich_kham, **payload.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    log = NhatKyThaoTac(
        id_nguoi_dung=current_user.id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong="CREATE",
        ten_bang="phan_cong_nhiem_vu",
        du_lieu_moi=phan_cong_nhiem_vu_crud._row_to_dict(row),
    )
    db.add(log)
    db.commit()
    return _enrich_one(row, db)


@router.patch("/{id_phan_cong}", dependencies=update_deps, response_model=PhanCongNhiemVuRead)
def update_assignment(
    ma_lich_kham: str,
    id_phan_cong: str,
    payload: PhanCongNhiemVuUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    p = _run_crud(lambda: phan_cong_nhiem_vu_crud.update(db, id_phan_cong, payload, nguoi_dung_id=current_user.id))
    return _enrich_one(p, db)


@router.delete("/{id_phan_cong}", dependencies=delete_deps, status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(
    ma_lich_kham: str,
    id_phan_cong: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    _run_crud(lambda: phan_cong_nhiem_vu_crud.delete(db, id_phan_cong, nguoi_dung_id=current_user.id))
