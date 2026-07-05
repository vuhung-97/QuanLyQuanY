from fastapi import Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.base import CRUDError
from app.crud.phieu_du_tru import phieu_du_tru_crud
from app.database.nguoi_dung import NguoiDung
from app.database.phieu_du_tru import PhieuDuTru
from app.database.phieu_nhap_kho import PhieuNhapKho
from app.database.chi_tiet_du_tru import ChiTietDuTru
from app.database.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKho
from app.database.session import get_db
from app.routes.base import _run_crud, create_crud_router
from app.services.inventory_service import InventoryService


router = create_crud_router(
    resource="phieu_du_tru",
    crud=phieu_du_tru_crud,
    read_permission="phieu_du_tru:read",
    create_permission="phieu_du_tru:create",
    update_permission="phieu_du_tru:update",
    delete_permission="phieu_du_tru:delete",
    enable_read=False,
)


@router.get(
    "/danh-sach",
    dependencies=[Depends(require_permissions("phieu_du_tru:read"))],
)
def get_danh_sach_phieu_du_tru(
    db: Session = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    trang_thai: str | None = Query(default=None),
):
    query = db.query(PhieuDuTru)
    if trang_thai:
        query = query.filter(PhieuDuTru.trang_thai == trang_thai)
    total = query.count()
    rows = (
        query.order_by(PhieuDuTru.ngay_lap_phieu.desc().nullslast())
        .offset(offset)
        .limit(limit)
        .all()
    )

    user_ids = {r.nguoi_lap for r in rows if r.nguoi_lap}
    users = {}
    if user_ids:
        for u in db.query(NguoiDung).filter(NguoiDung.id.in_(user_ids)).all():
            users[u.id] = u.ho_ten

    result = []
    for r in rows:
        d = {
            c.name: getattr(r, c.name) for c in PhieuDuTru.__table__.columns
        }
        d["nguoi_lap_ho_ten"] = users.get(r.nguoi_lap, r.nguoi_lap or "")
        result.append(d)

    return {"data": result, "total": total}


@router.get(
    "/{item_id}",
    dependencies=[Depends(require_permissions("phieu_du_tru:read"))],
)
def get_phieu_du_tru(item_id: str, db: Session = Depends(get_db)):
    phieu = _run_crud(lambda: phieu_du_tru_crud.get(db, item_id))
    d = {c.name: getattr(phieu, c.name) for c in PhieuDuTru.__table__.columns}
    user = db.get(NguoiDung, phieu.nguoi_lap) if phieu.nguoi_lap else None
    d["nguoi_lap_ho_ten"] = user.ho_ten if user else (phieu.nguoi_lap or "")
    return d


@router.post(
    "/{item_id}/duyet",
    dependencies=[Depends(require_permissions("phieu_du_tru:update"))],
)
def duyet_phieu_du_tru(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    phieu = db.get(PhieuDuTru, item_id)
    if not phieu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phiếu dự trù không tồn tại")
    if phieu.trang_thai and phieu.trang_thai != "chua_duyet":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Không thể duyệt phiếu ở trạng thái {phieu.trang_thai}")
    phieu.trang_thai = "da_duyet"
    db.commit()
    db.refresh(phieu)
    return phieu


@router.post(
    "/{item_id}/tu-choi",
    dependencies=[Depends(require_permissions("phieu_du_tru:update"))],
)
def tu_choi_phieu_du_tru(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    phieu = db.get(PhieuDuTru, item_id)
    if not phieu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phiếu dự trù không tồn tại")
    if phieu.trang_thai and phieu.trang_thai != "chua_duyet":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Không thể từ chối phiếu ở trạng thái {phieu.trang_thai}")
    phieu.trang_thai = "tu_choi"
    db.commit()
    db.refresh(phieu)
    return phieu


@router.post(
    "/{item_id}/nhap-kho",
    dependencies=[Depends(require_permissions("phieu_du_tru:update"))],
)
def nhap_kho_tu_phieu_du_tru(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    phieu = db.get(PhieuDuTru, item_id)
    if not phieu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phiếu dự trù không tồn tại")
    if phieu.trang_thai != "da_duyet":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Chỉ duyệt được phiếu đã duyệt, hiện tại: {phieu.trang_thai}")

    chi_tiets = db.query(ChiTietDuTru).filter(
        ChiTietDuTru.ma_phieu_du_tru == item_id
    ).all()

    if not chi_tiets:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phiếu dự trù không có chi tiết thuốc")

    phieu_nhap = PhieuNhapKho(
        ma_phieu_du_tru=item_id,
        nguoi_nhap=current_user.id if hasattr(current_user, "id") else None,
    )
    db.add(phieu_nhap)
    db.flush()

    for ct in chi_tiets:
        ct_nhap = ChiTietPhieuNhapKho(
            ma_phieu_nhap=phieu_nhap.ma_phieu_nhap,
            ma_thuoc_vtyt=ct.ma_thuoc_vtyt,
            so_luong=ct.so_luong,
        )
        db.add(ct_nhap)

    try:
        InventoryService.import_stock(db, phieu_nhap.ma_phieu_nhap)
    except CRUDError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    db.refresh(phieu)
    return {"phieu_nhap": phieu_nhap, "message": "Nhập kho thành công"}
