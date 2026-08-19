"""Cấu hình hằng số của hệ thống trích xuất dữ liệu xét nghiệm."""

from dataclasses import dataclass


@dataclass(frozen=True)
class CotXetNghiem:
    """Mô tả tọa độ giới hạn X của một cột dữ liệu."""

    ten_cot: str
    khoang_x: tuple[float, float]


# Định nghĩa các cột giữ lại của bảng kết quả xét nghiệm.
# Bảng PDF gồm 8 cột: STT | Yêu cầu xét nghiệm | Kết quả xét nghiệm | Đơn vị |
# Ghi chú | Khoảng tham chiếu | QTKT | Máy xét nghiệm. Cột STT bị bỏ.
# Khoảng X chỉ dùng cho đường đọc fallback (không có lưới bảng).
CAC_COT = (
    CotXetNghiem("yeu_cau", (45.0, 220.0)),
    CotXetNghiem("ket_qua", (225.0, 275.0)),
    CotXetNghiem("don_vi", (280.0, 325.0)),
    CotXetNghiem("ghi_chu", (335.0, 360.0)),
    CotXetNghiem("khoang_tham_chieu", (360.0, 462.0)),
    CotXetNghiem("qtkt", (462.0, 512.0)),
    CotXetNghiem("may_xet_nghiem", (512.0, 590.0)),
)

# Ánh xạ chỉ số cột của bảng PDF (0 = STT, bị bỏ) sang thứ tự CAC_COT.
# Dùng cho đường đọc theo cell (find_tables) vì thứ tự cột nhất quán ở
# các phiếu: STT | Yêu cầu | Kết quả | Đơn vị | Ghi chú | Khoảng tham chiếu | QTKT | Máy.
CHI_SO_COT_BANG = (1, 2, 3, 4, 5, 6, 7)

# Ngưỡng lệch tọa độ Y tối đa để tính cùng dòng (pixel)
NGO_LENH_CUNG_DONG = 3

# Từ khóa đánh dấu dòng tiêu đề bảng: từ dòng này (theo chiều từ trên xuống)
# trở đi là vùng nội dung bảng, bỏ qua khối thông tin bệnh nhân phía trên.
TU_KHOA_BAT_DAU_BANG = ("yêu cầu xét nghiệm",)

# Từ khóa đánh dấu bắt đầu khối chân trang (chữ ký / ghi chú dưới bảng):
# các dòng từ đây trở đi bị bỏ qua.
TU_KHOA_KET_THUC_BANG = (
    "trả kết quả",
    "người xem xét",
    "phụ trách",
    "kết quả in đậm",
)

# Các biểu thức chính quy để trích xuất Mã số mẫu / Số phiếu
REGEX_MA_MAU = r"(Mã số mẫu|Mã số mấu|Mã s mu|Mã mẫu)[:\s\n]+([A-Z0-9\-]+)"
REGEX_SO_PHIEU = r"(Số phiếu|Số phiu|SID)[:\s\n]+([A-Z0-9\-]+)"

# Giá trị mặc định cho dữ liệu trống
MA_MAU_MAC_DINH = "Không xác định"
