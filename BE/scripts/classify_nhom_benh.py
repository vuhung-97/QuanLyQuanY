"""Script phân loại nhóm bệnh cho dữ liệu cũ (benh_an, kham_benh) chưa có ma_nhom_benh."""

import sys
sys.path.insert(0, ".")

from sqlalchemy import text
from app.database.session import SessionLocal


KEYWORD_RULES = [
    (["viêm họng", "viêm hong", "đau họng", "ho", "khó thở", "hen", "viêm phổi"], "VIII"),
    (["viêm dạ dày", "đau dạ dày", "ợ chua", "loét lưỡi", "nôn", "tiêu chảy"], "IX"),
    (["dị ứng", "mẩn ngứa", "phát ban", "ngứa", "nổi hạch"], "X"),
    (["sốt", "cảm nắng", "cảm", "virus", "vi rus", "say nắng"], "I"),
    (["đau đầu", "chóng mặt", "bồn chồn", "lo âu", "run rẩy", "tê"], "IV"),
    (["đái buốt", "tiết niệu"], "XII"),
    (["tay chân lạnh", "tim", "huyết áp"], "VII"),
    (["thay đổi tâm trạng", "tâm thần"], "III"),
    (["mệt mỏi", "uể oải", "mất nước", "teo cơ", "tăng cân", "đổ mồ hôi"], "XIV"),
]


def classify(text_val: str | None) -> str:
    if not text_val:
        return "XIV"
    text_lower = text_val.lower()
    for keywords, nhom in KEYWORD_RULES:
        for kw in keywords:
            if kw in text_lower:
                return nhom
    return "XIV"


def update_records():
    db = SessionLocal()
    try:
        tables = [
            ("benh_an", "ma_benh_an", "chan_doan", "ly_do_nhap_vien"),
            ("kham_benh", "ma_kham_benh", "chan_doan", "trieu_chung"),
        ]
        total_updated = 0
        for table, pk, col1, col2 in tables:
            rows = db.execute(
                text(f"SELECT {pk}, {col1}, {col2} FROM {table} WHERE ma_nhom_benh IS NULL")
            ).fetchall()
            for row in rows:
                nhom = classify(row[1]) or classify(row[2]) or "XIV"
                db.execute(
                    text(f"UPDATE {table} SET ma_nhom_benh = :nhom WHERE {pk} = :id"),
                    {"nhom": nhom, "id": row[0]},
                )
                total_updated += 1

            if rows:
                print(f"{table}: {len(rows)} records updated")

        db.commit()
        print(f"\nTotal: {total_updated} records updated")

        for table, pk, col1, col2 in tables:
            remaining = db.execute(
                text(f"SELECT COUNT(*) FROM {table} WHERE ma_nhom_benh IS NULL")
            ).scalar()
            if remaining:
                print(f"WARNING: {table} still has {remaining} records without nhom")

    finally:
        db.close()


if __name__ == "__main__":
    update_records()
