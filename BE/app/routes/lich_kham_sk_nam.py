from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.lich_kham_sk_nam import lich_kham_sk_nam_crud
from app.database.nhat_ky_thao_tac import NhatKyThaoTac
from app.database.session import get_db
from app.routes.base import create_crud_router, _resolve_schema
from app.core.dependencies import get_current_user, require_permissions


router = create_crud_router(
    resource="lich_kham_sk_nam",
    crud=lich_kham_sk_nam_crud,
    read_permission="lich_kham_sk_nam:read",
    create_permission="lich_kham_sk_nam:create",
    update_permission="lich_kham_sk_nam:update",
    delete_permission="lich_kham_sk_nam:delete",
    enable_update=False,
    enable_delete=False,
)

read_schema = _resolve_schema("lich_kham_sk_nam", "Read")
update_schema = _resolve_schema("lich_kham_sk_nam", "Update")

update_deps = [Depends(require_permissions("lich_kham_sk_nam:update"))]
delete_deps = [Depends(require_permissions("lich_kham_sk_nam:delete"))]


@router.patch("/{item_id}", dependencies=update_deps, response_model=read_schema)
def update_lich_kham(
    item_id: str,
    payload: update_schema,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, item_id)
    if row.trang_thai != "cho_gui":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ có thể sửa lịch khám ở trạng thái chờ gửi.",
        )
    return lich_kham_sk_nam_crud.update(db, item_id, payload, nguoi_dung_id=current_user.id)


@router.delete("/{item_id}", dependencies=delete_deps, status_code=status.HTTP_204_NO_CONTENT)
def delete_lich_kham(
    item_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, item_id)
    if row.trang_thai == "da_duyet":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lịch khám đã được duyệt, không thể xóa.",
        )
    lich_kham_sk_nam_crud.delete(db, item_id, nguoi_dung_id=current_user.id)


@router.post("/{ma_lich_kham}/gui", dependencies=update_deps, response_model=read_schema)
def gui_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, ma_lich_kham)
    if row.trang_thai != "cho_gui":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể gửi duyệt lịch khám ở trạng thái {row.trang_thai}.",
        )
    row.trang_thai = "cho_duyet"
    db.commit()
    db.refresh(row)
    log = NhatKyThaoTac(
        id_nguoi_dung=current_user.id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong="GUI",
        ten_bang="lich_kham_sk_nam",
        du_lieu_moi={"ma_lich_kham": ma_lich_kham, "trang_thai": "cho_duyet"},
    )
    db.add(log)
    db.commit()
    return row


@router.post("/{ma_lich_kham}/duyet", dependencies=update_deps, response_model=read_schema)
def duyet_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, ma_lich_kham)
    if current_user.id_vai_tro not in ("ROLE_ADMIN", "ROLE_CNQY"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ CNQY/ADMIN mới có quyền duyệt lịch khám.",
        )
    if row.trang_thai != "cho_duyet":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể duyệt lịch khám ở trạng thái {row.trang_thai}.",
        )
    row.trang_thai = "da_duyet"
    db.commit()
    db.refresh(row)
    log = NhatKyThaoTac(
        id_nguoi_dung=current_user.id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong="DUYET",
        ten_bang="lich_kham_sk_nam",
        du_lieu_moi={"ma_lich_kham": ma_lich_kham, "trang_thai": "da_duyet"},
    )
    db.add(log)
    db.commit()
    return row


@router.post("/{ma_lich_kham}/tu-choi", dependencies=update_deps, response_model=read_schema)
def tu_choi_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, ma_lich_kham)
    if current_user.id_vai_tro not in ("ROLE_ADMIN", "ROLE_CNQY"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ CNQY/ADMIN mới có quyền từ chối lịch khám.",
        )
    if row.trang_thai != "cho_duyet":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể từ chối lịch khám ở trạng thái {row.trang_thai}.",
        )
    row.trang_thai = "tu_choi"
    db.commit()
    db.refresh(row)
    log = NhatKyThaoTac(
        id_nguoi_dung=current_user.id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong="TU_CHOI",
        ten_bang="lich_kham_sk_nam",
        du_lieu_moi={"ma_lich_kham": ma_lich_kham, "trang_thai": "tu_choi"},
    )
    db.add(log)
    db.commit()
    return row
