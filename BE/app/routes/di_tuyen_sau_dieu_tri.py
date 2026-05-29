from app.crud.di_tuyen_sau_dieu_tri import di_tuyen_sau_dieu_tri_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="di_tuyen_sau_dieu_tri", crud=di_tuyen_sau_dieu_tri_crud)
