from app.crud.chi_tiet_du_tru import chi_tiet_du_tru_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="chi_tiet_du_tru", crud=chi_tiet_du_tru_crud)
