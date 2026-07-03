from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.base import CRUDError
from app.crud.phieu_xuat_kho import phieu_xuat_kho_crud
from app.database.nguoi_dung import NguoiDung
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.session import get_db
from app.routes.base import create_crud_router
from app.services.inventory_service import InventoryService


router = create_crud_router(
    resource="phieu_xuat_kho",
    crud=phieu_xuat_kho_crud,
    read_permission="phieu_xuat_kho:read",
    create_permission="phieu_xuat_kho:create",
    update_permission="phieu_xuat_kho:update",
    delete_permission="phieu_xuat_kho:delete",
)


@router.post(
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


@router.post(
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


@router.post(
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
