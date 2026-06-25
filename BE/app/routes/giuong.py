from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.giuong import giuong_crud
from app.database.benh_an import BenhAn
from app.database.buong import Buong
from app.database.giuong import Giuong
from app.database.quan_nhan import QuanNhan
from app.database.session import get_db
from app.routes.base import _run_crud
from app.schemas.giuong import GiuongCreate, GiuongUpdate


router = APIRouter(prefix="/giuong", tags=["giuong"])


@router.get(
    "/trong",
    dependencies=[Depends(require_permissions("giuong:read"))],
)
def get_giuong_trong(ma_buong: str = Query(...), db: Session = Depends(get_db)):
    records = (
        db.query(Giuong)
        .filter(Giuong.ma_buong == ma_buong, Giuong.trang_thai == "trống")
        .all()
    )
    result = [{c.key: getattr(g, c.key) for c in inspect(Giuong).columns} for g in records]
    return {"data": result, "total": len(result)}


@router.get(
    "",
    dependencies=[Depends(require_permissions("giuong:read"))],
)
def list_giuong(
    db: Session = Depends(get_db),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    sort_by: str | None = Query(default=None),
    sort_desc: bool = Query(default=False),
    ma_buong: str | None = Query(default=None),
):
    query = db.query(Giuong)
    if ma_buong:
        query = query.filter(Giuong.ma_buong == ma_buong)
    if sort_by:
        col = getattr(Giuong, sort_by, None)
        if col:
            query = query.order_by(col.desc() if sort_desc else col.asc())
    else:
        query = query.order_by(Giuong.ten_giuong)
    total = query.count()
    records = query.offset(offset).limit(limit).all()
    data = [{c.key: getattr(g, c.key) for c in inspect(Giuong).columns} for g in records]
    return {"data": data, "total": total}


@router.get(
    "/{item_id}",
    dependencies=[Depends(require_permissions("giuong:read"))],
)
def get_giuong(item_id: str, db: Session = Depends(get_db)):
    item = _run_crud(lambda: giuong_crud.get(db, item_id))
    return {c.key: getattr(item, c.key) for c in inspect(Giuong).columns}


@router.patch(
    "/{item_id}",
    dependencies=[Depends(require_permissions("giuong:update"))],
)
def update_giuong(
    item_id: str,
    payload: GiuongUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return _run_crud(lambda: giuong_crud.update(db, item_id, payload, nguoi_dung_id=current_user.id))


@router.post(
    "",
    dependencies=[Depends(require_permissions("giuong:create"))],
    status_code=201,
)
def create_giuong(
    payload: GiuongCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return _run_crud(lambda: giuong_crud.create(db, payload, nguoi_dung_id=current_user.id))


@router.delete(
    "/{item_id}",
    dependencies=[Depends(require_permissions("giuong:delete"))],
    status_code=204,
)
def delete_giuong(
    item_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _run_crud(lambda: giuong_crud.delete(db, item_id, nguoi_dung_id=current_user.id))


@router.get(
    "/quan-ly/phong",
    dependencies=[Depends(require_permissions("giuong:read"))],
)
def list_giuong_quan_ly(
    db: Session = Depends(get_db),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    ma_buong: str | None = Query(default=None),
):
    query = (
        db.query(Giuong, Buong.ten_buong, BenhAn.ma_benh_an, QuanNhan.ho_ten)
        .join(Buong, Giuong.ma_buong == Buong.ma_buong)
        .outerjoin(BenhAn, (BenhAn.ma_giuong == Giuong.ma_giuong) & (BenhAn.trang_thai == "đang_điều_trị"))
        .outerjoin(QuanNhan, BenhAn.ma_quan_nhan == QuanNhan.ma_quan_nhan)
    )
    if ma_buong:
        query = query.filter(Giuong.ma_buong == ma_buong)
    query = query.order_by(Buong.ten_buong, Giuong.ten_giuong)

    total = query.count()
    records = query.offset(offset).limit(limit).all()
    data = []
    for g, ten_buong, ma_benh_an, ho_ten in records:
        data.append({
            "ma_giuong": g.ma_giuong,
            "ten_giuong": g.ten_giuong,
            "ma_buong": g.ma_buong,
            "ten_buong": ten_buong,
            "trang_thai": g.trang_thai,
            "ma_benh_an": ma_benh_an,
            "ho_ten_benh_nhan": ho_ten,
        })
    return {"data": data, "total": total}


@router.post(
    "/{item_id}/chuyen",
    dependencies=[Depends(require_permissions("giuong:update"))],
)
def chuyen_giuong(
    item_id: str,
    data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    ma_giuong_moi = data.get("ma_giuong_moi")
    if not ma_giuong_moi:
        raise HTTPException(400, detail="Thiếu ma_giuong_moi")

    ba = db.query(BenhAn).filter(
        BenhAn.ma_giuong == item_id,
        BenhAn.trang_thai == "đang_điều_trị",
    ).first()
    if not ba:
        raise HTTPException(400, detail="Không tìm thấy bệnh nhân trên giường này.")

    giuong_moi = db.query(Giuong).filter(Giuong.ma_giuong == ma_giuong_moi).first()
    if not giuong_moi:
        raise HTTPException(404, detail="Giường mới không tồn tại.")
    if giuong_moi.trang_thai != "trống":
        raise HTTPException(400, detail="Giường mới đã có người.")

    giuong_cu = db.query(Giuong).filter(Giuong.ma_giuong == item_id).first()
    if giuong_cu:
        giuong_cu.trang_thai = "trống"

    giuong_moi.trang_thai = "có người"
    ba.ma_buong = giuong_moi.ma_buong
    ba.ma_giuong = ma_giuong_moi
    db.commit()
    db.refresh(ba)

    return {"message": "Chuyển giường thành công", "ma_benh_an": ba.ma_benh_an}
