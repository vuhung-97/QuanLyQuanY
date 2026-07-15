from app.routes.he_thong.nguoi_dung import router as nguoi_dung_router
from app.routes.he_thong.quyen import router as quyen_router
from app.routes.he_thong.vai_tro import router as vai_tro_router
from app.routes.he_thong.vai_tro_quyen import router as vai_tro_quyen_router
from app.routes.he_thong.vai_tro_tam_thoi import router as vai_tro_tam_thoi_router

routers = [
    nguoi_dung_router,
    quyen_router,
    vai_tro_router,
    vai_tro_quyen_router,
    vai_tro_tam_thoi_router,
]
