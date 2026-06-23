from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.phan_cong_nhiem_vu import PhanCongNhiemVu
from app.database.session import get_db
from app.database.nguoi_dung import NguoiDung
from app.database.nhat_ky_dang_nhap import NhatKyDangNhap
from app.database.vai_tro_tam_thoi import VaiTroTamThoi
from app.core.auth import verify_password, create_access_token
from app.core.dependencies import get_current_user
from app.schemas.token import Token
from app.schemas.phan_cong_nhiem_vu import PhanCongNhiemVuRead

router = APIRouter()


def _ghi_log_dang_nhap(
    db: Session,
    id_nguoi_dung: str | None,
    thanh_cong: bool,
    thiet_bi: str | None,
) -> None:
    log = NhatKyDangNhap(
        id_nguoi_dung=id_nguoi_dung,
        thoi_gian=datetime.now(timezone.utc),
        trang_thai_thanh_cong=thanh_cong,
        thiet_bi=thiet_bi,
    )
    db.add(log)
    db.commit()


@router.post("/login", response_model=Token)
def login(
    request: Request,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    thiet_bi = request.headers.get("user-agent")
    user = db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == form_data.username).first()

    if not user or not verify_password(form_data.password, user.mat_khau_hash):
        _ghi_log_dang_nhap(db, id_nguoi_dung=None, thanh_cong=False, thiet_bi=thiet_bi)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác",
        )

    if not user.trang_thai:
        _ghi_log_dang_nhap(db, id_nguoi_dung=user.id, thanh_cong=False, thiet_bi=thiet_bi)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị vô hiệu hóa",
        )

    _ghi_log_dang_nhap(db, id_nguoi_dung=user.id, thanh_cong=True, thiet_bi=thiet_bi)

    access_token = create_access_token(data={"sub": user.ten_dang_nhap, "role": user.id_vai_tro, "ho_ten": user.ho_ten, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me/phan-cong", response_model=PhanCongNhiemVuRead | None)
def get_my_assignment(
    ma_lich_kham: str = Query(...),
    current_user: NguoiDung = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pcnv = db.query(PhanCongNhiemVu).filter(
        PhanCongNhiemVu.ma_lich_kham == ma_lich_kham,
        PhanCongNhiemVu.id_nguoi_dung == current_user.id,
    ).first()
    if not pcnv:
        return None
    d = PhanCongNhiemVuRead.model_validate(pcnv).model_dump(mode="json")
    d["ten_nguoi_dung"] = current_user.ho_ten
    role = db.query(VaiTroTamThoi).filter(VaiTroTamThoi.ma_vai_tro == pcnv.ma_vai_tro).first()
    d["ten_vai_tro"] = role.ten_vai_tro if role else ""
    return d
