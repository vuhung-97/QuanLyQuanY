from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.nguoi_dung import NguoiDung
from app.core.auth import verify_password, create_access_token
from app.schemas.token import Token

router = APIRouter()

@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == form_data.username).first()
    if not user or not verify_password(form_data.password, user.mat_khau_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác",
        )
    if user.trang_thai is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị vô hiệu hóa",
        )
    
    access_token = create_access_token(data={"sub": user.ten_dang_nhap, "role": user.id_vai_tro})
    return {"access_token": access_token, "token_type": "bearer"}
