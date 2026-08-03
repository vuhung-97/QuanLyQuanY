export const ROLES = {
    ADMIN: "ROLE_ADMIN",
    CNQY: "ROLE_CNQY",
    BACSI: "ROLE_BACSI",
    YSI: "ROLE_YSI",
    QN: "ROLE_QN",
};

export const ROLE_HIERARCHY = {
    ROLE_ADMIN: 0,
    ROLE_CNQY: 1,
    ROLE_BACSI: 2,
    ROLE_YSI: 3,
    ROLE_QN: 4,
};

export const ROLE_NAME_MAP = {
    ROLE_ADMIN: "Quản trị viên",
    ROLE_CNQY: "Chủ nhiệm Quân y",
    ROLE_BACSI: "Bác sĩ",
    ROLE_YSI: "Y sĩ",
    ROLE_QN: "Quân nhân",
};

export const MENU_ROLE_MAP = {
    "tong-quan": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],

    "kham-dinh-ky": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "lap-lich": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "kham-suc-khoe": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "ket-qua-kham": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],

    "noi-tru": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "danh-sach-noi-tru": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "lap-benh-an": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "quan-ly-phong-giuong": [
        "ROLE_ADMIN",
        "ROLE_CNQY",
        "ROLE_BACSI",
        "ROLE_YSI",
    ],

    "kham-benh": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "kham-benh-cho-quan-nhan": [
        "ROLE_ADMIN",
        "ROLE_CNQY",
        "ROLE_BACSI",
        "ROLE_YSI",
    ],
    "cap-thuoc": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "chuyen-tuyen": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "danh-muc-benh": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],

    "kho-duoc": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    kho: ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "du-tru": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "nhap-kho": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],
    "xuat-kho": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"],

    "bao-cao": ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI", "ROLE_QN"],

    "quan-tri": ["ROLE_ADMIN"],
    "tai-khoan": ["ROLE_ADMIN"],
    "phan-quyen": ["ROLE_ADMIN"],
    "nhat-ky": ["ROLE_ADMIN"],
};
