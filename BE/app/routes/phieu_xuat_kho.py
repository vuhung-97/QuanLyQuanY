from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.base import CRUDError
from app.crud.phieu_xuat_kho import phieu_xuat_kho_crud
from app.database.nguoi_dung import NguoiDung
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.session import get_db
from app.routes.base import _run_crud, create_crud_router
from app.schemas.phieu_xuat_kho import PhieuXuatKhoRead
from app.services.inventory_service import InventoryService


pre_router = APIRouter()


@pre_router.get(
    "/danh-sach",
    dependencies=[Depends(require_permissions("phieu_xuat_kho:read"))],
)
def get_danh_sach_phieu_xuat(
    db: Session = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    trang_thai: str | None = Query(default=None),
    nam: int | None = Query(default=None),
):
    query = db.query(PhieuXuatKho)
    if trang_thai:
        query = query.filter(PhieuXuatKho.trang_thai == trang_thai)
    if nam:
        query = query.filter(func.extract("year", PhieuXuatKho.ngay_thang_nam) == nam)
    total = query.count()
    rows = (
        query.order_by(PhieuXuatKho.ngay_thang_nam.desc().nullslast())
        .offset(offset)
        .limit(limit)
        .all()
    )

    user_ids = {r.nguoi_xuat for r in rows if r.nguoi_xuat} | {
        r.nguoi_duyet for r in rows if r.nguoi_duyet
    }
    users = {}
    if user_ids:
        for u in db.query(NguoiDung).filter(NguoiDung.id.in_(user_ids)).all():
            users[u.id] = u.ho_ten

    result = []
    for r in rows:
        d = {
            c.name: getattr(r, c.name) for c in PhieuXuatKho.__table__.columns
        }
        d["nguoi_xuat_ho_ten"] = users.get(r.nguoi_xuat, r.nguoi_xuat or "")
        d["nguoi_duyet_ho_ten"] = users.get(r.nguoi_duyet, r.nguoi_duyet or "")
        result.append(d)

    return {"data": result, "total": total}


@pre_router.post(
    "/{item_id}/duyet",
    dependencies=[Depends(require_permissions("phieu_xuat_kho:update"))],
)
def duyet_phieu_xuat(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    phieu = db.get(PhieuXuatKho, item_id)
    if not phieu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phiếu xuất không tồn tại")
    if phieu.trang_thai and phieu.trang_thai != "cho_duyet":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Không thể duyệt phiếu ở trạng thái {phieu.trang_thai}")
    phieu.trang_thai = "da_duyet"
    phieu.nguoi_duyet = current_user.id if hasattr(current_user, "id") else None
    db.commit()
    db.refresh(phieu)
    return phieu


@pre_router.post(
    "/{item_id}/tu-choi",
    dependencies=[Depends(require_permissions("phieu_xuat_kho:update"))],
)
def tu_choi_phieu_xuat(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    phieu = db.get(PhieuXuatKho, item_id)
    if not phieu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phiếu xuất không tồn tại")
    if phieu.trang_thai and phieu.trang_thai != "cho_duyet":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Không thể từ chối phiếu ở trạng thái {phieu.trang_thai}")
    phieu.trang_thai = "tu_choi"
    db.commit()
    db.refresh(phieu)
    return phieu


@pre_router.post(
    "/{item_id}/xuat-kho",
    dependencies=[Depends(require_permissions("phieu_xuat_kho:update"))],
)
def xuat_kho(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    phieu = db.get(PhieuXuatKho, item_id)
    if not phieu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phiếu xuất không tồn tại")
    if phieu.trang_thai != "da_duyet":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Chỉ xuất được phiếu đã duyệt, hiện tại: {phieu.trang_thai}")

    try:
        InventoryService.export_stock(db, item_id)
    except CRUDError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    phieu.trang_thai = "da_xuat"
    phieu.nguoi_xuat = current_user.id if hasattr(current_user, "id") else None
    db.commit()
    db.refresh(phieu)
    return phieu


@pre_router.get(
    "/{item_id}",
    dependencies=[Depends(require_permissions("phieu_xuat_kho:read"))],
)
def get_phieu_xuat(item_id: str, db: Session = Depends(get_db)):
    phieu = _run_crud(lambda: phieu_xuat_kho_crud.get(db, item_id))
    d = {c.name: getattr(phieu, c.name) for c in PhieuXuatKho.__table__.columns}
    user = db.get(NguoiDung, phieu.nguoi_xuat) if phieu.nguoi_xuat else None
    d["nguoi_xuat_ho_ten"] = user.ho_ten if user else (phieu.nguoi_xuat or "")
    return d


router = create_crud_router(
    resource="phieu_xuat_kho",
    crud=phieu_xuat_kho_crud,
    pre_router=pre_router,
    read_permission="phieu_xuat_kho:read",
    create_permission="phieu_xuat_kho:create",
    update_permission="phieu_xuat_kho:update",
    delete_permission="phieu_xuat_kho:delete",
    enable_read=False,
)
