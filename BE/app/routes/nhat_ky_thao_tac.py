from app.crud.nhat_ky_thao_tac import nhat_ky_thao_tac_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="nhat_ky_thao_tac", crud=nhat_ky_thao_tac_crud)
