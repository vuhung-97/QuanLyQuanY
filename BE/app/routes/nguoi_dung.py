from app.crud.nguoi_dung import nguoi_dung_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="nguoi_dung", crud=nguoi_dung_crud)
