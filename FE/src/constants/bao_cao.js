export const CHART_COLORS = [
    "#00B4D8", "#0B3B60", "#F59E0B", "#10B981",
    "#EF4444", "#8B5CF6", "#EC4899", "#F97316",
];

export const TON_KHO_COLUMNS = [
    { field: "ma_thuoc", headerName: "Mã", width: 100 },
    { field: "ten_thuoc", headerName: "Tên thuốc/VTYT", flex: 1, minWidth: 200 },
    { field: "don_vi", headerName: "Đơn vị", width: 80 },
    { field: "ton_dau_ky", headerName: "Tồn đầu kỳ", width: 110, type: "number", align: "right", headerAlign: "right" },
    { field: "nhap_trong_ky", headerName: "Nhập trong kỳ", width: 120, type: "number", align: "right", headerAlign: "right" },
    { field: "xuat_trong_ky", headerName: "Xuất trong kỳ", width: 120, type: "number", align: "right", headerAlign: "right" },
    { field: "ton_cuoi_ky", headerName: "Tồn cuối kỳ", width: 110, type: "number", align: "right", headerAlign: "right" },
    { field: "han_su_dung", headerName: "Hạn sử dụng", width: 120 },
];
