from app.crud.lich_kham_sk_nam import lich_kham_sk_nam_crud
from app.routes.base import create_crud_router


router = create_crud_router(resource="lich_kham_sk_nam", crud=lich_kham_sk_nam_crud)
