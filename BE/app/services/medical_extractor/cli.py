"""Giao diện dòng lệnh (CLI) cho hệ thống trích xuất dữ liệu PDF xét nghiệm."""

import argparse
import json
import logging
import sys

from .extractor import ExtractorPDF

# Cấu hình logging cơ bản cho console
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)


def main() -> None:
    """Entrypoint chính của chương trình khi chạy từ CLI."""
    # Khắc phục lỗi encoding Tiếng Việt trên Windows console
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')

    trinh_phan_tich = argparse.ArgumentParser(
        description="Trích xuất cấu trúc dữ liệu bảng xét nghiệm y khoa từ tệp PDF trực tiếp bằng tọa độ."
    )
    trinh_phan_tich.add_argument(
        "duong_dan",
        nargs="?",
        help="Đường dẫn đến tệp PDF cục bộ hoặc liên kết URL mạng.",
    )

    cac_doi_so = trinh_phan_tich.parse_args()
    duong_dan = cac_doi_so.duong_dan

    # Tương thích ngược với cơ chế nhập thủ công khi chạy trực tiếp không tham số
    if not duong_dan:
        try:
            duong_dan = input("Nhập đường dẫn tệp PDF hoặc URL mạng: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nĐã hủy thao tác.")
            sys.exit(0)

    if not duong_dan:
        print("Lỗi: Đường dẫn trống. Không thể tiến hành xử lý.")
        sys.exit(1)

    bo_trich_xuat = ExtractorPDF()
    ket_qua = bo_trich_xuat.trich_xuat_ket_qua(duong_dan)
    print(json.dumps(ket_qua, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
