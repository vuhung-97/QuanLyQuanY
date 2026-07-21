from app.routes.danh_muc.buong import router as buong_router
from app.routes.danh_muc.dm_benh import router as dm_benh_router
from app.routes.danh_muc.dm_nhom_benh import router as dm_nhom_benh_router
from app.routes.danh_muc.dm_trieu_chung import router as dm_trieu_chung_router
from app.routes.danh_muc.don_vi import router as don_vi_router
from app.routes.danh_muc.giuong import router as giuong_router
from app.routes.danh_muc.quan_nhan import router as quan_nhan_router

routers = [
    buong_router,
    dm_benh_router,
    dm_nhom_benh_router,
    dm_trieu_chung_router,
    don_vi_router,
    giuong_router,
    quan_nhan_router,
]
