from app.database.benh_an import BenhAn
from app.database.buong import Buong
from app.database.chi_tiet_don_thuoc import ChiTietDonThuoc
from app.database.chi_tiet_du_tru import ChiTietDuTru
from app.database.chi_tiet_phieu_cham_soc import ChiTietPhieuChamSoc
from app.database.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKho
from app.database.chi_tiet_xuat_kho import ChiTietXuatKho
from app.database.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTri
from app.database.don_thuoc import DonThuoc
from app.database.don_vi import DonVi
from app.database.giay_gioi_thieu import GiayGioiThieu
from app.database.giuong import Giuong
from app.database.kham_benh import KhamBenh
from app.database.lich_kham_sk_nam import LichKhamSkNam
from app.database.lich_kham_sk_nam_chi_tiet import LichKhamSkNamChiTiet
from app.database.nguoi_dung import NguoiDung
from app.database.nhat_ky_backup import NhatKyBackup
from app.database.nhat_ky_dang_nhap import NhatKyDangNhap
from app.database.nhat_ky_thao_tac import NhatKyThaoTac
from app.database.phieu_cham_soc import PhieuChamSoc
from app.database.phieu_du_tru import PhieuDuTru
from app.database.phan_cong_nhiem_vu import PhanCongNhiemVu
from app.database.phieu_kham_suc_khoe import PhieuKhamSucKhoe
from app.database.phieu_nhap_kho import PhieuNhapKho
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.vai_tro_tam_thoi import VaiTroTamThoi
from app.database.quyen import Quyen
from app.database.quan_nhan import QuanNhan
from app.database.thuoc_vtyt import ThuocVtyt
from app.database.vai_tro import VaiTro
from app.database.vai_tro_quyen import VaiTroQuyen

MODEL_REGISTRY = {
    "benh_an": BenhAn,
    "buong": Buong,
    "chi_tiet_don_thuoc": ChiTietDonThuoc,
    "chi_tiet_du_tru": ChiTietDuTru,
    "chi_tiet_phieu_cham_soc": ChiTietPhieuChamSoc,
    "chi_tiet_phieu_nhap_kho": ChiTietPhieuNhapKho,
    "chi_tiet_xuat_kho": ChiTietXuatKho,
    "di_tuyen_sau_dieu_tri": DiTuyenSauDieuTri,
    "don_thuoc": DonThuoc,
    "don_vi": DonVi,
    "giay_gioi_thieu": GiayGioiThieu,
    "giuong": Giuong,
    "kham_benh": KhamBenh,
    "lich_kham_sk_nam": LichKhamSkNam,
    "lich_kham_sk_nam_chi_tiet": LichKhamSkNamChiTiet,
    "nguoi_dung": NguoiDung,
    "nhat_ky_backup": NhatKyBackup,
    "nhat_ky_dang_nhap": NhatKyDangNhap,
    "nhat_ky_thao_tac": NhatKyThaoTac,
    "phieu_cham_soc": PhieuChamSoc,
    "phieu_du_tru": PhieuDuTru,
    "phan_cong_nhiem_vu": PhanCongNhiemVu,
    "phieu_kham_suc_khoe": PhieuKhamSucKhoe,
    "phieu_nhap_kho": PhieuNhapKho,
    "phieu_xuat_kho": PhieuXuatKho,
    "vai_tro_tam_thoi": VaiTroTamThoi,
    "quyen": Quyen,
    "quan_nhan": QuanNhan,
    "thuoc_vtyt": ThuocVtyt,
    "vai_tro": VaiTro,
    "vai_tro_quyen": VaiTroQuyen,
}

__all__ = [
    "BenhAn",
    "Buong",
    "ChiTietDonThuoc",
    "ChiTietDuTru",
    "ChiTietPhieuChamSoc",
    "ChiTietPhieuNhapKho",
    "ChiTietXuatKho",
    "DiTuyenSauDieuTri",
    "DonThuoc",
    "DonVi",
    "GiayGioiThieu",
    "Giuong",
    "KhamBenh",
    "LichKhamSkNam",
    "LichKhamSkNamChiTiet",
    "MODEL_REGISTRY",
    "NguoiDung",
    "NhatKyBackup",
    "NhatKyDangNhap",
    "NhatKyThaoTac",
    "PhieuChamSoc",
    "PhieuDuTru",
    "PhanCongNhiemVu",
    "PhieuKhamSucKhoe",
    "PhieuNhapKho",
    "PhieuXuatKho",
    "VaiTroTamThoi",
    "Quyen",
    "QuanNhan",
    "ThuocVtyt",
    "VaiTro",
    "VaiTroQuyen",
]
