"""Cấu hình hằng số của hệ thống trích xuất dữ liệu xét nghiệm."""

from dataclasses import dataclass


@dataclass(frozen=True)
class CotXetNghiem:
    """Mô tả tọa độ giới hạn X của một cột dữ liệu."""

    ten_cot: str
    khoang_x: tuple[float, float]


# Định nghĩa các cột của bảng kết quả xét nghiệm
CAC_COT = (
    CotXetNghiem("ten_chi_so", (45.0, 220.0)),
    CotXetNghiem("ket_qua", (225.0, 275.0)),
    CotXetNghiem("don_vi", (280.0, 325.0)),
    CotXetNghiem("khoang_tham_chieu", (350.0, 480.0)),
)

# Ngưỡng lệch tọa độ Y tối đa để tính cùng dòng (pixel)
NGO_LENH_CUNG_DONG = 3

# Các từ khóa kết quả hợp lệ dạng chữ
TU_KHOA_KET_QUA_HOP_LE = (
    "âm tính",
    "dương tính",
    "vết",
    "đục",
    "trong",
    "vàng",
    "hồng",
    "đỏ",
    "neg",
    "pos",
    "normal",
    "trace",
    "clear",
    "n/a",
    "không",
)

# Các từ khóa hành chính hoặc tiêu đề cần loại bỏ khỏi bảng kết quả
TU_KHOA_LOAI_BO = (
    "yêu cầu",
    "chỉ số",
    "bệnh nhân",
    "bác sĩ",
    "ngày",
    "địa chỉ",
    "mã số",
    "số phiếu",
    "chất lượng",
    "phiếu kết quả",
    "tối khẩn",
    "chẩn đoán",
    "loại bệnh phẩm",
    "thời gian",
    "đối tượng",
    "khoa xét nghiệm",
    "đơn vị y tế",
)

# Các biểu thức chính quy để trích xuất Mã số mẫu / Số phiếu
REGEX_MA_MAU = r"(Mã số mẫu|Mã số mấu|Mã s mu|Mã mẫu)[:\s\n]+([A-Z0-9\-]+)"
REGEX_SO_PHIEU = r"(Số phiếu|Số phiu|SID)[:\s\n]+([A-Z0-9\-]+)"

# Giá trị mặc định cho dữ liệu trống
GIA_TRI_MAC_DINH = "N/A"
MA_MAU_MAC_DINH = "Không xác định"
TEN_FILE_KET_QUA = "ket_qua_xet_nghiem.json"
KHOA_FILE_TAM = "downloaded_temp"
KHOA_URL_PDF = "url_pdf"

# Định nghĩa bảng ánh xạ từ chỉ số xét nghiệm sang key JSON phẳng
ANH_XA_CHI_SO = (
    ("alt",                ("do hoat do alt", "alt gpt", "alt")),
    ("ast",                ("do hoat do ast", "ast got", "ast")),
    ("ure",                ("dinh luong ure", "ure [mau]", "ure")),
    ("bach_cau",           ("so luong bach cau",)),
    ("hong_cau",           ("so luong hong cau",)),
    ("tieu_cau",           ("so luong tieu cau",)),
    ("creatinin",          ("dinh luong creatinin",)),
    ("glucose_mau",        ("glucose [mau]", "dinh luong glucose")),
    ("nuoc_tieu_glucose",  ("glucose (glu)",)),
    ("nuoc_tieu_protein",  ("protein (pro)",)),
)

# Các chỉ số tính gộp từ nhiều dòng: key -> (các pattern dòng con)
ANH_XA_GOP = (
    ("nuoc_tieu_te_bao", ("bach cau (leu)")),
)

# Các chỉ số nước tiểu chỉ nhận giá trị Âm tính / Dương tính
CAC_CHI_SO_NHI_PHAN = ("nuoc_tieu_glucose", "nuoc_tieu_protein")

import unicodedata
import re

def chuan_hoa_ten(ten: str) -> str:
    """Chuẩn hóa tên chỉ số để so khớp: chuyển chữ thường, bỏ dấu tiếng Việt, giữ chữ và số."""
    if not ten:
        return ""
    # Chuyển về dạng NFD để tách các ký tự dấu ra khỏi chữ cái gốc
    ten_nfd = unicodedata.normalize('NFD', ten.lower())
    # Loại bỏ các ký tự dấu (combining marks)
    ten_khong_dau = "".join(c for c in ten_nfd if not unicodedata.combining(c))
    # Thay đổi chữ 'đ' thành 'd' vì NFD không phân rã được ký tự này
    ten_khong_dau = ten_khong_dau.replace('đ', 'd')
    # Thay thế các ký tự không phải chữ và số thành khoảng trắng, sau đó rút gọn khoảng trắng thừa
    ten_sach = re.sub(r'[^a-z0-9\s\[\]\(\)]', ' ', ten_khong_dau)
    return " ".join(ten_sach.split())

