from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.nguoi_dung import NguoiDung
from app.database.nhat_ky_dang_nhap import NhatKyDangNhap
from app.core.auth import verify_password, create_access_token
from app.schemas.token import Token

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

    if user.trang_thai is False:
        _ghi_log_dang_nhap(db, id_nguoi_dung=user.id, thanh_cong=False, thiet_bi=thiet_bi)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị vô hiệu hóa",
        )

    _ghi_log_dang_nhap(db, id_nguoi_dung=user.id, thanh_cong=True, thiet_bi=thiet_bi)

    access_token = create_access_token(data={"sub": user.ten_dang_nhap, "role": user.id_vai_tro, "ho_ten": user.ho_ten})
    return {"access_token": access_token, "token_type": "bearer"}
