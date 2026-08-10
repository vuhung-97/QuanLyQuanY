"""Bộ trích xuất dữ liệu xét nghiệm y tế chính."""

import json
import logging
import re
from pathlib import Path
import pymupdf

from .config import (
    ANH_XA_CHI_SO,
    ANH_XA_GOP,
    CAC_CHI_SO_NHI_PHAN,
    CAC_COT,
    GIA_TRI_MAC_DINH,
    MA_MAU_MAC_DINH,
    NGO_LENH_CUNG_DONG,
    REGEX_MA_MAU,
    REGEX_SO_PHIEU,
    TEN_FILE_KET_QUA,
    TU_KHOA_KET_QUA_HOP_LE,
    TU_KHOA_LOAI_BO,
    chuan_hoa_ten,
)
from .downloader import tai_pdf_tu_url
from .models import MauXetNghiem

logger = logging.getLogger(__name__)


class ExtractorPDF:
    """Lớp xử lý trích xuất dữ liệu phiếu xét nghiệm y tế từ file PDF."""

    def __init__(self, thu_muc_ket_qua: str = "results"):
        self.thu_muc_ket_qua = Path(thu_muc_ket_qua).resolve()
        self._khoi_tao_thu_muc()

    def _khoi_tao_thu_muc(self) -> None:
        """Đảm bảo thư mục đầu ra tồn tại trên ổ đĩa."""
        self.thu_muc_ket_qua.mkdir(parents=True, exist_ok=True)

    def xu_ly(self, duong_dan_pdf: str | Path) -> None:
        """Thực thi toàn bộ quy trình trích xuất."""
        pdf_path, la_file_tam = self._chuan_bi_tai_lieu(duong_dan_pdf)
        if not pdf_path:
            return

        logger.info("Bắt đầu xử lý file: %s...", pdf_path)
        try:
            cac_trang_ket_qua = self._trich_xuat_tai_lieu(pdf_path)
            cac_mau_gop = self._gom_theo_ma_so_mau(cac_trang_ket_qua)
            self._luu_file_json(cac_mau_gop)
        finally:
            if la_file_tam and pdf_path.exists():
                try:
                    pdf_path.unlink()
                    logger.debug("Đã dọn dẹp file tạm: %s", pdf_path)
                except Exception as e:
                    logger.warning("Không thể xóa file tạm %s: %s", pdf_path, e)

    def trich_xuat_ket_qua(self, duong_dan_pdf: str | Path) -> list[dict]:
        """Trích xuất danh sách kết quả xét nghiệm, trả về list dict trực tiếp.

        Mỗi phần tử có cấu trúc ``{"ma_so_mau": str, "ket_qua": dict[str, str]}``.
        File tạm (nếu là URL) sẽ được dọn dẹp sau khi xử lý.
        """
        pdf_path, la_file_tam = self._chuan_bi_tai_lieu(duong_dan_pdf)
        if not pdf_path:
            return []

        logger.info("Bắt đầu trích xuất file: %s...", pdf_path)
        try:
            cac_trang_ket_qua = self._trich_xuat_tai_lieu(pdf_path)
            cac_mau_gop = self._gom_theo_ma_so_mau(cac_trang_ket_qua)
            return [mau.to_dict() for mau in cac_mau_gop]
        finally:
            if la_file_tam and pdf_path.exists():
                try:
                    pdf_path.unlink()
                    logger.debug("Đã dọn dẹp file tạm: %s", pdf_path)
                except Exception as e:
                    logger.warning("Không thể xóa file tạm %s: %s", pdf_path, e)

    def _chuan_bi_tai_lieu(self, duong_dan_pdf: str | Path) -> tuple[Path | None, bool]:
        """Tải xuống nếu là link URL hoặc xác thực file cục bộ."""
        chuoi_path = str(duong_dan_pdf).strip()
        if chuoi_path.startswith(("http://", "https://")):
            pdf_tam = tai_pdf_tu_url(chuoi_path)
            if not pdf_tam:
                logger.error("Không thể xử lý URL vì tải xuống thất bại.")
                return None, False
            return pdf_tam, True

        pdf_cuc_bo = Path(chuoi_path).resolve()
        if not pdf_cuc_bo.exists():
            logger.error("Lỗi: Không tìm thấy file tại đường dẫn: %s", pdf_cuc_bo)
            return None, False
        return pdf_cuc_bo, False

    def _trich_xuat_tai_lieu(self, pdf_path: Path) -> list[MauXetNghiem]:
        """Đọc PDF và duyệt qua từng trang để trích xuất dữ liệu."""
        cac_trang = []

        with pymupdf.open(pdf_path) as tai_lieu:
            for chi_so_trang in range(len(tai_lieu)):
                trang = tai_lieu.load_page(chi_so_trang)
                ket_qua_trang = self._trich_xuat_mot_trang(trang)
                cac_trang.append(ket_qua_trang)
        return cac_trang

    def _gom_theo_ma_so_mau(self, cac_trang: list[MauXetNghiem]) -> list[MauXetNghiem]:
        """Gộp các trang có cùng mã số mẫu thành một bản ghi duy nhất.

        Bỏ qua các trang không xác định được mã số mẫu. Khi trùng chỉ số giữa các
        trang cùng mã, trang xuất hiện sau sẽ ghi đè giá trị cũ.
        """
        cac_mau_gop: dict[str, MauXetNghiem] = {}
        for trang in cac_trang:
            if trang.ma_so_mau == MA_MAU_MAC_DINH:
                logger.debug("Bỏ qua trang không có mã số mẫu hợp lệ.")
                continue
            mau_hien_tai = cac_mau_gop.get(trang.ma_so_mau)
            if mau_hien_tai is None:
                cac_mau_gop[trang.ma_so_mau] = trang
            else:
                mau_hien_tai.ket_qua.update(trang.ket_qua)
        return list(cac_mau_gop.values())

    def _trich_xuat_mot_trang(self, trang: pymupdf.Page) -> MauXetNghiem:
        """Trích xuất chi tiết một trang PDF cụ thể."""
        van_ban_trang = trang.get_text()
        ma_so_mau = self._lay_ma_so_mau(van_ban_trang)

        cac_tu = trang.get_text("words")
        cac_dong = self._gom_tu_thanh_dong(cac_tu)

        # Trích xuất danh sách các cặp (tên_chỉ_số, kết_quả) dạng thô từ bảng
        cac_dong_tho = []
        for y_toa_do in sorted(cac_dong.keys()):
            cac_tu_dong = sorted(cac_dong[y_toa_do], key=lambda item: item[0])
            dong_phan_tich = self._phan_tich_dong_chi_so(cac_tu_dong)
            if dong_phan_tich:
                cac_dong_tho.append(dong_phan_tich)

        # Thực hiện so khớp ánh xạ sang các key phẳng và loại bỏ key thiếu
        dict_chi_so_phang = self._anh_xa_chi_so_phang(cac_dong_tho)

        return MauXetNghiem(
            ma_so_mau=ma_so_mau,
            ket_qua=dict_chi_so_phang
        )

    def _lay_ma_so_mau(self, van_ban: str) -> str:
        """Tìm mã số mẫu xét nghiệm bằng các mẫu Regex định nghĩa sẵn."""
        for bieu_thuc in (REGEX_MA_MAU, REGEX_SO_PHIEU):
            khop = re.search(bieu_thuc, van_ban, re.IGNORECASE)
            if khop:
                return khop.group(2).strip()
        return MA_MAU_MAC_DINH

    def _gom_tu_thanh_dong(self, cac_tu: list) -> dict[int, list[tuple[float, float, str]]]:
        """Nhóm các từ riêng lẻ dựa trên tọa độ Y thành từng dòng văn bản."""
        cac_dong: dict[int, list[tuple[float, float, str]]] = {}
        for tu in cac_tu:
            x0, y0, x1, y1, van_ban = tu[0], tu[1], tu[2], tu[3], tu[4]
            y_tam = round((y0 + y1) / 2)

            dong_da_co = None
            for y_dong in cac_dong.keys():
                if abs(y_dong - y_tam) < NGO_LENH_CUNG_DONG:
                    dong_da_co = y_dong
                    break

            if dong_da_co is not None:
                cac_dong[dong_da_co].append((x0, x1, van_ban))
            else:
                cac_dong[y_tam] = [(x0, x1, van_ban)]
        return cac_dong

    def _phan_tich_dong_chi_so(self, cac_tu_dong: list[tuple[float, float, str]]) -> tuple[str, str] | None:
        """Phân bổ từ vào các cột tương ứng và kiểm duyệt tính hợp lệ."""
        du_lieu_cot = self._phan_bo_tu_vao_cot(cac_tu_dong)
        ten_chi_so = du_lieu_cot["ten_chi_so"]
        ket_qua = du_lieu_cot["ket_qua"]

        if not (ten_chi_so and ket_qua):
            return None

        if not self._la_ket_qua_hop_le(ket_qua):
            return None

        # Nối chuỗi toàn bộ dòng để kiểm tra loại bỏ các hàng hành chính
        don_vi = du_lieu_cot["don_vi"]
        khoang_tham_chieu = du_lieu_cot["khoang_tham_chieu"]
        chuoi_toan_dong = f"{ten_chi_so} {ket_qua} {don_vi} {khoang_tham_chieu}".lower()

        if any(tu_khoa in chuoi_toan_dong for tu_khoa in TU_KHOA_LOAI_BO):
            return None

        if ten_chi_so.isdigit() and len(ten_chi_so) <= 2:
            return None

        return ten_chi_so, ket_qua

    def _phan_bo_tu_vao_cot(self, cac_tu_dong: list[tuple[float, float, str]]) -> dict[str, str]:
        """Tự động phân bổ các từ vào cột dựa trên định cấu hình tọa độ X."""
        tam_luu = {cot.ten_cot: [] for cot in CAC_COT}

        for x0, x1, van_ban in cac_tu_dong:
            x_tam = (x0 + x1) / 2.0
            for cot in CAC_COT:
                if cot.khoang_x[0] <= x_tam <= cot.khoang_x[1]:
                    tam_luu[cot.ten_cot].append(van_ban)
                    break

        return {ten_cot: " ".join(phong_bo).strip() for ten_cot, phong_bo in tam_luu.items()}

    def _la_ket_qua_hop_le(self, ket_qua: str) -> bool:
        """Xác thực kết quả là số hoặc chứa từ khóa chỉ định y khoa."""
        if re.search(r"\d", ket_qua):
            return True
        return any(tu_khoa in ket_qua.lower() for tu_khoa in TU_KHOA_KET_QUA_HOP_LE)

    def _anh_xa_chi_so_phang(self, cac_dong_tho: list[tuple[str, str]]) -> dict[str, str]:
        """Ánh xạ các tên chỉ số xét nghiệm thô sang key phẳng chuẩn hóa, bỏ key thiếu."""
        dict_phang = {}
        cac_gia_tri_gop: dict[str, list[str]] = {}

        for ten_raw, ket_qua in cac_dong_tho:
            ten_chuan = chuan_hoa_ten(ten_raw)

            # Gom các dòng thuộc chỉ số tổng hợp (vd tế bào nước tiểu) trước
            for key_muc_tieu, danh_sach_patterns in ANH_XA_GOP:
                if any(pat in ten_chuan for pat in danh_sach_patterns):
                    cac_gia_tri_gop.setdefault(key_muc_tieu, []).append(ket_qua)
                    break
            else:
                # Quét danh sách cấu hình để tìm key khớp đầu tiên
                for key_muc_tieu, danh_sach_patterns in ANH_XA_CHI_SO:
                    # Tránh ghi đè nếu key đó đã được lấy từ trước trong trang
                    if key_muc_tieu in dict_phang:
                        continue
                    # Khớp nếu bất kỳ pattern nào là chuỗi con của tên chuẩn hóa
                    if any(pat in ten_chuan for pat in danh_sach_patterns):
                        dict_phang[key_muc_tieu] = ket_qua
                        break

        # Tính giá trị tổng hợp cho các chỉ số gộp nhiều dòng
        for key_muc_tieu, cac_gia_tri in cac_gia_tri_gop.items():
            gia_tri_gop = self._cong_gia_tri_te_bao(cac_gia_tri)
            if gia_tri_gop is not None:
                dict_phang[key_muc_tieu] = gia_tri_gop

        # Chuẩn hóa các chỉ số nhị phân (glucose/protein nước tiểu) về Âm/Dương tính
        for key_nhi_phan in CAC_CHI_SO_NHI_PHAN:
            if key_nhi_phan in dict_phang:
                dict_phang[key_nhi_phan] = self._chuan_hoa_am_duong(dict_phang[key_nhi_phan])

        return dict_phang

    def _chuan_hoa_am_duong(self, ket_qua: str) -> str:
        """Chuẩn hóa giá trị về 'Dương tính' nếu chứa 'dương' hoặc có số, ngược lại 'Âm tính'."""
        if "dương" in ket_qua.lower():
            return "Dương tính"
        if re.search(r"\d", ket_qua):
            return "Dương tính"
        return "Âm tính"

    def _cong_gia_tri_te_bao(self, cac_gia_tri: list[str]) -> str | None:
        """Cộng các giá trị tế bào nước tiểu; 'Âm tính' coi như 0, không có dòng thì None."""
        if not cac_gia_tri:
            return None

        tong = 0.0
        for gia_tri in cac_gia_tri:
            gia_tri_so = self._ep_gia_tri_so(gia_tri)
            if gia_tri_so is not None:
                tong += gia_tri_so

        # Kết quả nguyên thì bỏ phần thập phân, ngược lại giữ tối đa 1 số lẻ
        if tong.is_integer():
            return str(int(tong))
        return f"{tong:.1f}".rstrip('0').rstrip('.')

    def _ep_gia_tri_so(self, gia_tri: str) -> float | None:
        """Chuyển giá trị chữ sang số; 'Âm tính' coi như 0, không chuyển được thì None."""
        if "âm tính" in gia_tri.lower() or "không" in gia_tri.lower():
            return 0.0
        try:
            return float(gia_tri)
        except ValueError:
            return None

    def _luu_file_json(self, cac_trang: list[MauXetNghiem]) -> None:
        """Ghi đè kết quả trích xuất cấu trúc vào tệp tin JSON."""
        duong_dan_json = self.thu_muc_ket_qua / TEN_FILE_KET_QUA
        du_lieu_json = [trang.to_dict() for trang in cac_trang]

        with open(duong_dan_json, "w", encoding="utf-8") as f:
            json.dump(du_lieu_json, f, ensure_ascii=False, indent=4)

        logger.info("Đã ghi thành công kết quả trích xuất vào: %s", duong_dan_json)
