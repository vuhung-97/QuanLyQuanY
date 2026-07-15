export const STATUS_MAP = {
    chờ: { label: "Chờ khám", color: "default" },
    đang_khám: { label: "Đang khám", color: "info" },
    chờ_nhận_thuốc: { label: "Chờ nhận thuốc", color: "warning" },
    đã_nhận_thuốc: { label: "Đã nhận thuốc", color: "success" },
    đã_khám: { label: "Đã xong", color: "success" },
    chuyển_tuyến: { label: "Chuyển tuyến", color: "error" },
    nhập_viện: { label: "Nhập viện", color: "secondary" },
    không_duyệt_chuyển_tuyến: { label: "Không duyệt chuyển tuyến", color: "default" },
    không_duyệt_nhập_viện: { label: "Không duyệt nhập viện", color: "default" },
};

export const THOI_DIEM_OPTIONS = [
    { value: "sau_an", label: "Sau ăn" },
    { value: "truoc_an", label: "Trước ăn" },
    { value: "truoc_khi_ngu", label: "Trước khi ngủ" },
    { value: "sau_khi_thuc_day", label: "Sau khi thức dậy" },
    { value: "khong", label: "Không" },
];

export const CACH_SU_DUNG_OPTIONS = [
    { value: "uong", label: "Uống" },
    { value: "boi", label: "Bôi" },
    { value: "tiem", label: "Tiêm" },
    { value: "xong", label: "Xông" },
    { value: "ngam", label: "Ngậm" },
    { value: "nhot", label: "Nhỏ mắt" },
    { value: "khac", label: "Khác" },
];

export const THOI_DIEM_LABEL_MAP = Object.fromEntries(
    THOI_DIEM_OPTIONS.map((o) => [o.value, o.label]),
);

export const CACH_DUNG_LABEL_MAP = Object.fromEntries(
    CACH_SU_DUNG_OPTIONS.map((o) => [o.value, o.label]),
);

export const CHUYEN_TUYEN_STATUS_MAP = {
    đề_nghị_chuyển_tuyến: { label: "Đề nghị chuyển tuyến", color: "warning" },
    chờ_chuyển_tuyến: { label: "Chờ chuyển tuyến", color: "info" },
    đã_chuyển_tuyến: { label: "Đã chuyển tuyến", color: "primary" },
    đã_về: { label: "Đã về", color: "success" },
};

export const ROWS_PER_PAGE = 50;
export const BATCH = 500;
