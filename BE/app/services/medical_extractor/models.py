"""Mô hình dữ liệu kết quả xét nghiệm y khoa."""

from dataclasses import dataclass, field


@dataclass
class MauXetNghiem:
    """Đại diện cho một mẫu kết quả xét nghiệm gồm danh sách các dòng bảng."""

    ma_so_mau: str
    ket_qua: list[dict[str, str]] = field(default_factory=list)

    def to_dict(self) -> dict:
        """Trả về cấu trúc JSON có mã số mẫu tách biệt với danh sách các dòng."""
        return {
            "ma_so_mau": self.ma_so_mau,
            "ket_qua": self.ket_qua,
        }
