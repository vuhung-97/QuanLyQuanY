import tempfile
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.crud.phieu_kham_suc_khoe import phieu_kham_suc_khoe_crud
from app.database.nguoi_dung import NguoiDung
from app.database.phan_cong_nhiem_vu import PhanCongNhiemVu
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.database.quan_nhan import QuanNhan
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.routes.kham_benh.phieu_kham_suc_khoe import (
    _require_lich_con_hoat_dong,
    _require_xet_nghiem,
)
from app.schemas.phieu_kham_suc_khoe import PhieuKhamSucKhoeUpdate
from app.services.medical_extractor import ExtractorPDF

router = APIRouter(prefix="/xet_nghiem_ocr", tags=["xet_nghiem_ocr"])

TRANG_THAI_DU_DIEU_KIEN = {"da_lay_mau", "dang_kham", "da_kham"}


class DaCapNhatItem(BaseModel):
    ma_quan_nhan: str
    ma_lay_mau: str
    ho_ten: str
    so_chi_so: int


class DienKetQuaResponse(BaseModel):
    ma_lich_kham: str
    so_mau_trich_xuat: int
    so_phieu_da_cap_nhat: int
    da_cap_nhat: list[DaCapNhatItem]
    khong_khop: list[str]
    chua_lay_mau: list[str]


@router.post(
    "/dien-ket-qua",
    response_model=DienKetQuaResponse,
)
def dien_ket_qua(
    ma_lich_kham: str = Form(...),
    file: UploadFile = File(...),
    current_user: NguoiDung = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_xet_nghiem(current_user, db, ma_lich_kham)
    _require_lich_con_hoat_dong(db, ma_lich_kham, current_user)

    ten_file = (file.filename or "").lower()
    if not ten_file.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ chấp nhận file PDF kết quả xét nghiệm.",
        )

    duong_dan_tam = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as f:
            duong_dan_tam = Path(f.name)
            f.write(file.file.read())

        cac_mau = ExtractorPDF().trich_xuat_ket_qua(duong_dan_tam)

        danh_sach_phieu = (
            db.query(PhieuKhamSucKhoe)
            .filter(PhieuKhamSucKhoe.ma_lich_kham == ma_lich_kham)
            .all()
        )
        phieu_theo_ma_lay_mau = {
            phieu.ma_lay_mau: phieu
            for phieu in danh_sach_phieu
            if phieu.ma_lay_mau
        }

        danh_sach_ho_ten = {
            qn.ma_quan_nhan: qn.ho_ten
            for qn in db.query(QuanNhan.ma_quan_nhan, QuanNhan.ho_ten).all()
        }

        da_cap_nhat: list[DaCapNhatItem] = []
        khong_khop: list[str] = []
        chua_lay_mau: list[str] = []

        for mau in cac_mau:
            ma_so_mau = mau["ma_so_mau"]
            ket_qua = mau["ket_qua"] or {}
            phieu = phieu_theo_ma_lay_mau.get(ma_so_mau)

            if phieu is None:
                khong_khop.append(ma_so_mau)
                continue

            if phieu.trang_thai not in TRANG_THAI_DU_DIEU_KIEN:
                chua_lay_mau.append(ma_so_mau)
                continue

            phieu_da_cap_nhat = phieu_kham_suc_khoe_crud.update(
                db,
                phieu.ma_phieu_kham,
                PhieuKhamSucKhoeUpdate(xet_nghiem=ket_qua),
                nguoi_dung_id=current_user.id,
            )
            da_cap_nhat.append(
                DaCapNhatItem(
                    ma_quan_nhan=phieu_da_cap_nhat.ma_quan_nhan,
                    ma_lay_mau=phieu_da_cap_nhat.ma_lay_mau,
                    ho_ten=danh_sach_ho_ten.get(
                        phieu_da_cap_nhat.ma_quan_nhan, ""
                    ),
                    so_chi_so=len(ket_qua),
                )
            )

        return DienKetQuaResponse(
            ma_lich_kham=ma_lich_kham,
            so_mau_trich_xuat=len(cac_mau),
            so_phieu_da_cap_nhat=len(da_cap_nhat),
            da_cap_nhat=da_cap_nhat,
            khong_khop=khong_khop,
            chua_lay_mau=chua_lay_mau,
        )
    finally:
        if duong_dan_tam and duong_dan_tam.exists():
            try:
                duong_dan_tam.unlink()
            except Exception:
                pass
