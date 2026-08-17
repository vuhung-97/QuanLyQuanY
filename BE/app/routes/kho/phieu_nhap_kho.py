from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.base import CRUDError
from app.database.chi_tiet_du_tru import ChiTietDuTru
from app.database.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKho
from app.database.nguoi_dung import NguoiDung
from app.database.phieu_du_tru import PhieuDuTru
from app.database.phieu_nhap_kho import PhieuNhapKho
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.crud.phieu_nhap_kho import phieu_nhap_kho_crud
from app.routes.base import create_crud_router
from app.schemas.phieu_nhap_kho import CapNhatPhieuNhapRequest, TaoPhieuNhapRequest
from app.services.inventory_service import InventoryService


pre_router = APIRouter()


def _get_cho_phep_sua(db: Session, phieu_nhap: PhieuNhapKho, nhap_cts=None) -> bool:
    if not phieu_nhap.ma_phieu_du_tru:
        return True
    if nhap_cts is None:
        nhap_cts = (
            db.query(ChiTietPhieuNhapKho)
            .filter(ChiTietPhieuNhapKho.ma_phieu_nhap == phieu_nhap.ma_phieu_nhap)
            .all()
        )
    du_tru_cts = (
        db.query(ChiTietDuTru)
        .filter(ChiTietDuTru.ma_phieu_du_tru == phieu_nhap.ma_phieu_du_tru)
        .all()
    )
    if not du_tru_cts:
        return True
    du_tru_map = {ct.ma_thuoc_vtyt: ct.so_luong for ct in du_tru_cts}
    nhap_map = {
        ct.ma_thuoc_vtyt: ct.so_luong
        for ct in nhap_cts
    }
    for ma, sl_dt in du_tru_map.items():
        if nhap_map.get(ma, 0) != sl_dt:
            return True
    for ma in nhap_map:
        if ma not in du_tru_map:
            return True
    return False


@pre_router.get(
    "/danh-sach",
    dependencies=[Depends(require_permissions("phieu_nhap_kho:read"))],
)
def get_danh_sach_phieu_nhap(
    db: Session = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    trang_thai: str = Query(default="chua_nhap"),
    nam: int | None = Query(default=None),
    thang: int | None = Query(default=None, ge=1, le=12),
):
    if trang_thai == "chua_nhap":
        query = db.query(PhieuDuTru).filter(PhieuDuTru.trang_thai == "da_duyet")
        if nam:
            query = query.filter(func.extract("year", PhieuDuTru.ngay_lap_phieu) == nam)
        if thang:
            query = query.filter(func.extract("month", PhieuDuTru.ngay_lap_phieu) == thang)
        total = query.count()
        rows = (
            query.order_by(PhieuDuTru.ngay_lap_phieu.desc().nullslast(), PhieuDuTru.ma_phieu_du_tru.desc())
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
            result.append({
                "ma_phieu_nhap": None,
                "ma_phieu_du_tru": r.ma_phieu_du_tru,
                "ngay_nhap": str(r.ngay_lap_phieu) if r.ngay_lap_phieu else None,
                "nguoi_nhap": r.nguoi_lap,
                "nguoi_nhap_ho_ten": users.get(r.nguoi_lap, r.nguoi_lap or ""),
                "trang_thai": "da_duyet",
            })
        return {"data": result, "total": total}
    else:
        query = db.query(PhieuNhapKho)
        if nam:
            query = query.filter(func.extract("year", PhieuNhapKho.ngay_nhap) == nam)
        if thang:
            query = query.filter(func.extract("month", PhieuNhapKho.ngay_nhap) == thang)
        total = query.count()
        rows = (
            query.order_by(PhieuNhapKho.ngay_nhap.desc().nullslast(), PhieuNhapKho.ma_phieu_nhap.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

        user_ids = {r.nguoi_nhap for r in rows if r.nguoi_nhap}
        users = {}
        if user_ids:
            for u in db.query(NguoiDung).filter(NguoiDung.id.in_(user_ids)).all():
                users[u.id] = u.ho_ten

        pdt_ids = {r.ma_phieu_du_tru for r in rows if r.ma_phieu_du_tru}
        pnk_ids = {r.ma_phieu_nhap for r in rows if r.ma_phieu_nhap}

        pdt_cts_map = {}
        if pdt_ids:
            for ct in db.query(ChiTietDuTru).filter(ChiTietDuTru.ma_phieu_du_tru.in_(pdt_ids)).all():
                pdt_cts_map.setdefault(ct.ma_phieu_du_tru, {})[ct.ma_thuoc_vtyt] = ct.so_luong

        pnk_cts_map = {}
        if pnk_ids:
            for ct in db.query(ChiTietPhieuNhapKho).filter(ChiTietPhieuNhapKho.ma_phieu_nhap.in_(pnk_ids)).all():
                pnk_cts_map.setdefault(ct.ma_phieu_nhap, {})[ct.ma_thuoc_vtyt] = ct.so_luong

        result = []
        for r in rows:
            cho_phep_sua = True
            if r.ma_phieu_du_tru:
                du_tru_map = pdt_cts_map.get(r.ma_phieu_du_tru, {})
                nhap_map = pnk_cts_map.get(r.ma_phieu_nhap, {})
                if not du_tru_map:
                    cho_phep_sua = True
                else:
                    is_diff = False
                    for ma, sl_dt in du_tru_map.items():
                        if nhap_map.get(ma, 0) != sl_dt:
                            is_diff = True
                            break
                    if not is_diff:
                        for ma in nhap_map:
                            if ma not in du_tru_map:
                                is_diff = True
                                break
                    cho_phep_sua = is_diff

            result.append({
                "ma_phieu_nhap": r.ma_phieu_nhap,
                "ma_phieu_du_tru": r.ma_phieu_du_tru,
                "ngay_nhap": str(r.ngay_nhap) if r.ngay_nhap else None,
                "nguoi_nhap": r.nguoi_nhap,
                "nguoi_nhap_ho_ten": users.get(r.nguoi_nhap, r.nguoi_nhap or ""),
                "trang_thai": "da_nhap",
                "cho_phep_sua": cho_phep_sua,
            })
        return {"data": result, "total": total}


@pre_router.get(
    "/thong-ke",
    dependencies=[Depends(require_permissions("phieu_nhap_kho:read"))],
)
def thong_ke_phieu_nhap(
    db: Session = Depends(get_db),
    nam: int | None = Query(default=None),
    thang: int | None = Query(default=None, ge=1, le=12),
):
    query_pdt = db.query(PhieuDuTru).filter(PhieuDuTru.trang_thai == "da_duyet")
    if nam:
        query_pdt = query_pdt.filter(func.extract("year", PhieuDuTru.ngay_lap_phieu) == nam)
    if thang:
        query_pdt = query_pdt.filter(func.extract("month", PhieuDuTru.ngay_lap_phieu) == thang)
    cho_nhap = query_pdt.count()

    query_pnk = db.query(PhieuNhapKho)
    if nam:
        query_pnk = query_pnk.filter(func.extract("year", PhieuNhapKho.ngay_nhap) == nam)
    if thang:
        query_pnk = query_pnk.filter(func.extract("month", PhieuNhapKho.ngay_nhap) == thang)
    da_nhap = query_pnk.count()

    return {
        "tong": cho_nhap + da_nhap,
        "cho_nhap": cho_nhap,
        "da_nhap": da_nhap,
    }


@pre_router.get(
    "/detail/{phieu_id}",
    dependencies=[Depends(require_permissions("phieu_nhap_kho:read"))],
)
def get_phieu_nhap_detail(phieu_id: str, db: Session = Depends(get_db)):
    phieu_nhap = db.query(PhieuNhapKho).filter(PhieuNhapKho.ma_phieu_nhap == phieu_id).first()
    if not phieu_nhap:
        phieu_nhap = db.query(PhieuNhapKho).filter(PhieuNhapKho.ma_phieu_du_tru == phieu_id).first()

    if not phieu_nhap:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy phiếu nhập kho")

    nguoi_nhap_ho_ten = ""
    if phieu_nhap.nguoi_nhap:
        user = db.get(NguoiDung, phieu_nhap.nguoi_nhap)
        if user:
            nguoi_nhap_ho_ten = user.ho_ten

    chi_tiets = (
        db.query(ChiTietPhieuNhapKho, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh)
        .outerjoin(ThuocVtyt, ChiTietPhieuNhapKho.ma_thuoc_vtyt == ThuocVtyt.ma_thuoc_vtyt)
        .filter(ChiTietPhieuNhapKho.ma_phieu_nhap == phieu_nhap.ma_phieu_nhap)
        .all()
    )

    cho_phep_sua = _get_cho_phep_sua(db, phieu_nhap, [ct for ct, _, _ in chi_tiets])

    return {
        "ma_phieu_nhap": phieu_nhap.ma_phieu_nhap,
        "ma_phieu_du_tru": phieu_nhap.ma_phieu_du_tru,
        "ngay_nhap": str(phieu_nhap.ngay_nhap) if phieu_nhap.ngay_nhap else None,
        "nguoi_nhap": phieu_nhap.nguoi_nhap,
        "nguoi_nhap_ho_ten": nguoi_nhap_ho_ten,
        "ghi_chu": phieu_nhap.ghi_chu,
        "cho_phep_sua": cho_phep_sua,
        "chi_tiets": [
            {
                "ma_thuoc_vtyt": ct.ma_thuoc_vtyt,
                "ten_thuoc_vtyt": ten_thuoc or "",
                "don_vi_tinh": don_vi or "",
                "so_luong": ct.so_luong,
                "so_lo": ct.so_lo or "",
                "han_su_dung": str(ct.han_su_dung) if ct.han_su_dung else None,
                "don_gia": float(ct.don_gia) if ct.don_gia is not None else None,
            }
            for ct, ten_thuoc, don_vi in chi_tiets
        ],
    }


@pre_router.get(
    "/by-phieu-du-tru/{ma_phieu_du_tru}",
    dependencies=[Depends(require_permissions("phieu_nhap_kho:read"))],
)
def get_phieu_nhap_by_phieu_du_tru(ma_phieu_du_tru: str, db: Session = Depends(get_db)):
    return get_phieu_nhap_detail(ma_phieu_du_tru, db)


@pre_router.post(
    "/tao",
    dependencies=[Depends(require_permissions("phieu_nhap_kho:create"))],
)
def tao_phieu_nhap(
    body: TaoPhieuNhapRequest,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user),
):
    if not body.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phải có ít nhất một thuốc/VTYT",
        )

    if body.ma_phieu_du_tru:
        pdt = db.get(PhieuDuTru, body.ma_phieu_du_tru)
        if not pdt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Phiếu dự trù không tồn tại",
            )
        if pdt.trang_thai != "da_duyet":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Phiếu dự trù không ở trạng thái chờ nhập kho (hiện tại: {pdt.trang_thai})",
            )

    phieu_nhap = PhieuNhapKho(
        ma_phieu_du_tru=body.ma_phieu_du_tru,
        ngay_nhap=body.ngay_nhap,
        nguoi_nhap=current_user.id,
        ghi_chu=body.ghi_chu,
    )
    db.add(phieu_nhap)
    db.flush()

    for item in body.items:
        db.add(
            ChiTietPhieuNhapKho(
                ma_phieu_nhap=phieu_nhap.ma_phieu_nhap,
                ma_thuoc_vtyt=item.ma_thuoc_vtyt,
                so_luong=item.so_luong,
                so_lo=item.so_lo,
                han_su_dung=item.han_su_dung,
                don_gia=item.don_gia,
            )
        )

    try:
        InventoryService.import_stock(db, phieu_nhap.ma_phieu_nhap)
    except CRUDError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return phieu_nhap


@pre_router.put(
    "/{ma_phieu_nhap}/cap-nhat",
    dependencies=[Depends(require_permissions("phieu_nhap_kho:update"))],
)
def cap_nhat_phieu_nhap(
    ma_phieu_nhap: str,
    body: CapNhatPhieuNhapRequest,
    db: Session = Depends(get_db),
):
    if not body.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phải có ít nhất một thuốc/VTYT",
        )
    phieu_nhap = db.get(PhieuNhapKho, ma_phieu_nhap)
    if not phieu_nhap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy phiếu nhập kho",
        )
    if not _get_cho_phep_sua(db, phieu_nhap):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phiếu nhập kho đã nhập đủ theo phiếu dự trù, không thể sửa.",
        )
    try:
        res = InventoryService.update_import_stock(
            db,
            ma_phieu_nhap,
            body.items,
            ngay_nhap=body.ngay_nhap,
            ghi_chu=body.ghi_chu,
        )
        return res
    except CRUDError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


router = create_crud_router(
    resource="phieu_nhap_kho",
    crud=phieu_nhap_kho_crud,
    pre_router=pre_router,
    read_permission="phieu_nhap_kho:read",
    create_permission="phieu_nhap_kho:create",
    update_permission="phieu_nhap_kho:update",
    delete_permission="phieu_nhap_kho:delete",
)
