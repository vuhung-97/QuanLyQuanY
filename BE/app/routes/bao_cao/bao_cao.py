from datetime import date

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.services.reports import (
    ChiTietNhomBenhService,
    DashboardService,
    InventoryReportService,
    QuanSoKhoeService,
    QuanYReportService,
    VisitStatsService,
)
from app.services.report_export_service import ReportExportService

router = APIRouter(prefix="/bao-cao", tags=["bao-cao"])


@router.get("/tong-quan")
def get_tong_quan(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = DashboardService(db)
    return service.daily_stats()


@router.get("/quan-y-thang")
def get_quan_y_thang(
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = QuanYReportService(db)
    return service.monthly_medical_report(thang, nam)


@router.get("/quan-y-nam")
def get_quan_y_nam(
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = QuanYReportService(db)
    return service.yearly_medical_report(nam)


@router.get("/quan-y-thang/chi-tiet-nhom-benh")
def get_chi_tiet_nhom_benh(
    loai: str = Query(...),
    ma_nhom: str = Query(...),
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = ChiTietNhomBenhService(db)
    return service.get_chi_tiet_nhom_benh(loai, ma_nhom, thang, nam)


@router.get("/quan-so-khoe")
def get_quan_so_khoe(
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = QuanSoKhoeService(db)
    return service.quan_so_khoe(thang, nam)


@router.get("/quan-so-khoe/chi-tiet-don-vi")
def get_quan_so_khoe_chi_tiet_don_vi(
    ma_don_vi: str = Query(...),
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = QuanSoKhoeService(db)
    return service.quan_so_khoe_chi_tiet_don_vi(ma_don_vi, thang, nam)


@router.get("/ton-kho")
def get_ton_kho(
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = InventoryReportService(db)
    return service.inventory_report(thang, nam)


@router.get("/ton-kho/export")
def export_ton_kho(
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = InventoryReportService(db)
    data = service.inventory_report(thang, nam)
    export_service = ReportExportService()
    wb = export_service.export_inventory_report(data)
    return _stream_excel(wb, f"BC_ton_kho_{nam}_{thang:02d}.xlsx")


@router.get("/quan-so-kham-chua-benh")
def get_quan_so_kham_chua_benh(
    mode: str = Query(default="day", pattern="^(day|month)$"),
    end_date: date | None = Query(default=None),
    nam: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = VisitStatsService(db)
    if mode == "month":
        nam_value = nam or date.today().year
        data = service.monthly_visit_stats(nam_value)
    else:
        end = end_date or date.today()
        data = service.daily_visit_stats(end)
    return {"data": data}


def _stream_excel(wb, filename: str):
    from io import BytesIO

    buf = BytesIO()
    wb.save(buf)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
