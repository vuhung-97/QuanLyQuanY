from app.routes.kho.chi_tiet_du_tru import router as chi_tiet_du_tru_router
from app.routes.kho.chi_tiet_phieu_nhap_kho import router as chi_tiet_phieu_nhap_kho_router
from app.routes.kho.chi_tiet_xuat_kho import router as chi_tiet_xuat_kho_router
from app.routes.kho.phieu_du_tru import router as phieu_du_tru_router
from app.routes.kho.phieu_nhap_kho import router as phieu_nhap_kho_router
from app.routes.kho.phieu_xuat_kho import router as phieu_xuat_kho_router
from app.routes.kho.thuoc_vtyt import router as thuoc_vtyt_router

routers = [
    chi_tiet_du_tru_router,
    chi_tiet_phieu_nhap_kho_router,
    chi_tiet_xuat_kho_router,
    phieu_du_tru_router,
    phieu_nhap_kho_router,
    phieu_xuat_kho_router,
    thuoc_vtyt_router,
]
