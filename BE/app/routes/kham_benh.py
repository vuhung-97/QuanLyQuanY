from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, Query
from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.kham_benh import kham_benh_crud
from app.database.benh_an import BenhAn
from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.don_thuoc import DonThuoc
from app.database.don_vi import DonVi
from app.database.kham_benh import KhamBenh
from app.database.quan_nhan import QuanNhan
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.routes.base import create_crud_router
from app.schemas.kham_benh import KhamBenhRead
from app.services.medical_examination import MedicalExaminationService


router = create_crud_router(
    resource="kham_benh",
    crud=kham_benh_crud,
    read_permission="kham_benh:read",
    create_permission="kham_benh:create",
    update_permission="kham_benh:update",
    delete_permission="kham_benh:delete",
)


@router.get(
    "/all/danh-sach",
    dependencies=[Depends(require_permissions("kham_benh:read"))],
)
def get_kham_benh_all(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    base_query = (
        db.query(KhamBenh, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu, QuanNhan.ngay_sinh, QuanNhan.ma_don_vi, DonVi.ten_don_vi)
        .join(QuanNhan, KhamBenh.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
        .order_by(KhamBenh.ngay_kham.desc())
    )
    total = base_query.count()
    records = base_query.offset(offset).limit(limit).all()
    result = []
    for kb, ho_ten, cap_bac, chuc_vu, ngay_sinh, ma_don_vi, ten_don_vi in records:
        d = {c.key: getattr(kb, c.key) for c in inspect(KhamBenh).columns}
        d["ho_ten"] = ho_ten
        d["cap_bac"] = cap_bac
        d["chuc_vu"] = chuc_vu
        d["ngay_sinh"] = str(ngay_sinh) if ngay_sinh else None
        d["ma_don_vi"] = ma_don_vi
        d["ten_don_vi"] = ten_don_vi
        d["trang_thai"] = d["trang_thai"] or "chờ"
        result.append(d)
    return {"data": result, "total": total}


@router.get(
    "/hom-nay/danh-sach",
    dependencies=[Depends(require_permissions("kham_benh:read"))],
    response_model=list[KhamBenhRead],
)
def get_kham_benh_hom_nay(
    ngay: str | None = Query(default=None, description="YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    ngay_date = (
        datetime.strptime(ngay, "%Y-%m-%d").date()
        if ngay else datetime.now().date()
    )
    ngay_sau = ngay_date + timedelta(days=1)
    records = (
        db.query(KhamBenh, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu, QuanNhan.ngay_sinh, QuanNhan.ma_don_vi, DonVi.ten_don_vi)
        .join(QuanNhan, KhamBenh.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
        .filter(KhamBenh.ngay_kham >= ngay_date, KhamBenh.ngay_kham < ngay_sau)
        .order_by(KhamBenh.ngay_kham.desc())
        .all()
    )
    result = []
    for kb, ho_ten, cap_bac, chuc_vu, ngay_sinh, ma_don_vi, ten_don_vi in records:
        d = {c.key: getattr(kb, c.key) for c in inspect(KhamBenh).columns}
        d["ho_ten"] = ho_ten
        d["cap_bac"] = cap_bac
        d["chuc_vu"] = chuc_vu
        d["ngay_sinh"] = str(ngay_sinh) if ngay_sinh else None
        d["ma_don_vi"] = ma_don_vi
        d["ten_don_vi"] = ten_don_vi
        d["trang_thai"] = d["trang_thai"] or "chờ"
        result.append(d)
    return result


@router.get(
    "/{id}/detail",
    dependencies=[Depends(require_permissions("kham_benh:read"))],
)
def get_kham_benh_detail(id: str, db: Session = Depends(get_db)):
    kb = db.query(KhamBenh).filter(KhamBenh.ma_kham_benh == id).first()
    if not kb:
        raise HTTPException(status_code=404, detail="KhamBenh not found")

    don_thuoc_list = (
        db.query(DonThuoc)
        .filter(DonThuoc.ma_kham_benh == id)
        .all()
    )

    result = {c.key: getattr(kb, c.key) for c in inspect(KhamBenh).columns}

    prescriptions = []
    for dt in don_thuoc_list:
        chi_tiet = (
            db.query(ChiTietDonThuoc, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh)
            .join(ThuocVtyt, ChiTietDonThuoc.ma_thuoc_vtyt == ThuocVtyt.ma_thuoc_vtyt)
            .filter(ChiTietDonThuoc.ma_don_thuoc == dt.ma_don_thuoc)
            .all()
        )
        items = []
        for ctdt, ten_thuoc, don_vi in chi_tiet:
            items.append({
                "ma_thuoc_vtyt": ctdt.ma_thuoc_vtyt,
                "ten_thuoc_vtyt": ten_thuoc,
                "don_vi_tinh": don_vi,
                "so_luong": ctdt.so_luong,
                "huong_dieu_tri": ctdt.huong_dieu_tri,
            })
        prescriptions.append({
            "ma_don_thuoc": dt.ma_don_thuoc,
            "chi_tiet_don_thuoc": items,
        })

    result["don_thuoc"] = prescriptions
    return result


@router.post(
    "/{id}/nhan-thuoc",
    dependencies=[Depends(require_permissions("kham_benh:update"))],
    response_model=KhamBenhRead,
)
def nhan_thuoc(id: str, db: Session = Depends(get_db)):
    service = MedicalExaminationService(db)
    return service.receive_medicine(id)


@router.post(
    "/{id}/chuyen-tuyen",
    dependencies=[Depends(require_permissions("kham_benh:update"))],
)
def chuyen_tuyen(id: str, data: dict, db: Session = Depends(get_db)):
    service = MedicalExaminationService(db)
    return service.refer_patient(id, data)


@router.post(
    "/{id}/nhap-vien",
    dependencies=[Depends(require_permissions("kham_benh:update"))],
)
def nhap_vien(id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = MedicalExaminationService(db)
    return service.admit_patient(id, nguoi_dung_id=current_user.id)


@router.post(
    "/{id}/hoan-tat",
    dependencies=[Depends(require_permissions("kham_benh:update"))],
    response_model=KhamBenhRead,
)
def hoan_tat_kham(id: str, data: dict, db: Session = Depends(get_db)):
    service = MedicalExaminationService(db)
    return service.complete_examination(id, data)


@router.get(
    "/nhap-vien/danh-sach",
    dependencies=[Depends(require_permissions("kham_benh:read"))],
)
def get_danh_sach_nhap_vien(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    base_query = (
        db.query(KhamBenh, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu, QuanNhan.ngay_sinh, QuanNhan.gioi_tinh, QuanNhan.nghe_nghiep, QuanNhan.so_dien_thoai, QuanNhan.so_the_bhyt, QuanNhan.ma_don_vi, DonVi.ten_don_vi)
        .join(QuanNhan, KhamBenh.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
        .outerjoin(BenhAn, KhamBenh.ma_kham_benh == BenhAn.ma_kham_benh)
        .filter(KhamBenh.trang_thai == "nhập_viện", BenhAn.ma_kham_benh.is_(None))
        .order_by(KhamBenh.ngay_kham.desc())
    )
    total = base_query.count()
    records = base_query.offset(offset).limit(limit).all()
    result = []
    for kb, ho_ten, cap_bac, chuc_vu, ngay_sinh, gioi_tinh, nghe_nghiep, so_dien_thoai, so_the_bhyt, ma_don_vi, ten_don_vi in records:
        d = {c.key: getattr(kb, c.key) for c in inspect(KhamBenh).columns}
        d["ho_ten"] = ho_ten
        d["cap_bac"] = cap_bac
        d["chuc_vu"] = chuc_vu
        d["ngay_sinh"] = str(ngay_sinh) if ngay_sinh else None
        d["gioi_tinh"] = gioi_tinh
        d["nghe_nghiep"] = nghe_nghiep
        d["so_dien_thoai"] = so_dien_thoai
        d["so_the_bhyt"] = so_the_bhyt
        d["ma_don_vi"] = ma_don_vi
        d["ten_don_vi"] = ten_don_vi
        result.append(d)
    return {"data": result, "total": total}
