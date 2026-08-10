"""Logic tải tệp tin PDF an toàn từ môi trường mạng."""

import logging
import tempfile
import urllib.request
from pathlib import Path

logger = logging.getLogger(__name__)


def tai_pdf_tu_url(url: str) -> Path | None:
    """Tải file PDF từ URL được chỉ định và lưu vào tệp tạm thời hệ thống.

    Tránh ô nhiễm thư mục làm việc và tránh thay đổi cấu hình opener toàn cục.
    """
    logger.info("Đang tải PDF từ URL: %s...", url)
    try:
        # Xây dựng trình mở kết nối cục bộ thay vì thay đổi opener mặc định hệ thống
        trinh_mo = urllib.request.build_opener()
        trinh_mo.addheaders = [("User-agent", "Mozilla/5.0")]

        # Tạo file tạm thời với tiền tố rõ ràng để tránh xung đột tên tệp
        tep_tam = tempfile.NamedTemporaryFile(
            delete=False, suffix=".pdf", prefix="tai_pdf_ocr_"
        )
        duong_dan_tam = Path(tep_tam.name)
        tep_tam.close()

        # Thực hiện đọc và ghi nội dung luồng dữ liệu
        with trinh_mo.open(url) as phan_hoi:
            with open(duong_dan_tam, "wb") as f:
                f.write(phan_hoi.read())

        logger.info("Tải file từ URL thành công!")
        return duong_dan_tam

    except Exception as e:
        logger.error("Lỗi khi tải PDF từ URL: %s", e)
        return None
