from app.crud.don_thuoc import don_thuoc_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="don_thuoc", crud=don_thuoc_crud)
