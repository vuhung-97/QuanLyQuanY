from app.crud.vai_tro_quyen import vai_tro_quyen_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="vai_tro_quyen", crud=vai_tro_quyen_crud)
