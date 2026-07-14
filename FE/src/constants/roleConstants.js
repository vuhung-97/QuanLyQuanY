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

export const ALL_STAFF = [ROLES.ADMIN, ROLES.CNQY, ROLES.BACSI, ROLES.YSI];
export const ALL_WITH_QN = [...ALL_STAFF, ROLES.QN];
export const ADMIN_ONLY = [ROLES.ADMIN];
export const ADMIN_CNQY = [ROLES.ADMIN, ROLES.CNQY];
