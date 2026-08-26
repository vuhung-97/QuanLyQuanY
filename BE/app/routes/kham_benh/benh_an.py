from datetime import date, datetime, time

from fastapi import APIRouter, Depends, HTTPException, Query
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
from app.routes.base import _run_crud, create_crud_router
from app.database.buong import Buong
from app.database.dm_nhom_benh import DmNhomBenh
from app.database.giuong import Giuong
from app.schemas.benh_an import BenhAnCreate, BenhAnReadDetail, BenhAnUpdate, BenhAnCreateRequest, RaVienRequest
from app.services.medical_examination import MedicalExaminationService


pre_router = APIRouter()


@pre_router.post(
    "",
    dependencies=[Depends(require_permissions("benh_an:create"))],
    status_code=201,
)
def create_benh_an(data: BenhAnCreateRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    d = data.model_dump(exclude_unset=True)
    d["ma_nguoi_dung"] = current_user.id
    ma_kham_benh = d.get("ma_kham_benh")
    if ma_kham_benh:
        service = MedicalExaminationService(db)
        try:
            ba = service.create_benh_an(ma_kham_benh, d, nguoi_dung_id=current_user.id)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}
    payload = BenhAnCreate(**d)
    ba = benh_an_crud.create(db, payload, nguoi_dung_id=current_user.id)
    return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}


@pre_router.patch(
    "/{item_id}",
    dependencies=[Depends(require_permissions("benh_an:update"))],
)
def update_benh_an(
    item_id: str,
    payload: BenhAnUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    ba = benh_an_crud.get(db, item_id)
    old_buong = ba.ma_buong
    old_giuong = ba.ma_giuong

    result = _run_crud(lambda: benh_an_crud.update(db, item_id, payload, nguoi_dung_id=current_user.id))

    new_buong = payload.ma_buong
    new_giuong = payload.ma_giuong

    if new_buong and new_giuong and (new_buong != old_buong or new_giuong != old_giuong):
        if old_giuong:
            db.query(Giuong).filter(Giuong.ma_giuong == old_giuong).update({"trang_thai": "trống"})
        db.query(Giuong).filter(Giuong.ma_giuong == new_giuong).update({"trang_thai": "có người"})
        db.commit()

    return {c.key: getattr(result, c.key) for c in inspect(BenhAn).columns}


@pre_router.get(
    "/noi-tru",
    dependencies=[Depends(require_permissions("benh_an:read"))],
)
def get_danh_sach_noi_tru(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    trang_thai: str | None = Query(default=None),
    nam: int | None = Query(default=None),
    thang: int | None = Query(default=None, ge=1, le=12),
    ma_quan_nhan: str | None = Query(default=None, description="Mã quân nhân"),
    sap_xep: str | None = Query(default=None, description="Sắp xếp: ten, ngay_vao, ngay_ra, trang_thai"),
    db: Session = Depends(get_db),
):
    default_order = [Buong.ten_buong.asc().nullslast(), QuanNhan.ho_ten.asc(), BenhAn.ngay_nhap_vien.desc().nullslast()]
    sort_map = {
        "ten": [QuanNhan.ho_ten.asc()],
        "ngay_vao": [BenhAn.ngay_nhap_vien.desc().nullslast()],
        "ngay_ra": [BenhAn.ngay_nhap_vien.desc().nullslast()],
        "trang_thai": [BenhAn.trang_thai.asc(), QuanNhan.ho_ten.asc()],
    }
    order = sort_map.get(sap_xep, default_order)

    base_query = (
        db.query(BenhAn, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu, QuanNhan.ngay_sinh, Buong.ten_buong, Giuong.ten_giuong)
        .join(QuanNhan, BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .join(Buong, BenhAn.ma_buong == Buong.ma_buong, isouter=True)
        .join(Giuong, BenhAn.ma_giuong == Giuong.ma_giuong, isouter=True)
        .order_by(*order)
    )
    if trang_thai:
        base_query = base_query.filter(BenhAn.trang_thai == trang_thai)
    if nam:
        base_query = base_query.filter(extract('year', BenhAn.ngay_nhap_vien) == nam)
    if thang:
        base_query = base_query.filter(extract('month', BenhAn.ngay_nhap_vien) == thang)
    if ma_quan_nhan:
        base_query = base_query.filter(BenhAn.ma_quan_nhan == ma_quan_nhan)
    total = base_query.count()
    records = base_query.offset(offset).limit(limit).all()

    ma_benh_an_list = [ba.ma_benh_an for ba, *_ in records if ba.trang_thai == "đang_điều_trị"]
    cham_soc_hom_nay = set()
    if ma_benh_an_list:
        dau_ngay = datetime.combine(date.today(), time.min)
        rows = (
            db.query(PhieuChamSoc.ma_benh_an)
            .filter(
                PhieuChamSoc.ma_benh_an.in_(ma_benh_an_list),
                PhieuChamSoc.thoi_gian >= dau_ngay,
            )
            .all()
        )
        cham_soc_hom_nay = {ma for ma, in rows}

    result = []
    for ba, ho_ten, cap_bac, chuc_vu, ngay_sinh, ten_buong, ten_giuong in records:
        d = {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}
        d["ho_ten"] = ho_ten
        d["cap_bac"] = cap_bac
        d["chuc_vu"] = chuc_vu
        d["ngay_sinh"] = str(ngay_sinh) if ngay_sinh else None
        d["ten_buong"] = ten_buong
        d["ten_giuong"] = ten_giuong
        d["da_co_cham_soc_hom_nay"] = ba.ma_benh_an in cham_soc_hom_nay
        result.append(d)
    return {"data": result, "total": total}


@pre_router.get(
    "/kham-benh/{ma_kham_benh}",
    dependencies=[Depends(require_permissions("benh_an:read"))],
)
def get_benh_an_by_kham_benh(ma_kham_benh: str, db: Session = Depends(get_db)):
    ba = db.query(BenhAn).filter(BenhAn.ma_kham_benh == ma_kham_benh).first()
    if not ba:
        return None
    return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}


@pre_router.post(
    "/{id}/ra-vien",
    dependencies=[Depends(require_permissions("benh_an:update"))],
)
def ra_vien(id: str, data: RaVienRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = MedicalExaminationService(db)
    try:
        ba = service.discharge_patient(id, data.model_dump(exclude_unset=True), nguoi_dung_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}


@pre_router.get(
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
            QuanNhan.ngay_sinh,
            QuanNhan.gioi_tinh,
            DonVi.ten_don_vi,
            Buong.ten_buong,
            Giuong.ten_giuong,
            DmNhomBenh.ten_nhom,
            KhamBenh.trieu_chung,
        )
        .join(QuanNhan, BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan, isouter=True)
        .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
        .join(Buong, BenhAn.ma_buong == Buong.ma_buong, isouter=True)
        .join(Giuong, BenhAn.ma_giuong == Giuong.ma_giuong, isouter=True)
        .join(DmNhomBenh, BenhAn.ma_nhom_benh == DmNhomBenh.ma_nhom, isouter=True)
        .join(KhamBenh, BenhAn.ma_kham_benh == KhamBenh.ma_kham_benh, isouter=True)
        .filter(BenhAn.ma_benh_an == id)
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh án.")
    ba, ho_ten, cap_bac, chuc_vu, so_dien_thoai, so_the_bhyt, nghe_nghiep, ngay_sinh, gioi_tinh, ten_don_vi, ten_buong, ten_giuong, ten_nhom, trieu_chung = result
    d = {c.key: getattr(ba, c.key) for c in inspect(BenhAn).columns}
    d["ho_ten"] = ho_ten
    d["cap_bac"] = cap_bac
    d["chuc_vu"] = chuc_vu
    d["so_dien_thoai"] = so_dien_thoai
    d["so_the_bhyt"] = so_the_bhyt
    d["nghe_nghiep"] = nghe_nghiep
    d["ngay_sinh"] = str(ngay_sinh) if ngay_sinh else None
    d["gioi_tinh"] = gioi_tinh
    d["ten_don_vi"] = ten_don_vi
    d["ten_buong"] = ten_buong
    d["ten_giuong"] = ten_giuong
    d["ten_nhom"] = ten_nhom
    d["trieu_chung"] = trieu_chung
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


@pre_router.get(
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


router = create_crud_router(
    resource="benh_an",
    crud=benh_an_crud,
    pre_router=pre_router,
    read_permission="benh_an:read",
    create_permission="benh_an:create",
    update_permission="benh_an:update",
    delete_permission="benh_an:delete",
    enable_create=False,
    enable_update=False,
)
