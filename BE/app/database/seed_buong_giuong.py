import sys
sys.path.insert(0, '.')

from sqlalchemy import text

from app.database.base import Base
from app.database.session import SessionLocal
from app.services.id_helper import generate_id


BUONG = [
    {"ten_buong": "101", "so_giuong_toi_da": 4},
    {"ten_buong": "102", "so_giuong_toi_da": 4},
    {"ten_buong": "103", "so_giuong_toi_da": 4},
]

GIUONG_TEN = ["A", "B", "C", "D"]


def seed():
    db = SessionLocal()
    try:
        existing = db.execute(text("SELECT count(*) FROM buong")).scalar()
        if existing and existing > 0:
            print("Buong already seeded, skipping.")
            return

        from app.database.buong import Buong
        from app.database.giuong import Giuong

        for b in BUONG:
            buong = Buong(**b)
            db.add(buong)
            db.flush()
            for gt in GIUONG_TEN:
                giuong = Giuong(ma_buong=buong.ma_buong, ten_giuong=gt, trang_thai="trống")
                db.add(giuong)
        db.commit()
        print("Seeded 3 buong x 4 giuong = 12 beds")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
