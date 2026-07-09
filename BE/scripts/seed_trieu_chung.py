import json
import sys

sys.path.insert(0, ".")

from app.database.session import SessionLocal
from app.database.dm_trieu_chung import DmTrieuChung


def seed():
    db = SessionLocal()
    try:
        with open("../FE/src/data/trieu_chung.json", encoding="utf-8") as f:
            items = json.load(f)
        count = 0
        for ten in items:
            exists = (
                db.query(DmTrieuChung)
                .filter(DmTrieuChung.ten_trieu_chung == ten)
                .first()
            )
            if not exists:
                row = DmTrieuChung(ten_trieu_chung=ten, mo_ta=ten)
                db.add(row)
                count += 1
        if count > 0:
            db.commit()
        print(f"Seeded {count} trieu chung")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
