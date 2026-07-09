from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.services.report_service import ReportService
from app.services.report_export_service import ReportExportService

router = APIRouter(prefix="/bao-cao", tags=["bao-cao"])


@router.get("/tong-quan")
def get_tong_quan(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = ReportService(db)
    return service.daily_stats()


@router.get("/quan-y-thang")
def get_quan_y_thang(
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = ReportService(db)
    return service.monthly_medical_report(thang, nam)


@router.get("/quan-y-nam")
def get_quan_y_nam(
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = ReportService(db)
    return service.yearly_medical_report(nam)


@router.get("/ton-kho")
def get_ton_kho(
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = ReportService(db)
    return service.inventory_report(thang, nam)


@router.get("/quan-y-thang/export")
def export_quan_y_thang(
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = ReportService(db)
    data = service.monthly_medical_report(thang, nam)
    export_service = ReportExportService()
    wb = export_service.export_monthly_report(data)
    return _stream_excel(wb, f"BC_quan_y_thang_{nam}_{thang:02d}.xlsx")


@router.get("/ton-kho/export")
def export_ton_kho(
    thang: int = Query(..., ge=1, le=12),
    nam: int = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    service = ReportService(db)
    data = service.inventory_report(thang, nam)
    export_service = ReportExportService()
    wb = export_service.export_inventory_report(data)
    return _stream_excel(wb, f"BC_ton_kho_{nam}_{thang:02d}.xlsx")


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
