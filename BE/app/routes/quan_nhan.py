from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.crud.quan_nhan import quan_nhan_crud
from app.database.benh_an import BenhAn
from app.database.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTri
from app.database.don_thuoc import DonThuoc
from app.database.don_vi import DonVi
from app.database.giay_gioi_thieu import GiayGioiThieu
from app.database.kham_benh import KhamBenh
from app.database.lich_kham_sk_nam_chi_tiet import LichKhamSkNamChiTiet
from app.database.quan_nhan import QuanNhan
from app.database.session import get_db
from app.routes.base import create_crud_router
from app.schemas.lich_su_kham import LichSuKhamRead
from app.schemas.quan_nhan import QuanNhanRead
from app.core.dependencies import require_permissions


pre_router = APIRouter()


@pre_router.get(
    "/list",
    dependencies=[Depends(require_permissions("quan_nhan:read"))],
)
def get_quan_nhan_danh_sach(
    db: Session = Depends(get_db),
    limit: int = Query(default=50, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    search: str | None = Query(default=None),
    ma_don_vi: str | None = Query(default=None),
    show_all: bool = Query(
        default=False,
        description="Include hospitalized/transferred soldiers",
    ),
):
    query = db.query(QuanNhan)

    if not show_all:
        hosp_exists = (
            db.query(BenhAn)
            .filter(
                BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan,
                BenhAn.trang_thai == "đang_điều_trị",
            )
            .exists()
        )
        transfer_exists = (
            db.query(DiTuyenSauDieuTri)
            .filter(
                DiTuyenSauDieuTri.ma_quan_nhan == QuanNhan.ma_quan_nhan,
                DiTuyenSauDieuTri.ngay_ve.is_(None),
            )
            .exists()
        )
        query = query.filter(~hosp_exists, ~transfer_exists)

    if search:
        q = f"%{search}%"
        query = query.filter(QuanNhan.ho_ten.ilike(q) | QuanNhan.ma_quan_nhan.ilike(q))
    if ma_don_vi:
        query = query.filter(QuanNhan.ma_don_vi == ma_don_vi)
    total = query.count()
    rows = (
        query.order_by(QuanNhan.ma_don_vi, QuanNhan.ho_ten)
        .offset(offset)
        .limit(limit)
        .all()
    )

    if not show_all:
        return {"data": rows, "total": total}

    active_benh_an = {
        r[0]
        for r in db.query(BenhAn.ma_quan_nhan)
        .filter(BenhAn.trang_thai == "đang_điều_trị")
        .all()
    }
    active_transfer = {
        r[0]
        for r in db.query(DiTuyenSauDieuTri.ma_quan_nhan)
        .filter(DiTuyenSauDieuTri.ngay_ve.is_(None))
        .all()
    }

    result = []
    for qn in rows:
        d = {c.name: getattr(qn, c.name) for c in qn.__table__.columns}
        d["is_dang_dieu_tri"] = qn.ma_quan_nhan in active_benh_an
        d["is_da_chuyen_tuyen"] = qn.ma_quan_nhan in active_transfer
        result.append(d)
    return {"data": result, "total": total}


@pre_router.get(
    "/don-vi/{ma_don_vi}",
    dependencies=[Depends(require_permissions("quan_nhan:read"))],
    response_model=list[QuanNhanRead],
)
def get_quan_nhan_by_don_vi(
    ma_don_vi: str,
    db: Session = Depends(get_db),
):
    all_units = db.query(DonVi.ma_don_vi, DonVi.ma_don_vi_truc_thuoc).all()
    children_map: dict[str, list[str]] = {}
    for u in all_units:
        if u.ma_don_vi_truc_thuoc:
            children_map.setdefault(u.ma_don_vi_truc_thuoc, []).append(u.ma_don_vi)

    def get_descendants(ma: str) -> list[str]:
        codes = [ma]
        for child in children_map.get(ma, []):
            codes.extend(get_descendants(child))
        return codes

    unit_codes = get_descendants(ma_don_vi)
    return db.query(QuanNhan).filter(QuanNhan.ma_don_vi.in_(unit_codes)).all()


@pre_router.get(
    "/lich-kham/{ma_lich_kham}",
    dependencies=[Depends(require_permissions("quan_nhan:read"))],
    response_model=list[QuanNhanRead],
)
def get_quan_nhan_by_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
):
    chi_tiet_list = (
        db.query(LichKhamSkNamChiTiet)
        .filter(LichKhamSkNamChiTiet.ma_lich_kham == ma_lich_kham)
        .all()
    )
    if not chi_tiet_list:
        return []

    all_units = db.query(DonVi.ma_don_vi, DonVi.ma_don_vi_truc_thuoc).all()
    children_map: dict[str, list[str]] = {}
    for u in all_units:
        if u.ma_don_vi_truc_thuoc:
            children_map.setdefault(u.ma_don_vi_truc_thuoc, []).append(u.ma_don_vi)

    def get_descendants(ma: str) -> list[str]:
        codes = [ma]
        for child in children_map.get(ma, []):
            codes.extend(get_descendants(child))
        return codes

    all_codes: set[str] = set()
    for ct in chi_tiet_list:
        all_codes.update(get_descendants(ct.ma_don_vi))

    return (
        db.query(QuanNhan)
        .filter(QuanNhan.ma_don_vi.in_(all_codes))
        .order_by(QuanNhan.ma_don_vi, QuanNhan.ho_ten)
        .all()
    )


@pre_router.get(
    "/{ma_quan_nhan}/lich-su-kham",
    dependencies=[Depends(require_permissions("quan_nhan:read"))],
    response_model=LichSuKhamRead,
)
def get_lich_su_kham(ma_quan_nhan: str, db: Session = Depends(get_db)):
    return LichSuKhamRead(
        kham_benh=db.query(KhamBenh)
        .filter(KhamBenh.ma_quan_nhan == ma_quan_nhan)
        .order_by(KhamBenh.ngay_kham.desc())
        .all(),
        don_thuoc=db.query(DonThuoc)
        .filter(DonThuoc.ma_quan_nhan == ma_quan_nhan)
        .all(),
        benh_an=db.query(BenhAn)
        .filter(BenhAn.ma_quan_nhan == ma_quan_nhan)
        .all(),
        chuyen_tuyen=db.query(GiayGioiThieu)
        .filter(GiayGioiThieu.ma_quan_nhan == ma_quan_nhan)
        .all(),
    )


@pre_router.get(
    "/{ma_quan_nhan}",
    dependencies=[Depends(require_permissions("quan_nhan:read"))],
    response_model=QuanNhanRead,
)
def get_quan_nhan_detail(ma_quan_nhan: str, db: Session = Depends(get_db)):
    qn = db.query(QuanNhan).filter(QuanNhan.ma_quan_nhan == ma_quan_nhan).first()
    if not qn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quân nhân không tồn tại")
    don_vi = db.query(DonVi).filter(DonVi.ma_don_vi == qn.ma_don_vi).first()
    data = {c.name: getattr(qn, c.name) for c in qn.__table__.columns}
    data["ten_don_vi"] = don_vi.ten_don_vi if don_vi else None
    data["is_dang_dieu_tri"] = False
    data["is_da_chuyen_tuyen"] = False
    return data


router = create_crud_router(
    resource="quan_nhan",
    crud=quan_nhan_crud,
    pre_router=pre_router,
    read_permission="quan_nhan:read",
    create_permission="quan_nhan:create",
    update_permission="quan_nhan:update",
    delete_permission="quan_nhan:delete",
)
