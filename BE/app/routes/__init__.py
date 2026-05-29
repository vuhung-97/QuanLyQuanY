from app.routes.benh_an import router as benh_an_router
from app.routes.benh_nhan_ra_vao import router as benh_nhan_ra_vao_router
from app.routes.chi_tiet_don_thuoc import router as chi_tiet_don_thuoc_router
from app.routes.chi_tiet_du_tru import router as chi_tiet_du_tru_router
from app.routes.chi_tiet_phieu_cham_soc import router as chi_tiet_phieu_cham_soc_router
from app.routes.chi_tiet_xuat_kho import router as chi_tiet_xuat_kho_router
from app.routes.di_tuyen_sau_dieu_tri import router as di_tuyen_sau_dieu_tri_router
from app.routes.don_thuoc import router as don_thuoc_router
from app.routes.don_vi import router as don_vi_router
from app.routes.giay_gioi_thieu import router as giay_gioi_thieu_router
from app.routes.kham_benh import router as kham_benh_router
from app.routes.lich_kham_sk_nam import router as lich_kham_sk_nam_router
from app.routes.phieu_cham_soc import router as phieu_cham_soc_router
from app.routes.phieu_du_tru import router as phieu_du_tru_router
from app.routes.phieu_kham_suc_khoe import router as phieu_kham_suc_khoe_router
from app.routes.phieu_xuat_kho import router as phieu_xuat_kho_router
from app.routes.quan_nhan import router as quan_nhan_router
from app.routes.ra_benh_xa import router as ra_benh_xa_router
from app.routes.so_nhap_xuat import router as so_nhap_xuat_router
from app.routes.system import router as system_router
from app.routes.thuoc_vtyt import router as thuoc_vtyt_router

RESOURCE_ROUTERS = [
    benh_an_router,
    benh_nhan_ra_vao_router,
    chi_tiet_don_thuoc_router,
    chi_tiet_du_tru_router,
    chi_tiet_phieu_cham_soc_router,
    chi_tiet_xuat_kho_router,
    di_tuyen_sau_dieu_tri_router,
    don_thuoc_router,
    don_vi_router,
    giay_gioi_thieu_router,
    kham_benh_router,
    lich_kham_sk_nam_router,
    phieu_cham_soc_router,
    phieu_du_tru_router,
    phieu_kham_suc_khoe_router,
    phieu_xuat_kho_router,
    quan_nhan_router,
    ra_benh_xa_router,
    so_nhap_xuat_router,
    thuoc_vtyt_router,
]

__all__ = ["RESOURCE_ROUTERS", "system_router"]
