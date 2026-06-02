from app.crud.nhat_ky_dang_nhap import nhat_ky_dang_nhap_crud
from app.routes.base import create_crud_router


router = create_crud_router(
    resource="nhat_ky_dang_nhap",
    crud=nhat_ky_dang_nhap_crud,
    read_permission="nhat_ky_dang_nhap:read",
    enable_create=False,
    enable_update=False,
    enable_delete=False,
)
