from app.database.benh_an import BenhAn
from app.database.benh_nhan_ra_vao import BenhNhanRaVao
from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.chi_tiet_du_tru import ChiTietDuTru
from app.database.chi_tiet_phieu_cham_soc import ChiTietPhieuChamSoc
from app.database.chi_tiet_xuat_kho import ChiTietXuatKho
from app.database.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTri
from app.database.don_thuoc import DonThuoc
from app.database.don_vi import DonVi
from app.database.giay_gioi_thieu import GiayGioiThieu
from app.database.kham_benh import KhamBenh
from app.database.lich_kham_sk_nam import LichKhamSkNam
from app.database.phieu_cham_soc import PhieuChamSoc
from app.database.phieu_du_tru import PhieuDuTru
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.quan_nhan import QuanNhan
from app.database.ra_benh_xa import RaBenhXa
from app.database.so_nhap_xuat import SoNhapXuat
from app.database.thuoc_vtyt import ThuocVtyt

MODEL_REGISTRY = {
    "benh_an": BenhAn,
    "benh_nhan_ra_vao": BenhNhanRaVao,
    "chi_tiet_don_thuoc": ChiTietDonThuoc,
    "chi_tiet_du_tru": ChiTietDuTru,
    "chi_tiet_phieu_cham_soc": ChiTietPhieuChamSoc,
    "chi_tiet_xuat_kho": ChiTietXuatKho,
    "di_tuyen_sau_dieu_tri": DiTuyenSauDieuTri,
    "don_thuoc": DonThuoc,
    "don_vi": DonVi,
    "giay_gioi_thieu": GiayGioiThieu,
    "kham_benh": KhamBenh,
    "lich_kham_sk_nam": LichKhamSkNam,
    "phieu_cham_soc": PhieuChamSoc,
    "phieu_du_tru": PhieuDuTru,
    "phieu_kham_suc_khoe": PhieuKhamSucKhoe,
    "phieu_xuat_kho": PhieuXuatKho,
    "quan_nhan": QuanNhan,
    "ra_benh_xa": RaBenhXa,
    "so_nhap_xuat": SoNhapXuat,
    "thuoc_vtyt": ThuocVtyt,
}

__all__ = [
    "BenhAn",
    "BenhNhanRaVao",
    "ChiTietDonThuoc",
    "ChiTietDuTru",
    "ChiTietPhieuChamSoc",
    "ChiTietXuatKho",
    "DiTuyenSauDieuTri",
    "DonThuoc",
    "DonVi",
    "GiayGioiThieu",
    "KhamBenh",
    "LichKhamSkNam",
    "MODEL_REGISTRY",
    "PhieuChamSoc",
    "PhieuDuTru",
    "PhieuKhamSucKhoe",
    "PhieuXuatKho",
    "QuanNhan",
    "RaBenhXa",
    "SoNhapXuat",
    "ThuocVtyt",
]
