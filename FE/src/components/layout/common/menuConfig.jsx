import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Assessment as AssessmentIcon,
    Bed as BedIcon,
    Circle as CircleIcon,
    Dashboard as DashboardIcon,
    HealthAndSafety as HealthAndSafetyIcon,
    Healing as HealingIcon,
    Inventory2 as InventoryIcon,
    MedicalServices as MedicalServicesIcon,
} from "@mui/icons-material";

const ALL = ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"];
const NO_YSI = ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI"];
const ADMIN = ["ROLE_ADMIN", "ROLE_CNQY"];

export const defaultMenuItems = [
    {
        id: "dashboard",
        title: "Tổng quan",
        path: "/",
        icon: <DashboardIcon />,
        allowedRoles: ALL,
    },
    {
        id: "periodic-checkup",
        title: "Khám sức khỏe định kỳ",
        path: "/kham-dinh-ky",
        icon: <HealthAndSafetyIcon />,
        allowedRoles: ALL,
            children: [
            {
                id: "periodic-schedule",
                title: "Lập lịch khám",
                path: "/kham-dinh-ky/lap-lich",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: NO_YSI,
            },
            {
                id: "periodic-exam",
                title: "Khám sức khỏe",
                path: "/kham-dinh-ky/kham-suc-khoe",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL,
            },
        ],
    },
    {
        id: "inpatient",
        title: "Quản lý nội trú",
        path: "/noi-tru",
        icon: <BedIcon />,
        allowedRoles: ALL,
            children: [
            {
                id: "inpatient-list",
                title: "Danh sách nội trú",
                path: "/noi-tru/danh-sach",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL,
            },
            {
                id: "inpatient-record",
                title: "Lập bệnh án",
                path: "/noi-tru/lap-benh-an",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL,
            },
            {
                id: "inpatient-bed",
                title: "Quản lý phòng/giường",
                path: "/noi-tru/quan-ly-phong-giuong",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL,
            },
        ],
    },
    {
        id: "examination",
        title: "Khám bệnh cho quân nhân",
        path: "/kham-benh",
        icon: <MedicalServicesIcon />,
        allowedRoles: ALL,
            children: [
            {
                id: "examination-list",
                title: "Khám bệnh",
                path: "/kham-benh/Kham-benh-cho-quan-nhan",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: NO_YSI,
            },
            {
                id: "medicine-dispensing",
                title: "Cấp thuốc",
                path: "/kham-benh/Cap-thuoc",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL,
            },
            {
                id: "referral",
                title: "Chuyển tuyến",
                path: "/kham-benh/Chuyen-tuyen",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL,
            },
        ],
    },
    {
        id: "pharmacy",
        title: "Thuốc và vật tư y tế",
        path: "/kho-duoc",
        icon: <InventoryIcon />,
        allowedRoles: ALL,
            children: [
            {
                id: "pharmacy-request",
                title: "Dự trù",
                path: "/kho-duoc/du-tru",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: NO_YSI,
            },
            {
                id: "pharmacy-import",
                title: "Nhập",
                path: "/kho-duoc/nhap",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: NO_YSI,
            },
            {
                id: "pharmacy-export",
                title: "Xuất",
                path: "/kho-duoc/xuat",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: NO_YSI,
            },
        ],
    },
    {
        id: "reports",
        title: "Báo cáo",
        path: "/bao-cao",
        icon: <AssessmentIcon />,
        allowedRoles: ALL,
    },
];

export const adminMenuItems = [
    ...defaultMenuItems,
    {
        id: "admin",
        title: "Quản trị hệ thống",
        path: "/admin",
        icon: <AdminPanelSettingsIcon />,
        allowedRoles: ADMIN,
            children: [
            {
                id: "admin-users",
                title: "Tài khoản người dùng",
                path: "/admin/nguoi-dung",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ADMIN,
            },
            {
                id: "admin-permissions",
                title: "Vai trò & phân quyền",
                path: "/admin/phan-quyen",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ADMIN,
            },
            {
                id: "admin-audit",
                title: "Nhật ký hệ thống",
                path: "/admin/nhat-ky",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ADMIN,
            },
        ],
    },
];

export function filterMenuByRole(items, role) {
    if (!role) return items;
    return items
        .filter((item) => (item.allowedRoles || ALL).includes(role))
        .map((item) => {
            if (!item.children) return item;
            const visibleChildren = item.children.filter((child) =>
                (child.allowedRoles || ALL).includes(role),
            );
            if (visibleChildren.length === 0) return null;
            return { ...item, children: visibleChildren };
        })
        .filter(Boolean);
}
