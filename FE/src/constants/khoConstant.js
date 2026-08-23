export const LOAI_OPTIONS = [
    { value: "thuoc", label: "Thuốc" },
    { value: "vat_tu", label: "Vật tư y tế" },
];

export const INIT_FORM = {
    ten_thuoc_vtyt: "",
    loai: "",
    don_vi_tinh: "",
    phan_loai: "",
    hoat_chat: "",
    so_luong: 0,
    han_su_dung: null,
    so_lo_han_dung: "",
    don_gia: null,
    mo_ta: "",
};

export const MODE_TITLES = {
    create: "Thêm thuốc / vật tư y tế",
    edit: "Sửa thuốc / vật tư y tế",
    view: "Chi tiết thuốc / vật tư y tế",
};

export const PHAN_LOAI_SLOT_PROPS = { displayEmpty: true };

export const DIALOG_FIELDS = [
    {
        name: "ten_thuoc_vtyt",
        label: "Tên thuốc / VTYT",
        grid: { xs: 12 },
        required: true,
        section: "basic",
    },
    {
        name: "loai",
        label: "Loại",
        grid: { xs: 12 },
        type: "loai",
        required: true,
        section: "basic",
    },
    {
        name: "don_vi_tinh",
        label: "ĐVT",
        grid: { xs: 6, sm: 6 },
        type: "donViTinh",
        section: "basic",
    },
    {
        name: "phan_loai",
        label: "Phân loại",
        grid: { xs: 6, sm: 6 },
        type: "phanLoai",
        slotProps: PHAN_LOAI_SLOT_PROPS,
        section: "basic",
    },
    {
        name: "hoat_chat",
        label: "Hoạt chất",
        grid: { xs: 12 },
        section: "basic",
    },
    {
        name: "so_luong",
        label: "Số lượng tồn",
        grid: { xs: 12, sm: 6 },
        type: "number",
        slotProps: { htmlInput: { min: 0 } },
        section: "inventory",
    },
    {
        name: "han_su_dung",
        label: "Hạn sử dụng",
        grid: { xs: 12, sm: 6 },
        type: "date",
        section: "inventory",
    },
    {
        name: "so_lo_han_dung",
        label: "Số lô",
        grid: { xs: 12, sm: 6 },
        section: "inventory",
    },
    {
        name: "don_gia",
        label: "Đơn giá",
        grid: { xs: 12, sm: 6 },
        type: "number",
        slotProps: { htmlInput: { min: 0, step: 1000 } },
        section: "inventory",
    },
    {
        name: "mo_ta",
        label: "Mô tả",
        grid: { xs: 12 },
        type: "textarea",
        section: "note",
    },
];

export const ROWS_PER_PAGE = 100;

export const STORAGE_KEY_THRESHOLDS = "kho_duoc_thresholds";

export const DEFAULT_THRESHOLDS = {
    thuoc: 100,
    vat_tu: 30,
    sapHetHanNgay: 90,
};

export const NHAP_KHO_STATUS_CHIP = {
    da_duyet: { label: "Chờ nhập", color: "warning" },
    da_nhap: { label: "Đã nhập", color: "info" },
};

export const NHAP_KHO_ROWS_PER_PAGE = 20;

export const NHAP_KHO_EMPTY_STATS = { tong: 0, choNhap: 0, daNhap: 0 };

export const NHAP_KHO_TITLES = {
    view: "Chi tiết nhập kho",
    edit: "Sửa phiếu nhập kho",
    createWithDuTru: "Tạo phiếu nhập (theo phiếu dự trù)",
    create: "Tạo phiếu nhập",
};
