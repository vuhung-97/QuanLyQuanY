from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permissions
from app.crud.lich_kham_sk_nam import lich_kham_sk_nam_crud
from app.database.lich_kham_sk_nam import LichKhamSkNam
from app.database.lich_kham_sk_nam_chi_tiet import LichKhamSkNamChiTiet
from app.database.nhat_ky_thao_tac import NhatKyThaoTac
from app.database.phan_cong_nhiem_vu import PhanCongNhiemVu
from app.database.session import get_db
from app.routes.base import create_crud_router, _resolve_schema
from app.schemas.lich_kham_sk_nam import LichKhamSkNamCreate, LichKhamSkNamReplace
from app.services.id_helper import generate_id

pre_router = APIRouter()

read_schema = _resolve_schema("lich_kham_sk_nam", "Read")

create_deps = [Depends(require_permissions("lich_kham_sk_nam:create"))]
update_deps = [Depends(require_permissions("lich_kham_sk_nam:update"))]
delete_deps = [Depends(require_permissions("lich_kham_sk_nam:delete"))]


_LOG_SKIP = {"nhat_ky_thao_tac", "nhat_ky_dang_nhap", "nhat_ky_backup"}


def _validate_detail_dates_raw(
    master_tg_bd, master_tg_kt,
    detail_tg_bd, detail_tg_kt,
    ma_don_vi: str = "",
    label: str = "",
) -> None:
    if not master_tg_bd or not master_tg_kt:
        return
    tag = f" (đơn vị {ma_don_vi})" if ma_don_vi else ""
    lbl = f" {label}" if label else ""
    if detail_tg_bd and detail_tg_bd < master_tg_bd:
        raise HTTPException(
            status_code=400,
            detail=f"Thời gian bắt đầu{lbl} ({detail_tg_bd}){tag} không được trước thời gian bắt đầu{lbl} của lịch năm ({master_tg_bd})."
        )
    if detail_tg_kt and detail_tg_kt > master_tg_kt:
        raise HTTPException(
            status_code=400,
            detail=f"Thời gian kết thúc{lbl} ({detail_tg_kt}){tag} không được sau thời gian kết thúc{lbl} của lịch năm ({master_tg_kt})."
        )


def _create_audit_log(db: Session, hanh_dong: str, ten_bang: str,
                      nguoi_dung_id: str, du_lieu_cu=None, du_lieu_moi=None):
    if ten_bang in _LOG_SKIP:
        return
    db.add(NhatKyThaoTac(
        id_nguoi_dung=nguoi_dung_id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong=hanh_dong,
        ten_bang=ten_bang,
        du_lieu_cu=du_lieu_cu,
        du_lieu_moi=du_lieu_moi,
    ))


@pre_router.post("", dependencies=create_deps,
                 status_code=status.HTTP_201_CREATED, response_model=read_schema)
def create_lich_kham_batch(
    payload: LichKhamSkNamCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    for d in payload.details:
        _validate_detail_dates_raw(
            payload.thoi_gian_bat_dau, payload.thoi_gian_ket_thuc,
            d.thoi_gian_bat_dau, d.thoi_gian_ket_thuc,
            d.ma_don_vi, "khám"
        )
        _validate_detail_dates_raw(
            payload.thoi_gian_lay_mau_bat_dau, payload.thoi_gian_lay_mau_ket_thuc,
            d.thoi_gian_lay_mau_bat_dau, d.thoi_gian_lay_mau_ket_thuc,
            d.ma_don_vi, "lấy máu"
        )
        _validate_detail_dates_raw(
            payload.thoi_gian_du_tru_lay_mau_bat_dau, payload.thoi_gian_du_tru_lay_mau_ket_thuc,
            d.thoi_gian_du_tru_lay_mau_bat_dau, d.thoi_gian_du_tru_lay_mau_ket_thuc,
            d.ma_don_vi, "dự trù lấy máu"
        )
        _validate_detail_dates_raw(
            payload.thoi_gian_du_tru_kham_bat_dau, payload.thoi_gian_du_tru_kham_ket_thuc,
            d.thoi_gian_du_tru_kham_bat_dau, d.thoi_gian_du_tru_kham_ket_thuc,
            d.ma_don_vi, "dự trù khám"
        )

    ma_lich_kham = generate_id(10)
    master = LichKhamSkNam(
        ma_lich_kham=ma_lich_kham,
        thoi_gian_bat_dau=payload.thoi_gian_bat_dau,
        thoi_gian_ket_thuc=payload.thoi_gian_ket_thuc,
        thoi_gian_lay_mau_bat_dau=payload.thoi_gian_lay_mau_bat_dau,
        thoi_gian_lay_mau_ket_thuc=payload.thoi_gian_lay_mau_ket_thuc,
        thoi_gian_du_tru_lay_mau_bat_dau=payload.thoi_gian_du_tru_lay_mau_bat_dau,
        thoi_gian_du_tru_lay_mau_ket_thuc=payload.thoi_gian_du_tru_lay_mau_ket_thuc,
        thoi_gian_du_tru_kham_bat_dau=payload.thoi_gian_du_tru_kham_bat_dau,
        thoi_gian_du_tru_kham_ket_thuc=payload.thoi_gian_du_tru_kham_ket_thuc,
        trang_thai="cho_gui",
    )
    db.add(master)

    for d in payload.details:
        db.add(LichKhamSkNamChiTiet(
            ma_lich_kham=ma_lich_kham,
            ma_don_vi=d.ma_don_vi,
            thoi_gian_bat_dau=d.thoi_gian_bat_dau,
            thoi_gian_ket_thuc=d.thoi_gian_ket_thuc,
            thoi_gian_lay_mau_bat_dau=d.thoi_gian_lay_mau_bat_dau,
            thoi_gian_lay_mau_ket_thuc=d.thoi_gian_lay_mau_ket_thuc,
            thoi_gian_du_tru_lay_mau_bat_dau=d.thoi_gian_du_tru_lay_mau_bat_dau,
            thoi_gian_du_tru_lay_mau_ket_thuc=d.thoi_gian_du_tru_lay_mau_ket_thuc,
            thoi_gian_du_tru_kham_bat_dau=d.thoi_gian_du_tru_kham_bat_dau,
            thoi_gian_du_tru_kham_ket_thuc=d.thoi_gian_du_tru_kham_ket_thuc,
            dia_diem=d.dia_diem,
        ))

    for a in payload.assignments:
        db.add(PhanCongNhiemVu(
            ma_lich_kham=ma_lich_kham,
            id_nguoi_dung=a.id_nguoi_dung,
            ma_vai_tro=a.ma_vai_tro,
        ))

    _create_audit_log(db, "CREATE", "lich_kham_sk_nam", current_user.id,
                      du_lieu_moi={"ma_lich_kham": ma_lich_kham})

    try:
        db.commit()
        db.refresh(master)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=409, detail="Tạo lịch khám thất bại do trùng lặp hoặc dữ liệu không hợp lệ.")

    return master


@pre_router.put("/{item_id}", dependencies=update_deps, response_model=read_schema)
def replace_lich_kham_batch(
    item_id: str,
    payload: LichKhamSkNamReplace,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    master = db.get(LichKhamSkNam, item_id)
    if not master:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch khám.")
    if master.trang_thai == "da_duyet":
        raise HTTPException(status_code=400, detail="Lịch khám đã duyệt, không thể sửa.")
    is_tam_hoan = master.trang_thai == "tam_hoan"
    if is_tam_hoan and current_user.id_vai_tro not in ("ROLE_ADMIN", "ROLE_CNQY"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ CNQY/ADMIN mới được sửa lịch khám đã hoãn.",
        )

    tg_bd = payload.thoi_gian_bat_dau if payload.thoi_gian_bat_dau is not None else master.thoi_gian_bat_dau
    tg_kt = payload.thoi_gian_ket_thuc if payload.thoi_gian_ket_thuc is not None else master.thoi_gian_ket_thuc
    tg_lm_bd = payload.thoi_gian_lay_mau_bat_dau if payload.thoi_gian_lay_mau_bat_dau is not None else master.thoi_gian_lay_mau_bat_dau
    tg_lm_kt = payload.thoi_gian_lay_mau_ket_thuc if payload.thoi_gian_lay_mau_ket_thuc is not None else master.thoi_gian_lay_mau_ket_thuc
    tg_dt_lm_bd = payload.thoi_gian_du_tru_lay_mau_bat_dau if payload.thoi_gian_du_tru_lay_mau_bat_dau is not None else master.thoi_gian_du_tru_lay_mau_bat_dau
    tg_dt_lm_kt = payload.thoi_gian_du_tru_lay_mau_ket_thuc if payload.thoi_gian_du_tru_lay_mau_ket_thuc is not None else master.thoi_gian_du_tru_lay_mau_ket_thuc
    tg_dt_kh_bd = payload.thoi_gian_du_tru_kham_bat_dau if payload.thoi_gian_du_tru_kham_bat_dau is not None else master.thoi_gian_du_tru_kham_bat_dau
    tg_dt_kh_kt = payload.thoi_gian_du_tru_kham_ket_thuc if payload.thoi_gian_du_tru_kham_ket_thuc is not None else master.thoi_gian_du_tru_kham_ket_thuc

    for d in payload.details:
        _validate_detail_dates_raw(tg_bd, tg_kt, d.thoi_gian_bat_dau, d.thoi_gian_ket_thuc, d.ma_don_vi, "khám")
        _validate_detail_dates_raw(tg_lm_bd, tg_lm_kt, d.thoi_gian_lay_mau_bat_dau, d.thoi_gian_lay_mau_ket_thuc, d.ma_don_vi, "lấy máu")
        _validate_detail_dates_raw(tg_dt_lm_bd, tg_dt_lm_kt, d.thoi_gian_du_tru_lay_mau_bat_dau, d.thoi_gian_du_tru_lay_mau_ket_thuc, d.ma_don_vi, "dự trù lấy máu")
        _validate_detail_dates_raw(tg_dt_kh_bd, tg_dt_kh_kt, d.thoi_gian_du_tru_kham_bat_dau, d.thoi_gian_du_tru_kham_ket_thuc, d.ma_don_vi, "dự trù khám")

    if payload.thoi_gian_bat_dau is not None:
        master.thoi_gian_bat_dau = payload.thoi_gian_bat_dau
    if payload.thoi_gian_ket_thuc is not None:
        master.thoi_gian_ket_thuc = payload.thoi_gian_ket_thuc

    for field in (
        "thoi_gian_lay_mau_bat_dau",
        "thoi_gian_lay_mau_ket_thuc",
        "thoi_gian_du_tru_lay_mau_bat_dau",
        "thoi_gian_du_tru_lay_mau_ket_thuc",
        "thoi_gian_du_tru_kham_bat_dau",
        "thoi_gian_du_tru_kham_ket_thuc",
    ):
        val = getattr(payload, field)
        if val is not None:
            setattr(master, field, val)

    db.query(LichKhamSkNamChiTiet).filter(
        LichKhamSkNamChiTiet.ma_lich_kham == item_id
    ).delete(synchronize_session='fetch')

    db.query(PhanCongNhiemVu).filter(
        PhanCongNhiemVu.ma_lich_kham == item_id
    ).delete(synchronize_session='fetch')

    for d in payload.details:
        db.add(LichKhamSkNamChiTiet(
            ma_lich_kham=item_id,
            ma_don_vi=d.ma_don_vi,
            thoi_gian_bat_dau=d.thoi_gian_bat_dau,
            thoi_gian_ket_thuc=d.thoi_gian_ket_thuc,
            thoi_gian_lay_mau_bat_dau=d.thoi_gian_lay_mau_bat_dau,
            thoi_gian_lay_mau_ket_thuc=d.thoi_gian_lay_mau_ket_thuc,
            thoi_gian_du_tru_lay_mau_bat_dau=d.thoi_gian_du_tru_lay_mau_bat_dau,
            thoi_gian_du_tru_lay_mau_ket_thuc=d.thoi_gian_du_tru_lay_mau_ket_thuc,
            thoi_gian_du_tru_kham_bat_dau=d.thoi_gian_du_tru_kham_bat_dau,
            thoi_gian_du_tru_kham_ket_thuc=d.thoi_gian_du_tru_kham_ket_thuc,
            dia_diem=d.dia_diem,
        ))

    for a in payload.assignments:
        db.add(PhanCongNhiemVu(
            ma_lich_kham=item_id,
            id_nguoi_dung=a.id_nguoi_dung,
            ma_vai_tro=a.ma_vai_tro,
        ))

    _create_audit_log(db, "UPDATE", "lich_kham_sk_nam", current_user.id,
                      du_lieu_moi={"ma_lich_kham": item_id})

    try:
        db.commit()
        db.refresh(master)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cập nhật lịch khám thất bại.")

    if is_tam_hoan:
        master.trang_thai = "da_duyet"
        db.commit()
        db.refresh(master)

    return master


@pre_router.post("/{ma_lich_kham}/hoan", dependencies=update_deps, response_model=read_schema)
def hoan_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, ma_lich_kham)
    if current_user.id_vai_tro not in ("ROLE_ADMIN", "ROLE_CNQY"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ CNQY/ADMIN mới có quyền hoãn lịch khám.",
        )
    if row.trang_thai != "da_duyet":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể hoãn lịch khám ở trạng thái {row.trang_thai}.",
        )
    ends = [
        row.thoi_gian_ket_thuc,
        row.thoi_gian_du_tru_kham_ket_thuc,
    ]
    ends = [e for e in ends if e is not None]
    if ends and max(ends) < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lịch khám đã diễn ra xong, không thể hoãn.",
        )
    row.trang_thai = "tam_hoan"
    db.commit()
    db.refresh(row)
    log = NhatKyThaoTac(
        id_nguoi_dung=current_user.id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong="HOAN",
        ten_bang="lich_kham_sk_nam",
        du_lieu_moi={"ma_lich_kham": ma_lich_kham, "trang_thai": "tam_hoan"},
    )
    db.add(log)
    db.commit()
    return row


@pre_router.delete("/{item_id}", dependencies=delete_deps, status_code=status.HTTP_204_NO_CONTENT)
def delete_lich_kham(
    item_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, item_id)
    if row.trang_thai in ("da_duyet", "tam_hoan"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Lịch khám đang tạm hoãn, không thể xóa."
                if row.trang_thai == "tam_hoan"
                else "Lịch khám đã được duyệt, không thể xóa."
            ),
        )
    lich_kham_sk_nam_crud.delete(db, item_id, nguoi_dung_id=current_user.id)


@pre_router.post("/{ma_lich_kham}/gui", dependencies=update_deps, response_model=read_schema)
def gui_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, ma_lich_kham)
    if row.trang_thai != "cho_gui":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể gửi duyệt lịch khám ở trạng thái {row.trang_thai}.",
        )
    row.trang_thai = "cho_duyet"
    db.commit()
    db.refresh(row)
    log = NhatKyThaoTac(
        id_nguoi_dung=current_user.id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong="GUI",
        ten_bang="lich_kham_sk_nam",
        du_lieu_moi={"ma_lich_kham": ma_lich_kham, "trang_thai": "cho_duyet"},
    )
    db.add(log)
    db.commit()
    return row


@pre_router.post("/{ma_lich_kham}/duyet", dependencies=update_deps, response_model=read_schema)
def duyet_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, ma_lich_kham)
    if current_user.id_vai_tro not in ("ROLE_ADMIN", "ROLE_CNQY"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ CNQY/ADMIN mới có quyền duyệt lịch khám.",
        )
    if row.trang_thai != "cho_duyet":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể duyệt lịch khám ở trạng thái {row.trang_thai}.",
        )
    row.trang_thai = "da_duyet"
    db.commit()
    db.refresh(row)
    log = NhatKyThaoTac(
        id_nguoi_dung=current_user.id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong="DUYET",
        ten_bang="lich_kham_sk_nam",
        du_lieu_moi={"ma_lich_kham": ma_lich_kham, "trang_thai": "da_duyet"},
    )
    db.add(log)
    db.commit()
    return row


@pre_router.post("/{ma_lich_kham}/tu-choi", dependencies=update_deps, response_model=read_schema)
def tu_choi_lich_kham(
    ma_lich_kham: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    row = lich_kham_sk_nam_crud.get(db, ma_lich_kham)
    if current_user.id_vai_tro not in ("ROLE_ADMIN", "ROLE_CNQY"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ CNQY/ADMIN mới có quyền từ chối lịch khám.",
        )
    if row.trang_thai != "cho_duyet":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể từ chối lịch khám ở trạng thái {row.trang_thai}.",
        )
    row.trang_thai = "tu_choi"
    db.commit()
    db.refresh(row)
    log = NhatKyThaoTac(
        id_nguoi_dung=current_user.id,
        thoi_gian=datetime.now(timezone.utc),
        hanh_dong="TU_CHOI",
        ten_bang="lich_kham_sk_nam",
        du_lieu_moi={"ma_lich_kham": ma_lich_kham, "trang_thai": "tu_choi"},
    )
    db.add(log)
    db.commit()
    return row


router = create_crud_router(
    resource="lich_kham_sk_nam",
    crud=lich_kham_sk_nam_crud,
    pre_router=pre_router,
    read_permission="lich_kham_sk_nam:read",
    create_permission="lich_kham_sk_nam:create",
    update_permission="lich_kham_sk_nam:update",
    delete_permission="lich_kham_sk_nam:delete",
    enable_create=False,
    enable_update=False,
    enable_delete=False,
)
