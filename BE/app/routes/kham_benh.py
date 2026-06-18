from datetime import datetime

from fastapi import Depends, HTTPException
from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.crud.kham_benh import kham_benh_crud
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
    "/hom-nay/danh-sach",
    dependencies=[Depends(require_permissions("kham_benh:read"))],
    response_model=list[KhamBenhRead],
)
def get_kham_benh_hom_nay(db: Session = Depends(get_db)):
    today = datetime.now().date()
    records = (
        db.query(KhamBenh, QuanNhan.ho_ten, QuanNhan.ma_don_vi, DonVi.ten_don_vi)
        .join(QuanNhan, KhamBenh.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
        .filter(KhamBenh.ngay_kham >= today)
        .order_by(KhamBenh.ngay_kham.desc())
        .all()
    )
    result = []
    for kb, ho_ten, ma_don_vi, ten_don_vi in records:
        d = {c.key: getattr(kb, c.key) for c in inspect(KhamBenh).columns}
        d["ho_ten"] = ho_ten
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
def nhap_vien(id: str, data: dict, db: Session = Depends(get_db)):
    service = MedicalExaminationService(db)
    return service.admit_patient(id, data)


@router.post(
    "/{id}/hoan-tat",
    dependencies=[Depends(require_permissions("kham_benh:update"))],
    response_model=KhamBenhRead,
)
def hoan_tat_kham(id: str, data: dict, db: Session = Depends(get_db)):
    service = MedicalExaminationService(db)
    return service.complete_examination(id, data)
