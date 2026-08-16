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
            thuoc = db.get(ThuocVtyt, ct.ma_thuoc_vtyt)
            if not thuoc:
                raise CRUDNotFoundError(f"Thuốc {ct.ma_thuoc_vtyt} không tồn tại")
            thuoc.so_luong = (thuoc.so_luong or 0) + ct.so_luong

        if phieu_nhap.ma_phieu_du_tru:
            phieu_du_tru = db.get(PhieuDuTru, phieu_nhap.ma_phieu_du_tru)
            if phieu_du_tru:
                phieu_du_tru.trang_thai = "da_nhap"

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
            ThuocVtyt.han_su_dung >= today,
        ).all()
