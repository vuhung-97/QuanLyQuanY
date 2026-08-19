"""Bộ trích xuất dữ liệu xét nghiệm y tế chính."""

import logging
import re
from pathlib import Path
import pymupdf

from .config import (
    CAC_COT,
    CHI_SO_COT_BANG,
    MA_MAU_MAC_DINH,
    NGO_LENH_CUNG_DONG,
    REGEX_MA_MAU,
    REGEX_SO_PHIEU,
    TU_KHOA_BAT_DAU_BANG,
    TU_KHOA_KET_THUC_BANG,
)
from .downloader import tai_pdf_tu_url
from .models import MauXetNghiem


def gop_ket_qua(ket_qua_hien_tai, ket_qua_moi):
    """Gộp hai danh sách dòng kết quả, khử trùng theo cột ``yeu_cau``.

    Dòng cùng chỉ số (chuẩn hóa: bỏ hoa/thường, khoảng trắng thừa) chỉ giữ
    bản xuất hiện sau cùng; thứ tự giữ theo lần xuất hiện đầu tiên. Các chỉ
    số khác nhau từ nhiều trang/file đều được giữ lại.
    """
    ket_qua_gop: dict[str, dict] = {}
    for dong in list(ket_qua_hien_tai or []) + list(ket_qua_moi or []):
        if not isinstance(dong, dict):
            continue
        yeu_cau = (dong.get("yeu_cau") or "").strip().lower()
        ket_qua_gop[yeu_cau] = dong
    return list(ket_qua_gop.values())

logger = logging.getLogger(__name__)

# Mảnh chữ tiêu đề dính đầu cell (một chữ cái in hoa đứng lẻ trước nội dung)
_MAU_CHU_COT = re.compile(
    r"^[A-ZÀÁẢÃẠĂẮẰẲẤẦẨẪẬÂĐÈÉẸẺẼÊẾỀỂỄỆÌÍỊĨÓỌÕÔỐỒỔỖỘƠỚỜỞỠỢÙÚỤŨƯỨỪỬỮỰỲÝỴỶỸỶỲỴ] (?=\S)"
)
# Cell chỉ còn đúng một chữ cái (mảnh rác của tiêu đề)
_MAU_CHU_DON = re.compile(
    r"^[A-ZÀÁẢÃẠĂẮẰẲẤẦẨẪẬÂĐÈÉẸẺẼÊẾỀỂỄỆÌÍỊĨÓỌÕÔỐỒỔỖỘƠỚỜỞỠỢÙÚỤŨƯỨỪỬỮỰỲÝỴỶỸỶỲỴ]$"
)


class ExtractorPDF:
    """Lớp xử lý trích xuất dữ liệu phiếu xét nghiệm y tế từ file PDF."""

    def trich_xuat_ket_qua(self, duong_dan_pdf: str | Path) -> list[dict]:
        """Trích xuất danh sách kết quả xét nghiệm, trả về list dict trực tiếp.

        Mỗi phần tử có cấu trúc ``{"ma_so_mau": str, "ket_qua": list[dict]}``.
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

        Bỏ qua các trang không xác định được mã số mẫu. Các dòng của các trang
        cùng mã được gộp lại theo thứ tự xuất hiện, khử trùng theo chỉ số
        (giữ bản sau cùng nếu cùng chỉ số nhưng giá trị khác nhau).
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
                mau_hien_tai.ket_qua = gop_ket_qua(
                    mau_hien_tai.ket_qua, trang.ket_qua
                )
        return list(cac_mau_gop.values())

    def _trich_xuat_mot_trang(self, trang: pymupdf.Page) -> MauXetNghiem:
        """Trích xuất chi tiết một trang PDF cụ thể."""
        van_ban_trang = trang.get_text()
        ma_so_mau = self._lay_ma_so_mau(van_ban_trang)

        # Ưu tiên đọc theo cell của bảng (lưới khung): mỗi ô là một cell,
        # chữ xuống dòng trong cùng cell được gộp lại thành một chuỗi.
        cac_dong_bang = self._trich_xuat_bang_theo_cell(trang)

        if not cac_dong_bang:
            # Fallback: không nhận diện được lưới bảng → đọc theo dòng từ.
            cac_tu = trang.get_text("words")
            cac_dong = self._gom_tu_thanh_dong(cac_tu)

            cac_dong_ket_qua = []
            for y_toa_do in sorted(cac_dong.keys()):
                cac_tu_dong = sorted(cac_dong[y_toa_do], key=lambda item: item[0])
                cac_dong_ket_qua.append((y_toa_do, self._tao_dong_ket_qua(cac_tu_dong)))

            cac_dong_bang = self._loc_phan_vung_bang(cac_dong_ket_qua)

        return MauXetNghiem(
            ma_so_mau=ma_so_mau,
            ket_qua=self._loc_cac_dong_du_lieu(cac_dong_bang)
        )

    def _trich_xuat_bang_theo_cell(self, trang: pymupdf.Page) -> list[dict]:
        """Đọc bảng theo cell dựa trên lưới khung do PyMuPDF nhận diện.

        Mỗi hàng bảng thành một dict 7 cột theo CHI_SO_COT_BANG. Nội dung
        nhiều dòng trong cùng một cell được gộp lại thành chuỗi.
        """
        try:
            cac_bang = trang.find_tables().tables
        except Exception:
            return []

        cac_dong = []
        for bang in cac_bang:
            for dong in bang.extract() or []:
                dung_luong = {cot.ten_cot: "" for cot in CAC_COT}
                for i, cot in enumerate(CAC_COT):
                    chi_so = CHI_SO_COT_BANG[i]
                    if chi_so < len(dong) and dong[chi_so]:
                        dung_luong[cot.ten_cot] = self._lam_sach_cell(
                            " ".join(str(dong[chi_so]).split())
                        )
                cac_dong.append(dung_luong)
        return cac_dong

    @staticmethod
    def _lam_sach_cell(noi_dung: str) -> str:
        """Bỏ mảnh chữ tiêu đề (một chữ cái lẻ) dính vào đầu cell."""
        noi_dung = noi_dung.strip()
        while _MAU_CHU_COT.search(noi_dung):
            noi_dung = _MAU_CHU_COT.sub("", noi_dung, count=1).strip()
        if _MAU_CHU_DON.search(noi_dung):
            return ""
        return noi_dung

    def _loc_cac_dong_du_lieu(self, cac_dong: list[dict]) -> list[dict]:
        """Chỉ giữ các dòng dữ liệu thật của bảng.

        Bỏ khối tiêu đề phía trên (dòng tiêu đề cột, nhãn nhóm như "Huyết học",
        tiêu đề phụ "Tổng phân tích..."), dòng trống và khối chân trang.
        """
        vi_tri_bat_dau = None
        for chi_so, dong in enumerate(cac_dong):
            yeu_cau = (dong.get("yeu_cau") or "").strip().lower()
            ket_qua = (dong.get("ket_qua") or "").strip()
            if not yeu_cau or not ket_qua:
                continue
            if any(tu_khoa in yeu_cau for tu_khoa in TU_KHOA_BAT_DAU_BANG):
                continue
            if "tổng phân tích" in yeu_cau:
                continue
            vi_tri_bat_dau = chi_so
            break

        if vi_tri_bat_dau is None:
            vi_tri_bat_dau = 0

        cac_dong_loc = []
        for dong in cac_dong[vi_tri_bat_dau:]:
            if not any((dong.get(cot.ten_cot) or "").strip() for cot in CAC_COT):
                continue
            chuoi_dong = " ".join(dong.values()).lower()
            if any(tu_khoa in chuoi_dong for tu_khoa in TU_KHOA_KET_THUC_BANG):
                break
            cac_dong_loc.append(dong)
        return cac_dong_loc

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

    def _tao_dong_ket_qua(self, cac_tu_dong: list[tuple[float, float, str]]) -> dict[str, str]:
        """Phân bổ từ vào các cột và trả về nguyên một dòng dữ liệu bảng.

        Không thực hiện lọc nội dung: giữ mọi dòng có từ, các cột không có
        nội dung sẽ có giá trị chuỗi rỗng.
        """
        du_lieu_cot = self._phan_bo_tu_vao_cot(cac_tu_dong)
        return {cot.ten_cot: du_lieu_cot[cot.ten_cot] for cot in CAC_COT}

    def _loc_phan_vung_bang(
        self, cac_dong: list[tuple[int, dict[str, str]]]
    ) -> list[dict[str, str]]:
        """Giới hạn về vùng nội dung bảng: bỏ meta phía trên và chân trang.

        Vùng bảng bắt đầu từ dòng tiêu đề (chứa từ khóa "yêu cầu xét nghiệm")
        và kết thúc trước dòng đầu tiên chứa từ khóa chân trang. Nếu không tìm
        thấy mốc bắt đầu, giữ nguyên toàn bộ các dòng.
        """
        vi_tri_bat_dau = None
        for chi_so, (_, dong) in enumerate(cac_dong):
            if any(
                tu_khoa in dong["yeu_cau"].lower()
                for tu_khoa in TU_KHOA_BAT_DAU_BANG
            ):
                vi_tri_bat_dau = chi_so
                break

        if vi_tri_bat_dau is None:
            return [dong for _, dong in cac_dong]

        vi_tri_ket_thuc = len(cac_dong)
        for chi_so in range(vi_tri_bat_dau + 1, len(cac_dong)):
            _, dong = cac_dong[chi_so]
            chuoi_dong = " ".join(dong.values()).lower()
            if any(tu_khoa in chuoi_dong for tu_khoa in TU_KHOA_KET_THUC_BANG):
                vi_tri_ket_thuc = chi_so
                break

        return [dong for _, dong in cac_dong[vi_tri_bat_dau:vi_tri_ket_thuc]]

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
