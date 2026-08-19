export const fallbackSchedules = [
    {
        ma_lich_kham: "LK2026001",
        thoi_gian_bat_dau: "2026-06-10",
        thoi_gian_ket_thuc: "2026-06-18",
    },
    {
        ma_lich_kham: "LK2026002",
        thoi_gian_bat_dau: "2026-07-02",
        thoi_gian_ket_thuc: "2026-07-08",
    },
    {
        ma_lich_kham: "LK2026003",
        thoi_gian_bat_dau: "2026-05-12",
        thoi_gian_ket_thuc: "2026-05-20",
    },
];

export const TRANG_THAI_STATUS_FILTER = {
    chua_lay_mau: { label: "Chưa lấy máu" },
    da_lay_mau: { label: "Đã lấy máu" },
    dang_kham: { label: "Đang khám" },
    da_kham: { label: "Đã khám" },
};

export const ROLE_LABELS = {
    tong_quan: "Tổng quan",
    lam_sang: "Lâm sàng",
    xet_nghiem: "Xét nghiệm",
    chan_doan_hinh_anh: "Chẩn đoán hình ảnh",
    ket_luan: "Kết luận",
};

export const roleOrder = {
    ROLE_ADMIN: 0,
    ROLE_CNQY: 1,
    ROLE_BACSI: 2,
    ROLE_YSI: 3,
};

export const DEFAULT_PHAN_LOAI = "Loại 1";

export const DEFAULT_TS = {
    ban_than: "",
    di_ung: "",
    khac: "",
    gia_dinh: "",
    tien_su_loai: DEFAULT_PHAN_LOAI,
    chieu_cao: "",
    can_nang: "",
    vong_nguc: "",
    vong_bung: "",
    bmi: "",
    the_luc_loai: DEFAULT_PHAN_LOAI,
    mach: "",
    huyet_ap_tam_thu: "",
    huyet_ap_tam_truong: "",
    sinh_ton_loai: DEFAULT_PHAN_LOAI,
    mat_khong_kinh_trai: "",
    mat_khong_kinh_phai: "",
    mat_benh: "",
    mat_loai: DEFAULT_PHAN_LOAI,
};

export const DEFAULT_LS = {
    tim_mach_note: "",
    tim_mach_loai: DEFAULT_PHAN_LOAI,
    ho_hap_note: "",
    ho_hap_loai: DEFAULT_PHAN_LOAI,
    tieu_hoa_note: "",
    tieu_hoa_loai: DEFAULT_PHAN_LOAI,
    than_tiet_nieu_sinh_duc_nam_note: "",
    than_tiet_nieu_sinh_duc_nam_loai: DEFAULT_PHAN_LOAI,
    tam_than_than_kinh_note: "",
    tam_than_than_kinh_loai: DEFAULT_PHAN_LOAI,
    co_xuong_khop_note: "",
    co_xuong_khop_loai: DEFAULT_PHAN_LOAI,
    noi_tiet_chuyen_hoa_mien_dich_note: "",
    noi_tiet_chuyen_hoa_mien_dich_loai: DEFAULT_PHAN_LOAI,
    benh_mau_note: "",
    benh_mau_loai: DEFAULT_PHAN_LOAI,
    ngoai_khoa_note: "",
    ngoai_khoa_loai: DEFAULT_PHAN_LOAI,
    da_lieu_note: "",
    da_lieu_loai: DEFAULT_PHAN_LOAI,
    phu_san_note: "",
    phu_san_loai: DEFAULT_PHAN_LOAI,
    tai_mui_hong_note: "",
    tai_mui_hong_loai: DEFAULT_PHAN_LOAI,
    rang_ham_mat_note: "",
    rang_ham_mat_loai: DEFAULT_PHAN_LOAI,
    khac: "",
};

export const DEFAULT_CDHA = {
    dien_tim: "",
    dien_tim_loai: DEFAULT_PHAN_LOAI,
    dien_tim_anh: "",
    x_quang: "",
    x_quang_loai: DEFAULT_PHAN_LOAI,
    x_quang_anh: "",
    sieu_am: "",
    sieu_am_loai: DEFAULT_PHAN_LOAI,
    sieu_am_anh: "",
    khac: "",
    khac_loai: DEFAULT_PHAN_LOAI,
    khac_anh: "",
};

export const DEFAULT_KL = {
    phan_loai_suc_khoe: DEFAULT_PHAN_LOAI,
    ly_do: "",
    benh_tat_theo_doi: "",
    chi_dan_khac: "",
};

export const cardStyle = {
    borderRadius: 2,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
};

export const ALL_TABS = [0, 1, 2, 3, 4];

export const ROLE_TAB_ACCESS = {
    tong_quan: { edit: [0], view: [0] },
    lam_sang: { edit: [1], view: [0, 1, 2, 3] },
    xet_nghiem: { edit: [2], view: [2] },
    chan_doan_hinh_anh: { edit: [3], view: [3] },
    ket_luan: { edit: [4], view: [0, 1, 2, 3, 4] },
};

export const PHAN_LOAI_OPTIONS = [
    DEFAULT_PHAN_LOAI,
    "Loại 2",
    "Loại 3",
    "Loại 4",
    "Loại 5",
    "Loại 6",
];

export const TRANG_THAI_LABEL = {
    chua_lay_mau: "Chưa lấy máu",
    da_lay_mau: "Đã lấy máu",
    dang_kham: "Đang khám",
    da_kham: "Đã khám",
};

export const STATUS_CHIP = {
    "Chưa lấy máu": {
        bgcolor: "rgba(100, 116, 139, 0.12)",
        color: "text.secondary",
    },
    "Đã lấy máu": {
        bgcolor: "rgba(0, 180, 216, 0.12)",
        color: "secondary.main",
    },
    "Đang khám": { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" },
    "Đã khám": { bgcolor: "rgba(16, 185, 129, 0.12)", color: "success.main" },
};
