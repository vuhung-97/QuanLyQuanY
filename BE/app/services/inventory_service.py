from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.crud.base import CRUDBadRequestError, CRUDNotFoundError
from app.database.chi_tiet_du_tru import ChiTietDuTru
from app.database.chi_tiet_phieu_nhap_kho import ChiTietPhieuNhapKho
from app.database.chi_tiet_xuat_kho import ChiTietXuatKho
from app.database.phieu_du_tru import PhieuDuTru
from app.database.phieu_nhap_kho import PhieuNhapKho
from app.database.phieu_xuat_kho import PhieuXuatKho
from app.database.thuoc_vtyt import ThuocVtyt


def _resolve_thuoc(
    db: Session,
    thuoc_goc: ThuocVtyt,
    han_su_dung,
    so_lo,
    don_gia,
) -> ThuocVtyt | None:
    query = db.query(ThuocVtyt).filter(
        ThuocVtyt.ten_thuoc_vtyt == thuoc_goc.ten_thuoc_vtyt,
    )
    if han_su_dung is None:
        query = query.filter(ThuocVtyt.han_su_dung.is_(None))
    else:
        query = query.filter(ThuocVtyt.han_su_dung == han_su_dung)
    if so_lo is None:
        query = query.filter(ThuocVtyt.so_lo_han_dung.is_(None))
    else:
        query = query.filter(ThuocVtyt.so_lo_han_dung == so_lo)
    if don_gia is None:
        query = query.filter(ThuocVtyt.don_gia.is_(None))
    else:
        query = query.filter(ThuocVtyt.don_gia == don_gia)
    return query.first()


def _create_thuoc_from_goc(
    db: Session,
    thuoc_goc: ThuocVtyt,
    han_su_dung,
    so_lo,
    don_gia,
) -> ThuocVtyt:
    thuoc = ThuocVtyt(
        ten_thuoc_vtyt=thuoc_goc.ten_thuoc_vtyt,
        don_vi_tinh=thuoc_goc.don_vi_tinh,
        phan_loai=thuoc_goc.phan_loai,
        hoat_chat=thuoc_goc.hoat_chat,
        loai=thuoc_goc.loai,
        mo_ta=thuoc_goc.mo_ta,
        nha_san_xuat=thuoc_goc.nha_san_xuat,
        han_su_dung=han_su_dung,
        so_lo_han_dung=so_lo,
        don_gia=don_gia,
        so_luong=0,
    )
    db.add(thuoc)
    db.flush()
    return thuoc


class InventoryService:

    @staticmethod
    def import_stock(db: Session, phieu_nhap_id: str) -> PhieuNhapKho:
        phieu_nhap = db.get(PhieuNhapKho, phieu_nhap_id)
        if not phieu_nhap:
            raise CRUDNotFoundError(f"Phiếu nhập {phieu_nhap_id} không tồn tại")
        db.flush()
        chi_tiets = db.query(ChiTietPhieuNhapKho).filter(
            ChiTietPhieuNhapKho.ma_phieu_nhap == phieu_nhap_id
        ).all()

        for ct in chi_tiets:
            thuoc_goc = db.get(ThuocVtyt, ct.ma_thuoc_vtyt)
            if not thuoc_goc:
                raise CRUDNotFoundError(f"Thuốc {ct.ma_thuoc_vtyt} không tồn tại")
            thuoc = _resolve_thuoc(db, thuoc_goc, ct.han_su_dung, ct.so_lo, ct.don_gia)
            if thuoc is None:
                thuoc = _create_thuoc_from_goc(db, thuoc_goc, ct.han_su_dung, ct.so_lo, ct.don_gia)
            ct.ma_thuoc_vtyt = thuoc.ma_thuoc_vtyt
            thuoc.so_luong = (thuoc.so_luong or 0) + ct.so_luong

        if phieu_nhap.ma_phieu_du_tru:
            phieu_du_tru = db.get(PhieuDuTru, phieu_nhap.ma_phieu_du_tru)
            if phieu_du_tru:
                phieu_du_tru.trang_thai = "da_nhap"

        db.commit()
        db.refresh(phieu_nhap)
        return phieu_nhap

    @staticmethod
    def update_import_stock(
        db: Session,
        phieu_nhap_id: str,
        items: list,
        ngay_nhap: date | None = None,
        ghi_chu: str | None = None,
    ) -> PhieuNhapKho:
        phieu_nhap = db.get(PhieuNhapKho, phieu_nhap_id)
        if not phieu_nhap:
            raise CRUDNotFoundError(f"Phiếu nhập {phieu_nhap_id} không tồn tại")

        old_chi_tiets = (
            db.query(ChiTietPhieuNhapKho)
            .filter(ChiTietPhieuNhapKho.ma_phieu_nhap == phieu_nhap_id)
            .all()
        )

        for ct in old_chi_tiets:
            thuoc = db.get(ThuocVtyt, ct.ma_thuoc_vtyt)
            if thuoc:
                thuoc.so_luong = (thuoc.so_luong or 0) - ct.so_luong
                if (thuoc.so_luong or 0) < 0:
                    raise CRUDBadRequestError(
                        f"Thuốc '{thuoc.ten_thuoc_vtyt}' không đủ tồn kho để giảm"
                    )

        for ct in old_chi_tiets:
            db.delete(ct)
        db.flush()

        for it in items:
            ma = it.ma_thuoc_vtyt if hasattr(it, "ma_thuoc_vtyt") else it.get("ma_thuoc_vtyt")
            sl = it.so_luong if hasattr(it, "so_luong") else it.get("so_luong", 0)
            so_lo = it.so_lo if hasattr(it, "so_lo") else it.get("so_lo")
            han_su_dung = it.han_su_dung if hasattr(it, "han_su_dung") else it.get("han_su_dung")
            don_gia = it.don_gia if hasattr(it, "don_gia") else it.get("don_gia")

            thuoc_goc = db.get(ThuocVtyt, ma)
            if not thuoc_goc:
                raise CRUDNotFoundError(f"Thuốc {ma} không tồn tại")

            thuoc = _resolve_thuoc(db, thuoc_goc, han_su_dung, so_lo, don_gia)
            if thuoc is None:
                thuoc = _create_thuoc_from_goc(db, thuoc_goc, han_su_dung, so_lo, don_gia)

            db.add(
                ChiTietPhieuNhapKho(
                    ma_phieu_nhap=phieu_nhap_id,
                    ma_thuoc_vtyt=thuoc.ma_thuoc_vtyt,
                    so_luong=sl,
                    so_lo=so_lo,
                    han_su_dung=han_su_dung,
                    don_gia=don_gia,
                )
            )
            thuoc.so_luong = (thuoc.so_luong or 0) + sl

        if ngay_nhap is not None:
            phieu_nhap.ngay_nhap = ngay_nhap
        phieu_nhap.ghi_chu = ghi_chu

        db.commit()
        db.refresh(phieu_nhap)
        return phieu_nhap

    @staticmethod
    def export_stock(
        db: Session,
        phieu_xuat_id: str,
        thuc_xuat: dict[str, int] | None = None,
    ) -> PhieuXuatKho:
        phieu_xuat = db.get(PhieuXuatKho, phieu_xuat_id)
        if not phieu_xuat:
            raise CRUDNotFoundError(f"Phiếu xuất {phieu_xuat_id} không tồn tại")

        chi_tiets = db.query(ChiTietXuatKho).filter(
            ChiTietXuatKho.ma_phieu_xuat == phieu_xuat_id
        ).all()

        for ct in chi_tiets:
            thuoc = db.get(ThuocVtyt, ct.ma_thuoc_vtyt)
            if not thuoc:
                raise CRUDNotFoundError(f"Thuốc {ct.ma_thuoc_vtyt} không tồn tại")
            thuc = (
                thuc_xuat.get(ct.ma_thuoc_vtyt)
                if thuc_xuat and ct.ma_thuoc_vtyt in thuc_xuat
                else ct.so_luong
            )
            if thuc < 0 or thuc > ct.so_luong:
                raise CRUDBadRequestError(
                    f"Thuốc {thuoc.ten_thuoc_vtyt}: thực xuất {thuc} không hợp lệ (tối đa {ct.so_luong})"
                )
            ton_kho = thuoc.so_luong or 0
            if thuc > ton_kho:
                raise CRUDBadRequestError(
                    f"Thuốc {thuoc.ten_thuoc_vtyt} không đủ tồn: {ton_kho} < {thuc}"
                )
            thuoc.so_luong = ton_kho - thuc
            ct.so_luong_thuc_xuat = thuc

        db.commit()
        db.refresh(phieu_xuat)
        return phieu_xuat

    @staticmethod
    def adjust_stock(db: Session, thuoc_id: str, so_luong_moi: int) -> ThuocVtyt:
        thuoc = db.get(ThuocVtyt, thuoc_id)
        if not thuoc:
            raise CRUDNotFoundError(f"Thuốc {thuoc_id} không tồn tại")
        if so_luong_moi < 0:
            raise CRUDBadRequestError("Số lượng tồn không thể âm")
        thuoc.so_luong = so_luong_moi
        db.commit()
        db.refresh(thuoc)
        return thuoc

    @staticmethod
    def check_expiry(db: Session, days: int = 90) -> list[ThuocVtyt]:
        today = date.today()
        expiry_limit = today + timedelta(days=days)
        return db.query(ThuocVtyt).filter(
            ThuocVtyt.han_su_dung.isnot(None),
            ThuocVtyt.han_su_dung <= expiry_limit,
        ).all()
