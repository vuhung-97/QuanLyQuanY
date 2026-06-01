from app.crud.vai_tro import vai_tro_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="vai_tro", crud=vai_tro_crud)
