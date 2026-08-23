from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.base import CRUDError
from app.crud.phieu_xuat_kho import phieu_xuat_kho_crud
from app.database.don_vi import DonVi
from app.database.nguoi_dung import NguoiDung
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.session import get_db
from app.routes.base import _run_crud, create_crud_router
from app.schemas.phieu_xuat_kho import PhieuXuatKhoRead, XuatKhoRequest
from app.services.inventory_service import InventoryService
from app.database.chi_tiet_xuat_kho import ChiTietXuatKho
from app.database.nhat_ky_thao_tac import NhatKyThaoTac


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
    thang: int | None = Query(default=None, ge=1, le=12),
    search: str | None = Query(default=None),
):
    query = db.query(PhieuXuatKho)
    if trang_thai:
        query = query.filter(PhieuXuatKho.trang_thai == trang_thai)
    if nam:
        query = query.filter(func.extract("year", PhieuXuatKho.ngay_thang_nam) == nam)
    if thang:
        query = query.filter(func.extract("month", PhieuXuatKho.ngay_thang_nam) == thang)
    if search:
        q = f"%{search}%"
        matching_user_ids = {
            u.id
            for u in db.query(NguoiDung).filter(NguoiDung.ho_ten.ilike(q)).all()
        }
        matching_don_vi_codes = {
            dv.ma_don_vi
            for dv in db.query(DonVi).filter(DonVi.ten_don_vi.ilike(q)).all()
        }
        query = query.filter(
            PhieuXuatKho.ho_ten_nguoi_nhan.ilike(q)
            | PhieuXuatKho.nguoi_xuat.in_(matching_user_ids)
            | PhieuXuatKho.ma_don_vi_nhan.in_(matching_don_vi_codes)
        )
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

    don_vi_codes = {r.ma_don_vi_nhan for r in rows if r.ma_don_vi_nhan}
    don_vis = {}
    if don_vi_codes:
        for dv in db.query(DonVi).filter(DonVi.ma_don_vi.in_(don_vi_codes)).all():
            don_vis[dv.ma_don_vi] = dv.ten_don_vi

    result = []
    for r in rows:
        d = {
            c.name: getattr(r, c.name) for c in PhieuXuatKho.__table__.columns
        }
        d["nguoi_xuat_ho_ten"] = users.get(r.nguoi_xuat, r.nguoi_xuat or "")
        d["nguoi_duyet_ho_ten"] = users.get(r.nguoi_duyet, r.nguoi_duyet or "")
        d["ten_don_vi_nhan"] = don_vis.get(r.ma_don_vi_nhan, r.ma_don_vi_nhan or "")
        result.append(d)

    return {"data": result, "total": total}


@pre_router.post(
    "/{item_id}/gui",
    dependencies=[Depends(require_permissions("phieu_xuat_kho:update"))],
)
def gui_phieu_xuat(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    phieu = db.get(PhieuXuatKho, item_id)
    if not phieu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phiếu xuất không tồn tại")
    if phieu.trang_thai != "cho_gui":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Không thể gửi duyệt phiếu ở trạng thái {phieu.trang_thai}")
    phieu.trang_thai = "cho_duyet"
    db.commit()
    db.refresh(phieu)
    return phieu


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
    if phieu.trang_thai != "cho_duyet":
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
    if phieu.trang_thai != "cho_duyet":
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
    body: XuatKhoRequest | None = None,
    current_user: NguoiDung = Depends(get_current_user),
):
    phieu = db.get(PhieuXuatKho, item_id)
    if not phieu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phiếu xuất không tồn tại")
    if phieu.trang_thai != "da_duyet":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Chỉ xuất được phiếu đã duyệt, hiện tại: {phieu.trang_thai}")

    try:
        InventoryService.export_stock(
            db, item_id, thuc_xuat=body.thuc_xuat if body else None,
            auto_commit=False,
        )
    except CRUDError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    if body is not None and "ma_quan_nhan_nhan" in body.model_fields_set:
        phieu.ma_quan_nhan_nhan = body.ma_quan_nhan_nhan
    if body is not None and "ho_ten_nguoi_nhan" in body.model_fields_set:
        phieu.ho_ten_nguoi_nhan = body.ho_ten_nguoi_nhan

    phieu.trang_thai = "da_xuat"
    phieu.ngay_xuat = datetime.now()
    phieu.nguoi_xuat = current_user.id if hasattr(current_user, "id") else None
    db.commit()
    db.refresh(phieu)
    return phieu


@pre_router.post(
    "/{item_id}/xuat-bu",
    dependencies=[Depends(require_permissions("phieu_xuat_kho:create"))],
)
def xuat_bu_phieu_xuat(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    phieu = db.get(PhieuXuatKho, item_id)
    if not phieu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phiếu xuất không tồn tại")
    if phieu.trang_thai != "da_xuat":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chỉ xuất bù được cho phiếu đã xuất")

    chi_tiets = db.query(ChiTietXuatKho).filter(
        ChiTietXuatKho.ma_phieu_xuat == item_id
    ).all()

    remaining = []
    for ct in chi_tiets:
        thuc = (
            ct.so_luong_thuc_xuat
            if ct.so_luong_thuc_xuat is not None
            else ct.so_luong
        )
        if thuc < ct.so_luong:
            remaining.append((ct.ma_thuoc_vtyt, ct.so_luong - thuc))

    if not remaining:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không còn số lượng cần xuất bù",
        )

    ngay = phieu.ngay_thang_nam.strftime("%d/%m/%Y") if phieu.ngay_thang_nam else ""
    phieu_moi = PhieuXuatKho(
        ma_don_vi_nhan=phieu.ma_don_vi_nhan,
        ma_quan_nhan_nhan=phieu.ma_quan_nhan_nhan,
        ho_ten_nguoi_nhan=phieu.ho_ten_nguoi_nhan,
        trang_thai="da_duyet",
        nguoi_xuat=current_user.id if hasattr(current_user, "id") else None,
        nguoi_duyet=phieu.nguoi_duyet,
        ly_do_xuat=phieu.ly_do_xuat,
        ghi_chu=f"Xuất bù cho phiếu {phieu.ma_phieu_xuat} {ngay}".strip(),
    )
    db.add(phieu_moi)
    db.flush()

    for ma_thuoc, so_luong in remaining:
        db.add(
            ChiTietXuatKho(
                ma_phieu_xuat=phieu_moi.ma_phieu_xuat,
                ma_thuoc_vtyt=ma_thuoc,
                so_luong=so_luong,
            )
        )

    db.commit()
    return {"ma_phieu_xuat": phieu_moi.ma_phieu_xuat}


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
