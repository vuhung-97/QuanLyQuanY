from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.crud.nhat_ky_dang_nhap import nhat_ky_dang_nhap_crud
from app.database.nguoi_dung import NguoiDung
from app.database.session import get_db
from app.routes.base import _run_crud
from app.schemas.nhat_ky_dang_nhap import NhatKyDangNhapRead


router = APIRouter(prefix="/nhat_ky_dang_nhap", tags=["nhat_ky_dang_nhap"])


def _attach_ho_ten(db: Session, records: list) -> None:
    user_ids = {r.id_nguoi_dung for r in records if r.id_nguoi_dung}
    if not user_ids:
        return
    users = db.query(NguoiDung.id, NguoiDung.ho_ten).filter(
        NguoiDung.id.in_(user_ids)
    ).all()
    user_map = {u.id: u.ho_ten for u in users}
    for r in records:
        r.ho_ten = user_map.get(r.id_nguoi_dung)


@router.get(
    "",
    response_model=list[NhatKyDangNhapRead],
    dependencies=[Depends(require_permissions("nhat_ky_dang_nhap:read"))],
)
def list_items(
    db: Session = Depends(get_db),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    sort_by: str | None = Query(default=None),
    sort_desc: bool = Query(default=False),
) -> list[Any]:
    records = _run_crud(
        lambda: nhat_ky_dang_nhap_crud.get_multi(
            db, limit=limit, offset=offset, sort_by=sort_by, sort_desc=sort_desc
        )
    )
    _attach_ho_ten(db, records)
    return records


@router.get(
    "/{item_id}",
    response_model=NhatKyDangNhapRead,
    dependencies=[Depends(require_permissions("nhat_ky_dang_nhap:read"))],
)
def get_item(item_id: str, db: Session = Depends(get_db)) -> Any:
    record = _run_crud(lambda: nhat_ky_dang_nhap_crud.get(db, item_id))
    _attach_ho_ten(db, [record])
    return record
