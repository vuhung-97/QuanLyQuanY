import ExcelJS from "exceljs";

export function buildXlsContent(soldiers, phieuMap, unitLookup, getTrangThai, nam) {
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

    const filtered = soldiers.filter((qn) => {
        const tt = getTrangThai(phieuMap[qn.ma_quan_nhan]);
        return tt === "Chưa khám" || tt === "Đang khám";
    }).sort((a, b) => {
        const uA = a.ma_don_vi || "";
        const uB = b.ma_don_vi || "";
        if (uA < uB) return -1;
        if (uA > uB) return 1;
        return (a.ho_ten || "").localeCompare(b.ho_ten || "", "vi");
    });

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    const ws = workbook.addWorksheet("Sheet1");

    ws.mergeCells("A1:G1");
    const titleCell = ws.getCell("A1");
    titleCell.value = title;
    titleCell.font = { name: "Arial", bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    const headerRow = ws.getRow(3);
    headers.forEach((h, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = h.label;
        cell.font = { name: "Arial", bold: true, size: 11, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0B3B60" } };
        cell.alignment = { horizontal: h.align, vertical: "middle" };
        cell.border = {
            top: { style: "thin", color: { argb: "FF999999" } },
            bottom: { style: "thin", color: { argb: "FF999999" } },
            left: { style: "thin", color: { argb: "FF999999" } },
            right: { style: "thin", color: { argb: "FF999999" } },
        };
    });
    headerRow.height = 22;

    headers.forEach((h, i) => {
        ws.getColumn(i + 1).width = h.width;
    });

    filtered.forEach((qn, idx) => {
        const tt = getTrangThai(phieuMap[qn.ma_quan_nhan]);
        const donVi = unitLookup.get(qn.ma_don_vi) || qn.ma_don_vi || "";
        const row = ws.getRow(idx + 4);
        const values = [idx + 1, qn.ma_quan_nhan, qn.ho_ten || "", donVi, qn.cap_bac || "", qn.chuc_vu || "", tt];
        values.forEach((val, ci) => {
            const cell = row.getCell(ci + 1);
            cell.value = val;
            cell.alignment = { horizontal: headers[ci].align, vertical: "middle" };
            cell.font = { name: "Arial", size: 11 };
            cell.border = {
                top: { style: "thin", color: { argb: "FF999999" } },
                bottom: { style: "thin", color: { argb: "FF999999" } },
                left: { style: "thin", color: { argb: "FF999999" } },
                right: { style: "thin", color: { argb: "FF999999" } },
            };
        });
        row.height = 20;
    });

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