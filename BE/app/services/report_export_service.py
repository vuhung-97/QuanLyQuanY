from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, Side, PatternFill
from openpyxl.utils import get_column_letter


THIN_BORDER = Border(
    left=Side(style="thin"),
    right=Side(style="thin"),
    top=Side(style="thin"),
    bottom=Side(style="thin"),
)

HEADER_FILL = PatternFill(start_color="0B3B60", end_color="0B3B60", fill_type="solid")
HEADER_FONT = Font(name="Times New Roman", bold=True, color="FFFFFF", size=13)
TITLE_FONT = Font(name="Times New Roman", bold=True, size=14)
BODY_FONT = Font(name="Times New Roman", size=13)
CENTER_ALIGN = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT_ALIGN = Alignment(horizontal="left", vertical="center", wrap_text=True)


class ReportExportService:

    def export_monthly_report(self, data: dict) -> Workbook:
        wb = Workbook()
        ws = wb.active
        ws.title = "Báo cáo quân y tháng"

        UNIT_NAME = "LỮ ĐOÀN 170"

        ws.merge_cells("A1:E1")
        ws["A1"] = f"{UNIT_NAME}"
        ws["A1"].font = Font(name="Times New Roman", size=13)
        ws["A1"].alignment = Alignment(horizontal="left", vertical="center")

        ws.merge_cells("A2:E2")
        ws["A2"] = "PHÒNG HC-KT"
        ws["A2"].font = Font(name="Times New Roman", size=13, bold=True)
        ws["A2"].alignment = Alignment(horizontal="left", vertical="center")

        ws.merge_cells("A4:E4")
        subtitle = f"BÁO CÁO THỐNG KÊ QUÂN Y THÁNG {data['thang']}/{data['nam']}" if data.get('thang') else f"BÁO CÁO THỐNG KÊ QUÂN Y NĂM {data['nam']}"
        ws["A4"] = subtitle
        ws["A4"].font = TITLE_FONT
        ws["A4"].alignment = CENTER_ALIGN

        ws.merge_cells("A6:E6")
        ws["A6"] = "I. TỔNG QUAN"
        ws["A6"].font = Font(name="Times New Roman", bold=True, size=13)

        headers = ["STT", "Chỉ tiêu", "Số lượng", "Ghi chú", ""]
        for col, h in enumerate(headers, 1):
            cell = ws.cell(row=7, column=col, value=h)
            cell.font = HEADER_FONT
            cell.fill = HEADER_FILL
            cell.alignment = CENTER_ALIGN
            cell.border = THIN_BORDER
        ws.merge_cells("D7:E7")

        rows_data = [
            (1, "Tổng lượt khám", data["tong_quan"]["tong_luot_kham"], ""),
            (2, "Tổng nội trú", data["tong_quan"]["tong_noi_tru"], ""),
            (3, "Tổng chuyển tuyến", data["tong_quan"]["tong_chuyen_tuyen"], ""),
            (4, "Tổng đơn thuốc", data["tong_quan"]["tong_don_thuoc"], ""),
        ]
        for i, (stt, ten, sl, gc) in enumerate(rows_data, 7):
            for col, val in [(1, stt), (2, ten), (3, sl), (4, gc)]:
                c = ws.cell(row=i, column=col, value=val)
                c.font = BODY_FONT
                c.border = THIN_BORDER
                if col in (1, 3):
                    c.alignment = CENTER_ALIGN
            ws.merge_cells(f"D{i}:E{i}")

        row_start = len(rows_data) + 8
        ws.merge_cells(f"A{row_start}:E{row_start}")
        ws.cell(row=row_start, column=1, value="II. PHÂN LOẠI BỆNH KHÁM NGOẠI TRÚ")
        ws.cell(row=row_start, column=1).font = Font(name="Times New Roman", bold=True, size=13)

        headers2 = ["STT", "Nhóm bệnh", "Số ca", "Tỉ lệ (%)", ""]
        for col, h in enumerate(headers2, 1):
            cell = ws.cell(row=row_start + 1, column=col, value=h)
            cell.font = HEADER_FONT
            cell.fill = HEADER_FILL
            cell.alignment = CENTER_ALIGN
            cell.border = THIN_BORDER
        ws.merge_cells(f"D{row_start+1}:E{row_start+1}")

        for i, item in enumerate(data["phan_loai_benh_kham"], 1):
            r = row_start + 1 + i
            for col, val in [(1, i), (2, item["ten_nhom"]), (3, item["so_ca"]), (4, item["ty_le"])]:
                c = ws.cell(row=r, column=col, value=val)
                c.font = BODY_FONT
                c.border = THIN_BORDER
                if col in (1, 3, 4):
                    c.alignment = CENTER_ALIGN
            ws.merge_cells(f"D{r}:E{r}")

        row_start2 = row_start + len(data["phan_loai_benh_kham"]) + 3
        ws.merge_cells(f"A{row_start2}:E{row_start2}")
        ws.cell(row=row_start2, column=1, value="III. PHÂN LOẠI BỆNH NỘI TRÚ")
        ws.cell(row=row_start2, column=1).font = Font(name="Times New Roman", bold=True, size=13)

        for col, h in enumerate(headers2, 1):
            cell = ws.cell(row=row_start2 + 1, column=col, value=h)
            cell.font = HEADER_FONT
            cell.fill = HEADER_FILL
            cell.alignment = CENTER_ALIGN
            cell.border = THIN_BORDER
        ws.merge_cells(f"D{row_start2+1}:E{row_start2+1}")

        for i, item in enumerate(data["phan_loai_benh_noi_tru"], 1):
            r = row_start2 + 1 + i
            for col, val in [(1, i), (2, item["ten_nhom"]), (3, item["so_ca"]), (4, item["ty_le"])]:
                c = ws.cell(row=r, column=col, value=val)
                c.font = BODY_FONT
                c.border = THIN_BORDER
                if col in (1, 3, 4):
                    c.alignment = CENTER_ALIGN
            ws.merge_cells(f"D{r}:E{r}")

        so_sanh = data.get("so_sanh_thang_truoc")
        if so_sanh:
            row_start_ss = row_start2 + len(data["phan_loai_benh_noi_tru"]) + 3
            ws.merge_cells(f"A{row_start_ss}:E{row_start_ss}")
            ws.cell(row=row_start_ss, column=1, value="IV. SO SÁNH VỚI THÁNG TRƯỚC")
            ws.cell(row=row_start_ss, column=1).font = Font(name="Times New Roman", bold=True, size=13)

            headers_ss = ["Chỉ tiêu", "Tháng này", "Tháng trước", "Thay đổi", ""]
            for col, h in enumerate(headers_ss, 1):
                cell = ws.cell(row=row_start_ss + 1, column=col, value=h)
                cell.font = HEADER_FONT
                cell.fill = HEADER_FILL
                cell.alignment = CENTER_ALIGN
                cell.border = THIN_BORDER
            ws.merge_cells(f"D{row_start_ss+1}:E{row_start_ss+1}")

            ss_fields = [
                ("Lượt khám", so_sanh["luot_kham"]),
                ("Nội trú", so_sanh["noi_tru"]),
                ("Chuyển tuyến", so_sanh["chuyen_tuyen"]),
            ]
            for i, (label, vals) in enumerate(ss_fields, 1):
                r = row_start_ss + 1 + i
                for col, val in [(1, label), (2, vals["thang_nay"]), (3, vals["thang_truoc"]), (4, vals["thay_doi"])]:
                    c = ws.cell(row=r, column=col, value=val)
                    c.font = BODY_FONT
                    c.border = THIN_BORDER
                    if col in (2, 3, 4):
                        c.alignment = CENTER_ALIGN
                ws.merge_cells(f"D{r}:E{r}")
            next_after_ss = row_start_ss + len(ss_fields) + 3
        else:
            next_after_ss = row_start2 + len(data["phan_loai_benh_noi_tru"]) + 3

        thuoc_list = data.get("thuoc_da_su_dung", [])
        if thuoc_list:
            row_start3 = next_after_ss
            ws.merge_cells(f"A{row_start3}:E{row_start3}")
            ws.cell(row=row_start3, column=1, value="V. THUỐC / VTYT ĐÃ SỬ DỤNG")
            ws.cell(row=row_start3, column=1).font = Font(name="Times New Roman", bold=True, size=13)

            headers3 = ["STT", "Tên thuốc", "ĐVT", "Phân loại", "Số lượng"]
            for col, h in enumerate(headers3, 1):
                cell = ws.cell(row=row_start3 + 1, column=col, value=h)
                cell.font = HEADER_FONT
                cell.fill = HEADER_FILL
                cell.alignment = CENTER_ALIGN
                cell.border = THIN_BORDER

            for i, item in enumerate(thuoc_list, 1):
                r = row_start3 + 1 + i
                for col, val in [(1, i), (2, item["ten_thuoc"]), (3, item["don_vi_tinh"]), (4, item["phan_loai"]), (5, item["so_luong"])]:
                    c = ws.cell(row=r, column=col, value=val)
                    c.font = BODY_FONT
                    c.border = THIN_BORDER
                    if col in (1, 3, 4, 5):
                        c.alignment = CENTER_ALIGN

            footer_row = row_start3 + len(thuoc_list) + 2
        else:
            footer_row = next_after_ss

        row_start_sign = footer_row + 1
        ws.merge_cells(f"C{row_start_sign}:E{row_start_sign}")
        ws.cell(row=row_start_sign, column=3, value=f"Ngày ..... tháng ..... năm .....")
        ws.cell(row=row_start_sign, column=3).font = BODY_FONT
        ws.cell(row=row_start_sign, column=3).alignment = CENTER_ALIGN

        row_name1 = row_start_sign + 1
        ws.merge_cells(f"A{row_name1}:B{row_name1}")
        ws.cell(row=row_name1, column=1, value="NGƯỜI LẬP")
        ws.cell(row=row_name1, column=1).font = Font(name="Times New Roman", bold=True, size=13)
        ws.cell(row=row_name1, column=1).alignment = CENTER_ALIGN

        ws.merge_cells(f"C{row_name1}:E{row_name1}")
        ws.cell(row=row_name1, column=3, value="CHỦ NHIỆM QUÂN Y")
        ws.cell(row=row_name1, column=3).font = Font(name="Times New Roman", bold=True, size=13)
        ws.cell(row=row_name1, column=3).alignment = CENTER_ALIGN

        row_name2 = row_name1 + 4
        ws.merge_cells(f"A{row_name2}:B{row_name2}")
        ws.cell(row=row_name2, column=1, value=data.get("nguoi_lap") or "______________")
        ws.cell(row=row_name2, column=1).font = BODY_FONT
        ws.cell(row=row_name2, column=1).alignment = CENTER_ALIGN

        ws.merge_cells(f"C{row_name2}:E{row_name2}")
        ws.cell(row=row_name2, column=3, value="______________")
        ws.cell(row=row_name2, column=3).font = BODY_FONT
        ws.cell(row=row_name2, column=3).alignment = CENTER_ALIGN

        ws.column_dimensions["A"].width = 16
        ws.column_dimensions["B"].width = 45
        ws.column_dimensions["C"].width = 15
        ws.column_dimensions["D"].width = 15
        ws.column_dimensions["E"].width = 15

        return wb

    def export_inventory_report(self, data: dict) -> Workbook:
        wb = Workbook()
        ws = wb.active
        ws.title = "Báo cáo tồn kho"

        ws.merge_cells("A1:G1")
        ws["A1"] = f"BÁO CÁO TỒN KHO THUỐC - VT Y TẾ THÁNG {data['thang']}/{data['nam']}"
        ws["A1"].font = TITLE_FONT
        ws["A1"].alignment = CENTER_ALIGN

        headers = ["STT", "Tên thuốc/VTYT", "Đơn vị", "Tồn đầu kỳ", "Nhập trong kỳ", "Xuất trong kỳ", "Tồn cuối kỳ"]
        for col, h in enumerate(headers, 1):
            cell = ws.cell(row=3, column=col, value=h)
            cell.font = HEADER_FONT
            cell.fill = HEADER_FILL
            cell.alignment = CENTER_ALIGN
            cell.border = THIN_BORDER

        for i, item in enumerate(data["danh_sach"], 1):
            r = 3 + i
            ws.cell(row=r, column=1, value=i).border = THIN_BORDER
            ws.cell(row=r, column=1).alignment = CENTER_ALIGN
            ws.cell(row=r, column=2, value=item["ten_thuoc"]).border = THIN_BORDER
            ws.cell(row=r, column=3, value=item["don_vi"]).border = THIN_BORDER
            ws.cell(row=r, column=3).alignment = CENTER_ALIGN
            ws.cell(row=r, column=4, value=item["ton_dau_ky"]).border = THIN_BORDER
            ws.cell(row=r, column=4).alignment = CENTER_ALIGN
            ws.cell(row=r, column=5, value=item["nhap_trong_ky"]).border = THIN_BORDER
            ws.cell(row=r, column=5).alignment = CENTER_ALIGN
            ws.cell(row=r, column=6, value=item["xuat_trong_ky"]).border = THIN_BORDER
            ws.cell(row=r, column=6).alignment = CENTER_ALIGN
            ws.cell(row=r, column=7, value=item["ton_cuoi_ky"]).border = THIN_BORDER
            ws.cell(row=r, column=7).alignment = CENTER_ALIGN

        r_total = 3 + len(data["danh_sach"]) + 1
        ws.cell(row=r_total, column=1, value="TỔNG").font = Font(name="Times New Roman", bold=True, size=14)
        ws.cell(row=r_total, column=1).border = THIN_BORDER
        ws.cell(row=r_total, column=1).alignment = CENTER_ALIGN
        for col in range(2, 4):
            ws.cell(row=r_total, column=col).border = THIN_BORDER
        ws.cell(row=r_total, column=4, value=data["tong_ton_dau"]).border = THIN_BORDER
        ws.cell(row=r_total, column=4).alignment = CENTER_ALIGN
        ws.cell(row=r_total, column=4).font = Font(name="Times New Roman", bold=True, size=14)
        ws.cell(row=r_total, column=5, value=data["tong_nhap"]).border = THIN_BORDER
        ws.cell(row=r_total, column=5).alignment = CENTER_ALIGN
        ws.cell(row=r_total, column=5).font = Font(name="Times New Roman", bold=True, size=14)
        ws.cell(row=r_total, column=6, value=data["tong_xuat"]).border = THIN_BORDER
        ws.cell(row=r_total, column=6).alignment = CENTER_ALIGN
        ws.cell(row=r_total, column=6).font = Font(name="Times New Roman", bold=True, size=14)
        ws.cell(row=r_total, column=7, value=data["tong_ton_cuoi"]).border = THIN_BORDER
        ws.cell(row=r_total, column=7).alignment = CENTER_ALIGN
        ws.cell(row=r_total, column=7).font = Font(name="Times New Roman", bold=True, size=14)

        ws.column_dimensions["A"].width = 8
        ws.column_dimensions["B"].width = 40
        ws.column_dimensions["C"].width = 12
        for col in range(4, 8):
            ws.column_dimensions[get_column_letter(col)].width = 15

        return wb
