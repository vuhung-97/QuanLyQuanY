from fastapi import Depends, HTTPException, Query
from sqlalchemy import extract, inspect
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.benh_an import benh_an_crud
from app.database.benh_an import BenhAn
from app.database.chi_tiet_phieu_cham_soc import ChiTietPhieuChamSoc
from app.database.don_vi import DonVi
from app.database.kham_benh import KhamBenh
from app.database.nguoi_dung import NguoiDung
from app.database.phieu_cham_soc import PhieuChamSoc
from app.database.vai_tro import VaiTro
from app.database.quan_nhan import QuanNhan
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.routes.base import create_crud_router
from app.database.buong import Buong
from app.database.giuong import Giuong
from app.schemas.benh_an import BenhAnCreate, BenhAnReadDetail
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
def create_benh_an(data: dict, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    ma_kham_benh = data.get("ma_kham_benh")
    data["ma_nguoi_dung"] = current_user.id
    if ma_kham_benh:
        service = MedicalExaminationService(db)
        try:
            ba = service.create_benh_an(ma_kham_benh, data, nguoi_dung_id=current_user.id)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}
    payload = BenhAnCreate(**data)
    ba = benh_an_crud.create(db, payload, nguoi_dung_id=current_user.id)
    return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}


@router.get(
    "/noi-tru/danh-sach",
    dependencies=[Depends(require_permissions("benh_an:read"))],
)
def get_danh_sach_noi_tru(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    trang_thai: str | None = Query(default=None),
    nam: int | None = Query(default=None),
    thang: int | None = Query(default=None, ge=1, le=12),
    db: Session = Depends(get_db),
):
    base_query = (
        db.query(BenhAn, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu, QuanNhan.ngay_sinh, Buong.ten_buong, Giuong.ten_giuong)
        .join(QuanNhan, BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .join(Buong, BenhAn.ma_buong == Buong.ma_buong, isouter=True)
        .join(Giuong, BenhAn.ma_giuong == Giuong.ma_giuong, isouter=True)
        .order_by(Buong.ten_buong.asc().nullslast(), QuanNhan.ho_ten.asc(), BenhAn.ngay_nhap_vien.desc().nullslast())
    )
    if trang_thai:
        base_query = base_query.filter(BenhAn.trang_thai == trang_thai)
    if nam:
        base_query = base_query.filter(extract('year', BenhAn.ngay_nhap_vien) == nam)
    if thang:
        base_query = base_query.filter(extract('month', BenhAn.ngay_nhap_vien) == thang)
    total = base_query.count()
    records = base_query.offset(offset).limit(limit).all()
    result = []
    for ba, ho_ten, cap_bac, chuc_vu, ngay_sinh, ten_buong, ten_giuong in records:
        d = {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}
        d["ho_ten"] = ho_ten
        d["cap_bac"] = cap_bac
        d["chuc_vu"] = chuc_vu
        d["ngay_sinh"] = str(ngay_sinh) if ngay_sinh else None
        d["ten_buong"] = ten_buong
        d["ten_giuong"] = ten_giuong
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
def ra_vien(id: str, data: dict, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = MedicalExaminationService(db)
    try:
        ba = service.discharge_patient(id, data, nguoi_dung_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}


@router.get(
    "/{id}/chi-tiet",
    dependencies=[Depends(require_permissions("benh_an:read"))],
    response_model=BenhAnReadDetail,
)
def get_benh_an_chi_tiet(id: str, db: Session = Depends(get_db)):
    result = (
        db.query(
            BenhAn,
            QuanNhan.ho_ten,
            QuanNhan.cap_bac,
            QuanNhan.chuc_vu,
            QuanNhan.so_dien_thoai,
            QuanNhan.so_the_bhyt,
            QuanNhan.nghe_nghiep,
            DonVi.ten_don_vi,
            Buong.ten_buong,
            Giuong.ten_giuong,
        )
        .join(QuanNhan, BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan, isouter=True)
        .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
        .join(Buong, BenhAn.ma_buong == Buong.ma_buong, isouter=True)
        .join(Giuong, BenhAn.ma_giuong == Giuong.ma_giuong, isouter=True)
        .filter(BenhAn.ma_benh_an == id)
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh án.")
    ba, ho_ten, cap_bac, chuc_vu, so_dien_thoai, so_the_bhyt, nghe_nghiep, ten_don_vi, ten_buong, ten_giuong = result
    d = {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}
    d["ho_ten"] = ho_ten
    d["cap_bac"] = cap_bac
    d["chuc_vu"] = chuc_vu
    d["so_dien_thoai"] = so_dien_thoai
    d["so_the_bhyt"] = so_the_bhyt
    d["nghe_nghiep"] = nghe_nghiep
    d["ten_don_vi"] = ten_don_vi
    d["ten_buong"] = ten_buong
    d["ten_giuong"] = ten_giuong
    if ba.ma_nguoi_dung:
        nd = (
            db.query(NguoiDung.ho_ten, VaiTro.ten_vai_tro)
            .join(VaiTro, NguoiDung.id_vai_tro == VaiTro.id, isouter=True)
            .filter(NguoiDung.id == ba.ma_nguoi_dung)
            .first()
        )
        d["ten_nguoi_lap_ba"] = nd.ho_ten if nd else None
        d["vai_tro_nguoi_lap_ba"] = nd.ten_vai_tro if nd else None
    return d


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
        nd = (
            db.query(NguoiDung.ho_ten, VaiTro.ten_vai_tro)
            .join(VaiTro, NguoiDung.id_vai_tro == VaiTro.id, isouter=True)
            .filter(NguoiDung.id == pcs.ma_nguoi_dung)
            .first()
        )
        d["ten_nguoi_thuc_hien"] = nd.ho_ten if nd else None
        d["vai_tro_nguoi_thuc_hien"] = nd.ten_vai_tro if nd else None
        result.append(d)
    return {"data": result}
