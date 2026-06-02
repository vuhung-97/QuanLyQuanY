from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database.session import get_db
from app.database.nguoi_dung import NguoiDung
from app.database.vai_tro_quyen import VaiTroQuyen

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> NguoiDung:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Chưa đăng nhập",
        )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token không hợp lệ",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ",
        )

    user = db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Người dùng không tồn tại",
        )
    if user.trang_thai is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị vô hiệu hóa",
        )
    return user


def require_permissions(*required_permissions: str):
    async def permission_checker(
        current_user: NguoiDung = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> NguoiDung:
        if current_user.id_vai_tro == "ROLE_ADMIN" or current_user.ten_dang_nhap == "admin":
            return current_user

        user_perms = db.query(VaiTroQuyen.id_quyen).filter(
            VaiTroQuyen.id_vai_tro == current_user.id_vai_tro
        ).all()
        user_perms_set = {p.id_quyen for p in user_perms}

        for perm in required_permissions:
            if perm not in user_perms_set:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Thiếu quyền: {perm}",
                )
        return current_user

    return permission_checker
