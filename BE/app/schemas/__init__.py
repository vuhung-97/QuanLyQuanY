from app.schemas.benh_an import BenhAnBase, BenhAnCreate, BenhAnUpdate, BenhAnRead
from app.schemas.buong import BuongBase, BuongCreate, BuongUpdate, BuongRead
from app.schemas.chi_tiet_don_thuoc import ChiTietDonThuocBase, ChiTietDonThuocCreate, ChiTietDonThuocUpdate, ChiTietDonThuocRead
from app.schemas.chi_tiet_du_tru import ChiTietDuTruBase, ChiTietDuTruCreate, ChiTietDuTruUpdate, ChiTietDuTruRead
from app.schemas.chi_tiet_phieu_cham_soc import ChiTietPhieuChamSocBase, ChiTietPhieuChamSocCreate, ChiTietPhieuChamSocUpdate, ChiTietPhieuChamSocRead
from app.schemas.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKhoBase, ChiTietPhieuNhapKhoCreate, ChiTietPhieuNhapKhoUpdate, ChiTietPhieuNhapKhoRead
from app.schemas.chi_tiet_xuat_kho import ChiTietXuatKhoBase, ChiTietXuatKhoCreate, ChiTietXuatKhoUpdate, ChiTietXuatKhoRead
from app.schemas.di_tuyen_sau_dieu_tri import DiTuyenSauDieuTriBase, DiTuyenSauDieuTriCreate, DiTuyenSauDieuTriUpdate, DiTuyenSauDieuTriRead
from app.schemas.don_thuoc import DonThuocBase, DonThuocCreate, DonThuocUpdate, DonThuocRead
from app.schemas.don_vi import DonViBase, DonViCreate, DonViUpdate, DonViRead
from app.schemas.giay_gioi_thieu import GiayGioiThieuBase, GiayGioiThieuCreate, GiayGioiThieuUpdate, GiayGioiThieuRead
from app.schemas.giuong import GiuongBase, GiuongCreate, GiuongUpdate, GiuongRead
from app.schemas.kham_benh import KhamBenhBase, KhamBenhCreate, KhamBenhUpdate, KhamBenhRead
from app.schemas.lich_kham_sk_nam import LichKhamSkNamBase, LichKhamSkNamCreate, LichKhamSkNamUpdate, LichKhamSkNamRead
from app.schemas.lich_kham_sk_nam_chi_tiet import LichKhamSkNamChiTietBase, LichKhamSkNamChiTietCreate, LichKhamSkNamChiTietUpdate, LichKhamSkNamChiTietRead
from app.schemas.lich_su_kham import LichSuKhamRead
from app.schemas.nguoi_dung import NguoiDungBase, NguoiDungCreate, NguoiDungUpdate, NguoiDungRead
from app.schemas.nhat_ky_backup import NhatKyBackupBase, NhatKyBackupCreate, NhatKyBackupUpdate, NhatKyBackupRead
from app.schemas.nhat_ky_dang_nhap import NhatKyDangNhapBase, NhatKyDangNhapCreate, NhatKyDangNhapUpdate, NhatKyDangNhapRead
from app.schemas.nhat_ky_thao_tac import NhatKyThaoTacBase, NhatKyThaoTacCreate, NhatKyThaoTacUpdate, NhatKyThaoTacRead
from app.schemas.phan_cong_nhiem_vu import PhanCongNhiemVuBase, PhanCongNhiemVuCreate, PhanCongNhiemVuUpdate, PhanCongNhiemVuRead
from app.schemas.phieu_cham_soc import PhieuChamSocBase, PhieuChamSocCreate, PhieuChamSocUpdate, PhieuChamSocRead
from app.schemas.phieu_du_tru import PhieuDuTruBase, PhieuDuTruCreate, PhieuDuTruUpdate, PhieuDuTruRead
from app.schemas.phieu_kham_suc_khoe import PhieuKhamSucKhoeBase, PhieuKhamSucKhoeCreate, PhieuKhamSucKhoeUpdate, PhieuKhamSucKhoeRead
from app.schemas.phieu_nhap_kho import PhieuNhapKhoBase, PhieuNhapKhoCreate, PhieuNhapKhoUpdate, PhieuNhapKhoRead
from app.schemas.phieu_xuat_kho import PhieuXuatKhoBase, PhieuXuatKhoCreate, PhieuXuatKhoUpdate, PhieuXuatKhoRead
from app.schemas.quyen import QuyenBase, QuyenCreate, QuyenUpdate, QuyenRead
from app.schemas.quan_nhan import QuanNhanBase, QuanNhanCreate, QuanNhanUpdate, QuanNhanRead
from app.schemas.thuoc_vtyt import ThuocVtytBase, ThuocVtytCreate, ThuocVtytUpdate, ThuocVtytRead
from app.schemas.token import Token
from app.schemas.vai_tro import VaiTroBase, VaiTroCreate, VaiTroUpdate, VaiTroRead
from app.schemas.vai_tro_quyen import VaiTroQuyenBase, VaiTroQuyenCreate, VaiTroQuyenUpdate, VaiTroQuyenRead
from app.schemas.vai_tro_tam_thoi import VaiTroTamThoiBase, VaiTroTamThoiCreate, VaiTroTamThoiUpdate, VaiTroTamThoiRead

__all__ = [
    "BenhAnBase",
    "BenhAnCreate",
    "BenhAnUpdate",
    "BenhAnRead",

    "BuongBase",
    "BuongCreate",
    "BuongUpdate",
    "BuongRead",

    "ChiTietDonThuocBase",
    "ChiTietDonThuocCreate",
    "ChiTietDonThuocUpdate",
    "ChiTietDonThuocRead",

    "ChiTietDuTruBase",
    "ChiTietDuTruCreate",
    "ChiTietDuTruUpdate",
    "ChiTietDuTruRead",

    "ChiTietPhieuChamSocBase",
    "ChiTietPhieuChamSocCreate",
    "ChiTietPhieuChamSocUpdate",
    "ChiTietPhieuChamSocRead",

    "ChiTietPhieuNhapKhoBase",
    "ChiTietPhieuNhapKhoCreate",
    "ChiTietPhieuNhapKhoUpdate",
    "ChiTietPhieuNhapKhoRead",

    "ChiTietXuatKhoBase",
    "ChiTietXuatKhoCreate",
    "ChiTietXuatKhoUpdate",
    "ChiTietXuatKhoRead",

    "DiTuyenSauDieuTriBase",
    "DiTuyenSauDieuTriCreate",
    "DiTuyenSauDieuTriUpdate",
    "DiTuyenSauDieuTriRead",

    "DonThuocBase",
    "DonThuocCreate",
    "DonThuocUpdate",
    "DonThuocRead",

    "DonViBase",
    "DonViCreate",
    "DonViUpdate",
    "DonViRead",

    "GiayGioiThieuBase",
    "GiayGioiThieuCreate",
    "GiayGioiThieuUpdate",
    "GiayGioiThieuRead",

    "GiuongBase",
    "GiuongCreate",
    "GiuongUpdate",
    "GiuongRead",

    "KhamBenhBase",
    "KhamBenhCreate",
    "KhamBenhUpdate",
    "KhamBenhRead",

    "LichKhamSkNamBase",
    "LichKhamSkNamCreate",
    "LichKhamSkNamUpdate",
    "LichKhamSkNamRead",

    "LichKhamSkNamChiTietBase",
    "LichKhamSkNamChiTietCreate",
    "LichKhamSkNamChiTietUpdate",
    "LichKhamSkNamChiTietRead",

    "LichSuKhamRead",

    "NguoiDungBase",
    "NguoiDungCreate",
    "NguoiDungUpdate",
    "NguoiDungRead",

    "NhatKyBackupBase",
    "NhatKyBackupCreate",
    "NhatKyBackupUpdate",
    "NhatKyBackupRead",

    "NhatKyDangNhapBase",
    "NhatKyDangNhapCreate",
    "NhatKyDangNhapUpdate",
    "NhatKyDangNhapRead",

    "NhatKyThaoTacBase",
    "NhatKyThaoTacCreate",
    "NhatKyThaoTacUpdate",
    "NhatKyThaoTacRead",

    "PhanCongNhiemVuBase",
    "PhanCongNhiemVuCreate",
    "PhanCongNhiemVuUpdate",
    "PhanCongNhiemVuRead",

    "PhieuChamSocBase",
    "PhieuChamSocCreate",
    "PhieuChamSocUpdate",
    "PhieuChamSocRead",

    "PhieuDuTruBase",
    "PhieuDuTruCreate",
    "PhieuDuTruUpdate",
    "PhieuDuTruRead",

    "PhieuKhamSucKhoeBase",
    "PhieuKhamSucKhoeCreate",
    "PhieuKhamSucKhoeUpdate",
    "PhieuKhamSucKhoeRead",

    "PhieuNhapKhoBase",
    "PhieuNhapKhoCreate",
    "PhieuNhapKhoUpdate",
    "PhieuNhapKhoRead",

    "PhieuXuatKhoBase",
    "PhieuXuatKhoCreate",
    "PhieuXuatKhoUpdate",
    "PhieuXuatKhoRead",

    "QuyenBase",
    "QuyenCreate",
    "QuyenUpdate",
    "QuyenRead",

    "QuanNhanBase",
    "QuanNhanCreate",
    "QuanNhanUpdate",
    "QuanNhanRead",

    "ThuocVtytBase",
    "ThuocVtytCreate",
    "ThuocVtytUpdate",
    "ThuocVtytRead",

    "Token",

    "VaiTroBase",
    "VaiTroCreate",
    "VaiTroUpdate",
    "VaiTroRead",

    "VaiTroQuyenBase",
    "VaiTroQuyenCreate",
    "VaiTroQuyenUpdate",
    "VaiTroQuyenRead",

    "VaiTroTamThoiBase",
    "VaiTroTamThoiCreate",
    "VaiTroTamThoiUpdate",
    "VaiTroTamThoiRead",
]
