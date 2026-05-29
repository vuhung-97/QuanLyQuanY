from app.crud.phieu_du_tru import phieu_du_tru_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="phieu_du_tru", crud=phieu_du_tru_crud)
