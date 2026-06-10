from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.don_vi import DonVi
from app.database.quan_nhan import QuanNhan
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.database.lich_kham_sk_nam_chi_tiet import LichKhamSkNamChiTiet
from app.database.session import get_db
from app.core.dependencies import require_permissions

router = APIRouter(prefix="/thong-ke", tags=["thong-ke"])


@router.get("/don-vi", dependencies=[Depends(require_permissions("don_vi:read"))])
def thong_ke_don_vi(
    db: Session = Depends(get_db),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
):
    results = (
        db.query(
            DonVi.ma_don_vi,
            DonVi.ten_don_vi,
            func.count(QuanNhan.ma_quan_nhan).label("quan_so"),
        )
        .outerjoin(QuanNhan, DonVi.ma_don_vi == QuanNhan.ma_don_vi)
        .group_by(DonVi.ma_don_vi, DonVi.ten_don_vi)
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [
        {
            "ma_don_vi": r.ma_don_vi,
            "ten_don_vi": r.ten_don_vi,
            "quan_so": r.quan_so,
        }
        for r in results
    ]


@router.get("/lich-kham/{ma_lich_kham}", dependencies=[Depends(require_permissions("lich_kham_sk_nam:read"))])
def thong_ke_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
):
    # Get details from chi_tiet table
    chi_tiet_list = (
        db.query(LichKhamSkNamChiTiet)
        .filter(LichKhamSkNamChiTiet.ma_lich_kham == ma_lich_kham)
        .all()
    )

    from fastapi import HTTPException
    if not chi_tiet_list:
        # Fallback: if no details, use all units
        units = db.query(DonVi).all()
    else:
        unit_codes = [ct.ma_don_vi for ct in chi_tiet_list]
        units = db.query(DonVi).filter(DonVi.ma_don_vi.in_(unit_codes)).all()

    danh_sach_don_vi = []
    tong_quan_so = 0
    tong_da_kham = 0
    tong_dang_kham = 0
    tong_con_lai = 0

    for unit in units:
        quan_so = (
            db.query(func.count(QuanNhan.ma_quan_nhan))
            .filter(QuanNhan.ma_don_vi == unit.ma_don_vi)
            .scalar()
        ) or 0

        da_kham = (
            db.query(func.count(PhieuKhamSucKhoe.ma_phieu_kham))
            .join(QuanNhan, PhieuKhamSucKhoe.ma_quan_nhan == QuanNhan.ma_quan_nhan)
            .filter(QuanNhan.ma_don_vi == unit.ma_don_vi)
            .filter(PhieuKhamSucKhoe.ket_luan.isnot(None))
            .scalar()
        ) or 0

        dang_kham = (
            db.query(func.count(PhieuKhamSucKhoe.ma_phieu_kham))
            .join(QuanNhan, PhieuKhamSucKhoe.ma_quan_nhan == QuanNhan.ma_quan_nhan)
            .filter(QuanNhan.ma_don_vi == unit.ma_don_vi)
            .filter(PhieuKhamSucKhoe.ket_luan.is_(None))
            .scalar()
        ) or 0

        con_lai = quan_so - da_kham - dang_kham
        if con_lai < 0:
            con_lai = 0

        # Find matching chi_tiet for location/date info
        ct = next((c for c in chi_tiet_list if c.ma_don_vi == unit.ma_don_vi), None)

        danh_sach_don_vi.append({
            "ma_dv": unit.ma_don_vi,
            "ten_dv": unit.ten_don_vi,
            "tong_so": quan_so,
            "da_kham": da_kham,
            "dang_kham": dang_kham,
            "con_lai": con_lai,
        })

        tong_quan_so += quan_so
        tong_da_kham += da_kham
        tong_dang_kham += dang_kham
        tong_con_lai += con_lai

    return {
        "ma_lich_kham": ma_lich_kham,
        "tong_quan_so": tong_quan_so,
        "da_kham": tong_da_kham,
        "dang_kham": tong_dang_kham,
        "con_lai": tong_con_lai,
        "danh_sach_don_vi": danh_sach_don_vi,
    }
