from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.don_vi import DonVi
from app.database.phieu_du_tru import PhieuDuTru
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.lich_kham_sk_nam_chi_tiet import LichKhamSkNamChiTiet
from app.database.quan_nhan import QuanNhan
from app.database.session import get_db
from app.core.dependencies import require_permissions

router = APIRouter(prefix="/thong-ke", tags=["thong-ke"])


def _build_children_map(db: Session) -> dict[str, list[str]]:
    all_units = db.query(DonVi.ma_don_vi, DonVi.ma_don_vi_truc_thuoc).all()
    children_map: dict[str, list[str]] = {}
    for u in all_units:
        if u.ma_don_vi_truc_thuoc:
            children_map.setdefault(u.ma_don_vi_truc_thuoc, []).append(u.ma_don_vi)
    return children_map


def _get_descendants(ma: str, children_map: dict[str, list[str]]) -> list[str]:
    codes = [ma]
    for child in children_map.get(ma, []):
        codes.extend(_get_descendants(child, children_map))
    return codes


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
            DonVi.ma_don_vi_truc_thuoc,
            func.count(QuanNhan.ma_quan_nhan).label("quan_so"),
        )
        .outerjoin(QuanNhan, DonVi.ma_don_vi == QuanNhan.ma_don_vi)
        .group_by(DonVi.ma_don_vi, DonVi.ten_don_vi, DonVi.ma_don_vi_truc_thuoc)
        .offset(offset)
        .limit(limit)
        .all()
    )

    children_map = _build_children_map(db)

    raw_map = {}
    for r in results:
        raw_map[r.ma_don_vi] = r.quan_so or 0

    def _calc_tong(ma: str) -> int:
        total = raw_map.get(ma, 0)
        for child in children_map.get(ma, []):
            total += _calc_tong(child)
        return total

    return [
        {
            "ma_don_vi": r.ma_don_vi,
            "ten_don_vi": r.ten_don_vi,
            "ma_don_vi_truc_thuoc": r.ma_don_vi_truc_thuoc,
            "quan_so": r.quan_so,
            "tong_quan_so": _calc_tong(r.ma_don_vi),
        }
        for r in results
    ]


@router.get("/lich-kham/{ma_lich_kham}", dependencies=[Depends(require_permissions("lich_kham_sk_nam:read"))])
def thong_ke_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
):
    chi_tiet_list = (
        db.query(LichKhamSkNamChiTiet)
        .filter(LichKhamSkNamChiTiet.ma_lich_kham == ma_lich_kham)
        .all()
    )

    from fastapi import HTTPException
    if not chi_tiet_list:
        units = db.query(DonVi).all()
    else:
        unit_codes = [ct.ma_don_vi for ct in chi_tiet_list]
        units = db.query(DonVi).filter(DonVi.ma_don_vi.in_(unit_codes)).all()

    children_map = _build_children_map(db)

    danh_sach_don_vi = []
    tong_quan_so = 0
    tong_da_kham = 0
    tong_dang_kham = 0
    tong_da_lay_mau = 0
    tong_con_lai = 0

    for unit in units:
        unit_codes = _get_descendants(unit.ma_don_vi, children_map)

        quan_so = (
            db.query(func.count(QuanNhan.ma_quan_nhan))
            .filter(QuanNhan.ma_don_vi.in_(unit_codes))
            .scalar()
        ) or 0

        base = (
            db.query(func.count(PhieuKhamSucKhoe.ma_phieu_kham))
            .join(QuanNhan, PhieuKhamSucKhoe.ma_quan_nhan == QuanNhan.ma_quan_nhan)
            .filter(QuanNhan.ma_don_vi.in_(unit_codes))
            .filter(PhieuKhamSucKhoe.ma_lich_kham == ma_lich_kham)
        )
        da_kham = base.filter(PhieuKhamSucKhoe.trang_thai == "da_kham").scalar() or 0
        dang_kham = base.filter(PhieuKhamSucKhoe.trang_thai == "dang_kham").scalar() or 0
        da_lay_mau = (
            base.filter(
                PhieuKhamSucKhoe.trang_thai.in_(
                    ["da_lay_mau", "dang_kham", "da_kham"]
                )
            ).scalar()
            or 0
        )

        con_lai = quan_so - da_kham - dang_kham
        if con_lai < 0:
            con_lai = 0

        ct = next((c for c in chi_tiet_list if c.ma_don_vi == unit.ma_don_vi), None)

        danh_sach_don_vi.append({
            "ma_don_vi": unit.ma_don_vi,
            "ten_don_vi": unit.ten_don_vi,
            "tong_quan_so": quan_so,
            "da_kham": da_kham,
            "dang_kham": dang_kham,
            "da_lay_mau": da_lay_mau,
            "con_lai": con_lai,
        })

        tong_quan_so += quan_so
        tong_da_kham += da_kham
        tong_dang_kham += dang_kham
        tong_da_lay_mau += da_lay_mau
        tong_con_lai += con_lai

    return {
        "ma_lich_kham": ma_lich_kham,
        "tong_quan_so": tong_quan_so,
        "da_kham": tong_da_kham,
        "dang_kham": tong_dang_kham,
        "da_lay_mau": tong_da_lay_mau,
        "con_lai": tong_con_lai,
        "danh_sach_don_vi": danh_sach_don_vi,
    }


@router.get("/phieu-du-tru", dependencies=[Depends(require_permissions("phieu_du_tru:read"))])
def thong_ke_phieu_du_tru(
    db: Session = Depends(get_db),
    nam: int | None = Query(default=None),
    thang: int | None = Query(default=None, ge=1, le=12),
):
    query = db.query(PhieuDuTru)
    if nam:
        query = query.filter(func.extract("year", PhieuDuTru.ngay_lap_phieu) == nam)
    if thang:
        query = query.filter(func.extract("month", PhieuDuTru.ngay_lap_phieu) == thang)

    tong = query.count()
    cho_gui = query.filter(PhieuDuTru.trang_thai == "cho_gui").count()
    chua_duyet = query.filter(PhieuDuTru.trang_thai == "chua_duyet").count()
    da_duyet = query.filter(PhieuDuTru.trang_thai == "da_duyet").count()
    tu_choi = query.filter(PhieuDuTru.trang_thai == "tu_choi").count()
    da_nhap = query.filter(PhieuDuTru.trang_thai == "da_nhap").count()

    return {
        "tong": tong,
        "cho_gui": cho_gui,
        "chua_duyet": chua_duyet,
        "da_duyet": da_duyet,
        "tu_choi": tu_choi,
        "da_nhap": da_nhap,
    }


@router.get("/phieu-xuat", dependencies=[Depends(require_permissions("phieu_xuat_kho:read"))])
def thong_ke_phieu_xuat(
    db: Session = Depends(get_db),
    nam: int | None = Query(default=None),
    thang: int | None = Query(default=None, ge=1, le=12),
):
    query = db.query(PhieuXuatKho)
    if nam:
        query = query.filter(func.extract("year", PhieuXuatKho.ngay_thang_nam) == nam)
    if thang:
        query = query.filter(func.extract("month", PhieuXuatKho.ngay_thang_nam) == thang)

    tong = query.count()
    cho_gui = query.filter(PhieuXuatKho.trang_thai == "cho_gui").count()
    cho_duyet = query.filter(PhieuXuatKho.trang_thai == "cho_duyet").count()
    da_duyet = query.filter(PhieuXuatKho.trang_thai == "da_duyet").count()
    tu_choi = query.filter(PhieuXuatKho.trang_thai == "tu_choi").count()
    da_xuat = query.filter(PhieuXuatKho.trang_thai == "da_xuat").count()

    return {
        "tong": tong,
        "cho_gui": cho_gui,
        "cho_duyet": cho_duyet,
        "da_duyet": da_duyet,
        "tu_choi": tu_choi,
        "da_xuat": da_xuat,
    }
