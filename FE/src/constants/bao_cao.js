export const CHART_COLORS = [
    "#00B4D8", "#0B3B60", "#F59E0B", "#10B981",
    "#EF4444", "#8B5CF6", "#EC4899", "#F97316",
];

export const PHAN_LOAI_COLUMNS = [
    { key: "ten_nhom", label: "Nhóm bệnh" },
    { key: "so_ca", label: "Số ca", align: "right" },
    { key: "ty_le", label: "Tỉ lệ (%)", align: "right" },
];

export const THUOC_SU_DUNG_COLUMNS = [
    { key: "ten_thuoc", label: "Tên thuốc" },
    { key: "don_vi_tinh", label: "ĐVT" },
    { key: "phan_loai", label: "Phân loại" },
    { key: "so_luong", label: "Số lượng", align: "right" },
];

export const THUOC_NHAP_COLUMNS = [
    { key: "ten_thuoc", label: "Tên thuốc" },
    { key: "don_vi_tinh", label: "ĐVT" },
    { key: "phan_loai", label: "Phân loại" },
    { key: "so_luong", label: "Số lượng", align: "right" },
];

export const QUAN_SO_KHOE_COLUMNS = [
    { key: "ten_don_vi", label: "Đơn vị", sx: { minWidth: 260 } },
    { key: "quan_so", label: "Tổng quân số", sx: { width: 120, textAlign: "center" } },
    { key: "so_nguoi_om", label: "Người ốm", sx: { width: 110, textAlign: "center" } },
    { key: "so_luot_nhap_benh_xa", label: "Lượt nhập bệnh xá", sx: { width: 150, textAlign: "center" } },
    { key: "so_luot_chuyen_tuyen", label: "Lượt chuyển tuyến", sx: { width: 150, textAlign: "center" } },
    { key: "quan_so_khoe", label: "Quân số khỏe", sx: { width: 130, textAlign: "center" } },
    { key: "ty_le_khoe", label: "Tỷ lệ", sx: { width: 90, textAlign: "center" } },
];

export const cardStyle = {
    borderRadius: 2,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
};
