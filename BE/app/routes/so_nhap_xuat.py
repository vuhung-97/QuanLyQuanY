from app.crud.so_nhap_xuat import so_nhap_xuat_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="so_nhap_xuat", crud=so_nhap_xuat_crud)
