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

export const cardStyle = {
    borderRadius: 2,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
};
