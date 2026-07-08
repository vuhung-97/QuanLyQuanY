from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import extract, inspect
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.kham_benh import kham_benh_crud
from app.database.benh_an import BenhAn
from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTri
from app.database.don_thuoc import DonThuoc
from app.database.don_vi import DonVi
from app.database.giay_gioi_thieu import GiayGioiThieu
from app.database.kham_benh import KhamBenh
from app.database.nguoi_dung import NguoiDung
from app.database.quan_nhan import QuanNhan
from app.database.vai_tro import VaiTro
from app.database.session import get_db
from app.database.thuoc_vtyt import ThuocVtyt
from app.routes.base import create_crud_router
from app.schemas.kham_benh import KhamBenhRead
from app.services.medical_examination import MedicalExaminationService


pre_router = APIRouter()


@pre_router.get(
    "/danh-sach",
    dependencies=[Depends(require_permissions("kham_benh:read"))],
)
def get_kham_benh_all(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    nam: int | None = Query(default=None, description="Năm (VD: 2026)"),
    thang: int | None = Query(default=None, ge=1, le=12, description="Tháng (1-12)"),
    db: Session = Depends(get_db),
):
    base_query = (
        db.query(KhamBenh, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu, QuanNhan.ngay_sinh, QuanNhan.ma_don_vi, DonVi.ten_don_vi)
        .join(QuanNhan, KhamBenh.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
        .order_by(KhamBenh.ngay_kham.desc())
    )
    if nam:
        base_query = base_query.filter(
            KhamBenh.ngay_kham >= date(nam, 1, 1),
            KhamBenh.ngay_kham < date(nam + 1, 1, 1),
        )
    if thang:
        base_query = base_query.filter(
            extract('month', KhamBenh.ngay_kham) == thang
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


@pre_router.get(
    "/hom-nay",
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


@pre_router.get(
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

    if kb.id_nguoi_dung:
        nd = db.query(NguoiDung.ho_ten, VaiTro.ten_vai_tro) \
            .join(VaiTro, NguoiDung.id_vai_tro == VaiTro.id, isouter=True) \
            .filter(NguoiDung.id == kb.id_nguoi_dung).first()
        result["ten_nguoi_kham"] = nd.ho_ten if nd else None
        result["vai_tro_nguoi_kham"] = nd.ten_vai_tro if nd else None
    else:
        result["ten_nguoi_kham"] = None
        result["vai_tro_nguoi_kham"] = None

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
        nd_dt = None
        if dt.id_nguoi_dung:
            nd_dt = db.query(NguoiDung.ho_ten, VaiTro.ten_vai_tro) \
                .join(VaiTro, NguoiDung.id_vai_tro == VaiTro.id, isouter=True) \
                .filter(NguoiDung.id == dt.id_nguoi_dung).first()
        prescriptions.append({
            "ma_don_thuoc": dt.ma_don_thuoc,
            "id_nguoi_dung": dt.id_nguoi_dung,
            "ten_nguoi_cap_thuoc": nd_dt.ho_ten if nd_dt else None,
            "vai_tro_nguoi_cap_thuoc": nd_dt.ten_vai_tro if nd_dt else None,
            "chi_tiet_don_thuoc": items,
        })

    result["don_thuoc"] = prescriptions
    return result


@pre_router.post(
    "/{id}/nhan-thuoc",
    dependencies=[Depends(require_permissions("kham_benh:update"))],
    response_model=KhamBenhRead,
)
def nhan_thuoc(id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = MedicalExaminationService(db)
    try:
        return service.receive_medicine(id, nguoi_dung_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@pre_router.post(
    "/{id}/chuyen-tuyen",
    dependencies=[Depends(require_permissions("kham_benh:update"))],
)
def chuyen_tuyen(id: str, data: dict, db: Session = Depends(get_db)):
    service = MedicalExaminationService(db)
    return service.refer_patient(id, data)


@pre_router.post(
    "/{id}/nhap-vien",
    dependencies=[Depends(require_permissions("kham_benh:update"))],
)
def nhap_vien(id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    service = MedicalExaminationService(db)
    return service.admit_patient(id, nguoi_dung_id=current_user.id)


@pre_router.post(
    "/{id}/hoan-tat",
    dependencies=[Depends(require_permissions("kham_benh:update"))],
    response_model=KhamBenhRead,
)
def hoan_tat_kham(id: str, data: dict, db: Session = Depends(get_db)):
    service = MedicalExaminationService(db)
    return service.complete_examination(id, data)


@pre_router.get(
    "/nhap-vien",
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


@pre_router.get(
    "/chuyen-tuyen",
    dependencies=[Depends(require_permissions("kham_benh:read"))],
)
def get_danh_sach_chuyen_tuyen(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    nam: int | None = Query(default=None, description="Năm (VD: 2026)"),
    thang: int | None = Query(default=None, ge=1, le=12, description="Tháng (1-12)"),
    db: Session = Depends(get_db),
):
    base_query = (
        db.query(
            KhamBenh, QuanNhan.ho_ten, QuanNhan.cap_bac, QuanNhan.chuc_vu,
            QuanNhan.ngay_sinh, QuanNhan.ma_don_vi, DonVi.ten_don_vi,
            GiayGioiThieu.ten_benh_vien, GiayGioiThieu.y_kien_de_nghi,
            DiTuyenSauDieuTri.ngay_ve,
        )
        .join(QuanNhan, KhamBenh.ma_quan_nhan == QuanNhan.ma_quan_nhan)
        .join(DonVi, QuanNhan.ma_don_vi == DonVi.ma_don_vi, isouter=True)
        .outerjoin(GiayGioiThieu, KhamBenh.ma_kham_benh == GiayGioiThieu.ma_kham_benh)
        .outerjoin(DiTuyenSauDieuTri, GiayGioiThieu.ma_giay_gt == DiTuyenSauDieuTri.ma_giay_gt)
        .filter(KhamBenh.trang_thai == "chuyển_tuyến")
        .order_by(KhamBenh.ngay_kham.desc())
    )
    if nam:
        base_query = base_query.filter(
            KhamBenh.ngay_kham >= date(nam, 1, 1),
            KhamBenh.ngay_kham < date(nam + 1, 1, 1),
        )
    if thang:
        base_query = base_query.filter(
            extract('month', KhamBenh.ngay_kham) == thang
        )
    total = base_query.count()
    records = base_query.offset(offset).limit(limit).all()
    result = []
    for (
        kb, ho_ten, cap_bac, chuc_vu, ngay_sinh, ma_don_vi, ten_don_vi,
        gt_ten_benh_vien, gt_y_kien_de_nghi, dt_ngay_ve,
    ) in records:
        d = {c.key: getattr(kb, c.key) for c in inspect(KhamBenh).columns}
        d["ho_ten"] = ho_ten
        d["cap_bac"] = cap_bac
        d["chuc_vu"] = chuc_vu
        d["ngay_sinh"] = str(ngay_sinh) if ngay_sinh else None
        d["ma_don_vi"] = ma_don_vi
        d["ten_don_vi"] = ten_don_vi
        d["trang_thai"] = d["trang_thai"] or "chờ"

        if not gt_ten_benh_vien:
            d["chuyen_tuyen_status"] = "đề_nghị_chuyển_tuyến"
        elif not dt_ngay_ve:
            d["chuyen_tuyen_status"] = "đã_chuyển_tuyến"
        else:
            d["chuyen_tuyen_status"] = "đã_về"

        result.append(d)
    return {"data": result, "total": total}


router = create_crud_router(
    resource="kham_benh",
    crud=kham_benh_crud,
    pre_router=pre_router,
    read_permission="kham_benh:read",
    create_permission="kham_benh:create",
    update_permission="kham_benh:update",
    delete_permission="kham_benh:delete",
)
