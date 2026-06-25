from fastapi import Depends, HTTPException, Query
from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.core.dependencies import require_permissions
from app.crud.benh_an import benh_an_crud
from app.database.benh_an import BenhAn
from app.database.benh_nhan_ra_vao import BenhNhanRaVao
from app.database.chi_tiet_phieu_cham_soc import ChiTietPhieuChamSoc
from app.database.don_vi import DonVi
from app.database.kham_benh import KhamBenh
from app.database.phieu_cham_soc import PhieuChamSoc
from app.database.quan_nhan import QuanNhan
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.routes.base import create_crud_router
from app.schemas.benh_an import BenhAnCreate
from app.services.medical_examination import MedicalExaminationService


router = create_crud_router(
    resource="benh_an",
    crud=benh_an_crud,
    read_permission="benh_an:read",
    create_permission="benh_an:create",
    update_permission="benh_an:update",
    delete_permission="benh_an:delete",
    enable_create=False,
)


@router.post(
    "",
    dependencies=[Depends(require_permissions("benh_an:create"))],
    status_code=201,
)
def create_benh_an(data: dict, db: Session = Depends(get_db)):
    ma_kham_benh = data.get("ma_kham_benh")
    if ma_kham_benh:
        service = MedicalExaminationService(db)
        try:
            ba = service.create_benh_an(ma_kham_benh, data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}
    payload = BenhAnCreate(**data)
    ba = benh_an_crud.create(db, payload)
    return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}


@router.get(
    "/noi-tru/danh-sach",
    dependencies=[Depends(require_permissions("benh_an:read"))],
)
def get_danh_sach_noi_tru(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    trang_thai: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    base_query = (
        db.query(BenhAn, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu, QuanNhan.ngay_sinh, QuanNhan.ma_don_vi, DonVi.ten_don_vi)
        .join(QuanNhan, BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
        .order_by(BenhAn.ma_benh_an.desc())
    )
    if trang_thai:
        base_query = base_query.filter(BenhAn.trang_thai == trang_thai)
    total = base_query.count()
    records = base_query.offset(offset).limit(limit).all()
    result = []
    for ba, ho_ten, cap_bac, chuc_vu, ngay_sinh, ma_don_vi, ten_don_vi in records:
        d = {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}
        d["ho_ten"] = ho_ten
        d["cap_bac"] = cap_bac
        d["chuc_vu"] = chuc_vu
        d["ngay_sinh"] = str(ngay_sinh) if ngay_sinh else None
        d["ma_don_vi"] = ma_don_vi
        d["ten_don_vi"] = ten_don_vi
        result.append(d)
    return {"data": result, "total": total}


@router.get(
    "/by-kham-benh/{ma_kham_benh}",
    dependencies=[Depends(require_permissions("benh_an:read"))],
)
def get_benh_an_by_kham_benh(ma_kham_benh: str, db: Session = Depends(get_db)):
    ba = db.query(BenhAn).filter(BenhAn.ma_kham_benh == ma_kham_benh).first()
    if not ba:
        return None
    return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}


@router.post(
    "/{id}/ra-vien",
    dependencies=[Depends(require_permissions("benh_an:update"))],
)
def ra_vien(id: str, data: dict, db: Session = Depends(get_db)):
    service = MedicalExaminationService(db)
    try:
        ba = service.discharge_patient(id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}


@router.get(
    "/{id}/phieu-cham-soc",
    dependencies=[Depends(require_permissions("benh_an:read"))],
)
def get_phieu_cham_soc_by_benh_an(id: str, db: Session = Depends(get_db)):
    records = (
        db.query(PhieuChamSoc)
        .filter(PhieuChamSoc.ma_benh_an == id)
        .order_by(PhieuChamSoc.thoi_gian.desc())
        .all()
    )
    result = []
    for pcs in records:
        d = {c.key: getattr(pcs, c.key) for c in inspect(PhieuChamSoc).columns}
        chi_tiet = (
            db.query(ChiTietPhieuChamSoc, ThuocVtyt.ten_thuoc_vtyt, ThuocVtyt.don_vi_tinh)
            .join(ThuocVtyt, ChiTietPhieuChamSoc.ma_thuoc_vtyt == ThuocVtyt.ma_thuoc_vtyt)
            .filter(ChiTietPhieuChamSoc.ma_phieu_cs == pcs.ma_phieu_cs)
            .all()
        )
        d["chi_tiet"] = [
            {
                "ma_thuoc_vtyt": ct.ma_thuoc_vtyt,
                "ten_thuoc_vtyt": ten,
                "don_vi_tinh": dvt,
                "so_luong": ct.so_luong,
            }
            for ct, ten, dvt in chi_tiet
        ]
        result.append(d)
    return {"data": result}
