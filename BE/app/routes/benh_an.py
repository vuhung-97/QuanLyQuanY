from app.crud.benh_an import benh_an_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="benh_an", crud=benh_an_crud)
