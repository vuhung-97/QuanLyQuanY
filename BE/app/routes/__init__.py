from app.routes.benh_an import router as benh_an_router
from app.routes.buong import router as buong_router
from app.routes.chi_tiet_don_thuoc import router as chi_tiet_don_thuoc_router
from app.routes.chi_tiet_du_tru import router as chi_tiet_du_tru_router
from app.routes.chi_tiet_lich_kham_sk_nam import router as chi_tiet_lich_kham_sk_nam_router
from app.routes.chi_tiet_phieu_cham_soc import router as chi_tiet_phieu_cham_soc_router
from app.routes.chi_tiet_phieu_nhap_kho import router as chi_tiet_phieu_nhap_kho_router
from app.routes.chi_tiet_xuat_kho import router as chi_tiet_xuat_kho_router
from app.routes.di_tuyen_sau_dieu_tri import router as di_tuyen_sau_dieu_tri_router
from app.routes.dm_nhom_benh import router as dm_nhom_benh_router
from app.routes.dm_trieu_chung import router as dm_trieu_chung_router
from app.routes.don_thuoc import router as don_thuoc_router
from app.routes.don_vi import router as don_vi_router
from app.routes.giay_gioi_thieu import router as giay_gioi_thieu_router
from app.routes.giuong import router as giuong_router
from app.routes.kham_benh import router as kham_benh_router
from app.routes.lich_kham_sk_nam import router as lich_kham_sk_nam_router
from app.routes.nguoi_dung import router as nguoi_dung_router
from app.routes.nhat_ky_backup import router as nhat_ky_backup_router
from app.routes.nhat_ky_dang_nhap import router as nhat_ky_dang_nhap_router
from app.routes.nhat_ky_thao_tac import router as nhat_ky_thao_tac_router
from app.routes.phieu_cham_soc import router as phieu_cham_soc_router
from app.routes.phieu_du_tru import router as phieu_du_tru_router
from app.routes.phieu_nhap_kho import router as phieu_nhap_kho_router
from app.routes.phan_cong_nhiem_vu import router as phan_cong_nhiem_vu_router
from app.routes.phieu_kham_suc_khoe import router as phieu_kham_suc_khoe_router
from app.routes.phieu_xuat_kho import router as phieu_xuat_kho_router
from app.routes.vai_tro_tam_thoi import router as vai_tro_tam_thoi_router
from app.routes.quan_nhan import router as quan_nhan_router
from app.routes.quyen import router as quyen_router
from app.routes.system import router as system_router
from app.routes.thuoc_vtyt import router as thuoc_vtyt_router
from app.routes.vai_tro import router as vai_tro_router
from app.routes.vai_tro_quyen import router as vai_tro_quyen_router
from app.routes.backup import router as backup_router
from app.routes.bao_cao import router as bao_cao_router
from app.routes.thong_ke import router as thong_ke_router

RESOURCE_ROUTERS = [
    benh_an_router,
    buong_router,
    chi_tiet_don_thuoc_router,
    chi_tiet_du_tru_router,
    chi_tiet_phieu_cham_soc_router,
    chi_tiet_phieu_nhap_kho_router,
    chi_tiet_xuat_kho_router,
    chi_tiet_lich_kham_sk_nam_router,
    di_tuyen_sau_dieu_tri_router,
    dm_nhom_benh_router,
    dm_trieu_chung_router,
    don_thuoc_router,
    don_vi_router,
    giay_gioi_thieu_router,
    giuong_router,
    kham_benh_router,
    lich_kham_sk_nam_router,
    phieu_cham_soc_router,
    phieu_du_tru_router,
    phieu_nhap_kho_router,
    phan_cong_nhiem_vu_router,
    phieu_kham_suc_khoe_router,
    phieu_xuat_kho_router,
    vai_tro_tam_thoi_router,
    quan_nhan_router,
    thuoc_vtyt_router,
    quyen_router,
    vai_tro_router,
    vai_tro_quyen_router,
    nguoi_dung_router,
    nhat_ky_backup_router,
    nhat_ky_dang_nhap_router,
    nhat_ky_thao_tac_router,
    backup_router,
    bao_cao_router,
    thong_ke_router,
]

__all__ = ["RESOURCE_ROUTERS", "system_router"]
