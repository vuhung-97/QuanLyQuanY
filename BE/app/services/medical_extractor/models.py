"""Mô hình dữ liệu kết quả xét nghiệm y khoa."""

from dataclasses import dataclass, field


@dataclass
class MauXetNghiem:
    """Đại diện cho một mẫu kết quả xét nghiệm phẳng, định dạng theo yêu cầu mới."""

    ma_so_mau: str
    ket_qua: dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> dict:
        """Trả về cấu trúc JSON có mã số mẫu tách biệt với các chỉ số phẳng."""
        return {
            "ma_so_mau": self.ma_so_mau,
            "ket_qua": self.ket_qua,
        }
