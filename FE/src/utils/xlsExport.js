import ExcelJS from "exceljs";

const TRANG_THAI_LABEL = {
    chua_kham: "Chưa khám",
    dang_kham: "Đang khám",
    da_kham: "Đã khám",
};

function getStatusLabel(phieu) {
    if (!phieu) return "Chưa khám";
    return TRANG_THAI_LABEL[phieu.trang_thai] || "Chưa khám";
}

export function buildXlsContent(
    soldiers,
    phieuMap,
    unitLookup,
    nam,
) {
    const title = `DANH SÁCH QUÂN NHÂN CHƯA KHÁM SỨC KHỎE NĂM ${nam || ""}`;
    const headers = [
        { label: "STT", align: "center", width: 6 },
        { label: "Mã QN", align: "left", width: 14 },
        { label: "Họ tên", align: "left", width: 28 },
        { label: "Đơn vị", align: "left", width: 22 },
        { label: "Cấp bậc", align: "left", width: 14 },
        { label: "Chức vụ", align: "left", width: 18 },
        { label: "Tình trạng khám", align: "center", width: 18 },
    ];

    const filtered = soldiers
        .filter((qn) => {
            const tt = getStatusLabel(phieuMap[qn.ma_quan_nhan]);
            return tt === "Chưa khám" || tt === "Đang khám";
        })
        .sort((a, b) => {
            const uA = a.ma_don_vi || "";
            const uB = b.ma_don_vi || "";
            if (uA < uB) return -1;
            if (uA > uB) return 1;
            return (a.ho_ten || "").localeCompare(b.ho_ten || "", "vi");
        });

    const workbook = new ExcelJS.Workbook();
    const fontxls = { name: "Times New Roman", size: 14 };
    workbook.created = new Date();
    const ws = workbook.addWorksheet("Sheet1");

    // Phiên hiệu đơn vị - góc trái
    ws.getCell("B1").value = "PHÒNG HC-KT";
    ws.getCell("B1").font = fontxls;
    ws.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell("B2").value = "BAN QUÂN Y";
    ws.getCell("B2").font = { ...fontxls, bold: true };
    ws.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };

    // Quốc hiệu - góc phải
    ws.getCell("F1").value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
    ws.getCell("F1").font = { ...fontxls, bold: true };
    ws.getCell("F1").alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell("F2").value = "Độc lập - Tự do - Hạnh phúc";
    ws.getCell("F2").font = { ...fontxls, bold: true };
    ws.getCell("F2").alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell("G3").value = "Quảng Ninh, ngày ... tháng ... năm ...";
    ws.getCell("G3").font = { ...fontxls, italic: true };
    ws.getCell("G3").alignment = { horizontal: "right", vertical: "middle" };

    // Tiêu đề chính
    ws.mergeCells("A5:G5");
    const titleCell = ws.getCell("A5");
    titleCell.value = title;
    titleCell.font = { ...fontxls, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    const headerRow = ws.getRow(7);
    headers.forEach((h, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = h.label;
        cell.font = {
            ...fontxls,
            bold: true,
            color: { argb: "FFFFFFFF" },
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF0B3B60" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin", color: { argb: "FF999999" } },
            bottom: { style: "thin", color: { argb: "FF999999" } },
            left: { style: "thin", color: { argb: "FF999999" } },
            right: { style: "thin", color: { argb: "FF999999" } },
        };
    });
    headerRow.height = 25;

    headers.forEach((h, i) => {
        ws.getColumn(i + 1).width = h.width;
    });

    filtered.forEach((qn, idx) => {
        const tt = getStatusLabel(phieuMap[qn.ma_quan_nhan]);
        const donVi = unitLookup.get(qn.ma_don_vi) || qn.ma_don_vi || "";
        const row = ws.getRow(idx + 8);
        const values = [
            idx + 1,
            qn.ma_quan_nhan,
            qn.ho_ten || "",
            donVi,
            qn.cap_bac || "",
            qn.chuc_vu || "",
            tt,
        ];
        values.forEach((val, ci) => {
            const cell = row.getCell(ci + 1);
            cell.value = val;
            cell.alignment = {
                horizontal: headers[ci].align,
                vertical: "middle",
            };
            cell.font = fontxls;
            cell.border = {
                top: { style: "thin", color: { argb: "FF999999" } },
                bottom: { style: "thin", color: { argb: "FF999999" } },
                left: { style: "thin", color: { argb: "FF999999" } },
                right: { style: "thin", color: { argb: "FF999999" } },
            };
        });
        row.height = 20;
    });

    // Chữ ký cuối file
    const sigRow = filtered.length + 10;
    ws.getCell(`F${sigRow}`).value = "CHỦ NHIỆM QUÂN Y";
    ws.getCell(`F${sigRow}`).font = { ...fontxls, bold: true };
    ws.getCell(`F${sigRow}`).alignment = {
        horizontal: "right",
        vertical: "middle",
    };

    return workbook;
}

export function buildCapThuocXlsContent(examinations) {
    const title = "DANH SÁCH QUÂN NHÂN CẤP THUỐC";
    const headers = [
        { label: "STT", align: "center", width: 6 },
        { label: "Mã KB", align: "left", width: 16 },
        { label: "Họ tên", align: "left", width: 28 },
        { label: "Đơn vị", align: "left", width: 24 },
        { label: "Cấp bậc", align: "left", width: 14 },
        { label: "Ngày khám", align: "center", width: 16 },
        { label: "Trạng thái", align: "center", width: 18 },
    ];

    const workbook = new ExcelJS.Workbook();
    const fontxls = { name: "Times New Roman", size: 14 };
    workbook.created = new Date();
    const ws = workbook.addWorksheet("Sheet1");

    ws.getCell("B1").value = "PHÒNG HC-KT";
    ws.getCell("B1").font = fontxls;
    ws.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell("B2").value = "BAN QUÂN Y";
    ws.getCell("B2").font = { ...fontxls, bold: true };
    ws.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };

    ws.getCell("F1").value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
    ws.getCell("F1").font = { ...fontxls, bold: true };
    ws.getCell("F1").alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell("F2").value = "Độc lập - Tự do - Hạnh phúc";
    ws.getCell("F2").font = { ...fontxls, bold: true };
    ws.getCell("F2").alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell("G3").value = "Quảng Ninh, ngày ... tháng ... năm ...";
    ws.getCell("G3").font = { ...fontxls, italic: true };
    ws.getCell("G3").alignment = { horizontal: "right", vertical: "middle" };

    ws.mergeCells("A5:G5");
    const titleCell = ws.getCell("A5");
    titleCell.value = title;
    titleCell.font = { ...fontxls, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    const headerRow = ws.getRow(7);
    headers.forEach((h, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = h.label;
        cell.font = { ...fontxls, bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0B3B60" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin", color: { argb: "FF999999" } },
            bottom: { style: "thin", color: { argb: "FF999999" } },
            left: { style: "thin", color: { argb: "FF999999" } },
            right: { style: "thin", color: { argb: "FF999999" } },
        };
    });
    headerRow.height = 25;

    headers.forEach((h, i) => {
        ws.getColumn(i + 1).width = h.width;
    });

    const trangThaiLabel = {
        chờ_nhận_thuốc: "Chờ cấp thuốc",
        đã_nhận_thuốc: "Đã nhận thuốc",
    };

    examinations.forEach((item, idx) => {
        const ngayKham = item.ngay_kham
            ? new Date(item.ngay_kham).toLocaleDateString("vi-VN")
            : "";
        const row = ws.getRow(idx + 8);
        const values = [
            idx + 1,
            item.ma_kham_benh || "",
            item.ho_ten || "",
            item.ten_don_vi || "",
            item.cap_bac || "",
            ngayKham,
            trangThaiLabel[item.trang_thai] || item.trang_thai || "",
        ];
        values.forEach((val, ci) => {
            const cell = row.getCell(ci + 1);
            cell.value = val;
            cell.alignment = { horizontal: headers[ci].align, vertical: "middle" };
            cell.font = fontxls;
            cell.border = {
                top: { style: "thin", color: { argb: "FF999999" } },
                bottom: { style: "thin", color: { argb: "FF999999" } },
                left: { style: "thin", color: { argb: "FF999999" } },
                right: { style: "thin", color: { argb: "FF999999" } },
            };
        });
        row.height = 20;
    });

    const sigRow = examinations.length + 10;
    ws.getCell(`F${sigRow}`).value = "CHỦ NHIỆM QUÂN Y";
    ws.getCell(`F${sigRow}`).font = { ...fontxls, bold: true };
    ws.getCell(`F${sigRow}`).alignment = { horizontal: "right", vertical: "middle" };

    return workbook;
}

export async function saveWorkbook(workbook, filename) {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
