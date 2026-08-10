from app.routes.kham_benh.benh_an import router as benh_an_router
from app.routes.kham_benh.chi_tiet_don_thuoc import router as chi_tiet_don_thuoc_router
from app.routes.kham_benh.chi_tiet_lich_kham_sk_nam import router as chi_tiet_lich_kham_sk_nam_router
from app.routes.kham_benh.chi_tiet_phieu_cham_soc import router as chi_tiet_phieu_cham_soc_router
from app.routes.kham_benh.di_tuyen_sau_dieu_tri import router as di_tuyen_sau_dieu_tri_router
from app.routes.kham_benh.don_thuoc import router as don_thuoc_router
from app.routes.kham_benh.giay_gioi_thieu import router as giay_gioi_thieu_router
from app.routes.kham_benh.kham_benh import router as kham_benh_router
from app.routes.kham_benh.lich_kham_sk_nam import router as lich_kham_sk_nam_router
from app.routes.kham_benh.phan_cong_nhiem_vu import router as phan_cong_nhiem_vu_router
from app.routes.kham_benh.phieu_cham_soc import router as phieu_cham_soc_router
from app.routes.kham_benh.phieu_kham_suc_khoe import router as phieu_kham_suc_khoe_router
from app.routes.kham_benh.prediction import router as prediction_router
from app.routes.kham_benh.xet_nghiem_ocr import router as xet_nghiem_ocr_router
from app.routes.kham_benh.upload_cdha import router as upload_cdha_router

routers = [
    benh_an_router,
    chi_tiet_don_thuoc_router,
    chi_tiet_lich_kham_sk_nam_router,
    chi_tiet_phieu_cham_soc_router,
    di_tuyen_sau_dieu_tri_router,
    don_thuoc_router,
    giay_gioi_thieu_router,
    kham_benh_router,
    lich_kham_sk_nam_router,
    phan_cong_nhiem_vu_router,
    phieu_cham_soc_router,
    phieu_kham_suc_khoe_router,
    prediction_router,
    xet_nghiem_ocr_router,
    upload_cdha_router,
]
