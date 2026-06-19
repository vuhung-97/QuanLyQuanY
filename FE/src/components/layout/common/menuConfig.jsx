import {
    Dashboard as DashboardIcon,
    HealthAndSafety as HealthAndSafetyIcon,
    PlaylistAddCheck as PlaylistAddCheckIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    Person as PersonIcon,
    Bed as BedIcon,
    MedicalServices as MedicalServicesIcon,
    Inventory2 as InventoryIcon,
    Assessment as AssessmentIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    ManageAccounts as ManageAccountsIcon,
    Security as SecurityIcon,
    History as HistoryIcon,
} from "@mui/icons-material";

export const defaultMenuItems = [
    { id: "dashboard", title: "Tổng quan", path: "/", icon: <DashboardIcon /> },
    {
        id: "periodic-checkup",
        title: "Khám sức khỏe định kỳ",
        path: "/kham-dinh-ky",
        icon: <HealthAndSafetyIcon />,
        children: [
            {
                id: "periodic-schedule",
                title: "Lập lịch khám",
                path: "/kham-dinh-ky/lap-lich",
                icon: <PlaylistAddCheckIcon />,
            },
            {
                id: "periodic-exam",
                title: "Khám sức khỏe định kỳ",
                path: "/kham-dinh-ky/kham-suc-khoe",
                icon: <AssignmentTurnedInIcon />,
            },
        ],
    },
    {
        id: "inpatient",
        title: "Quản lý nội trú",
        path: "/noi-tru",
        icon: <BedIcon />,
    },
    {
        id: "examination",
        title: "Khám bệnh",
        path: "/kham-benh",
        icon: <MedicalServicesIcon />,
        children: [
            {
                id: "examination-list",
                title: "Khám bệnh cho quân nhân",
                path: "/kham-benh/Kham-benh-cho-quan-nhan",
                icon: <PersonIcon />,
            },
            {
                id: "medicine-dispensing",
                title: "Cấp thuốc",
                path: "/kham-benh/Cap-thuoc",
                icon: <MedicalServicesIcon />,
            },
            {
                id: "referral",
                title: "Chuyển tuyến",
                path: "/kham-benh/Chuyen-tuyen",
                icon: <AssignmentTurnedInIcon />,
            },
        ],
    },
    {
        id: "pharmacy",
        title: "Kho dược",
        path: "/kho-duoc",
        icon: <InventoryIcon />,
    },
    {
        id: "reports",
        title: "Báo cáo",
        path: "/bao-cao",
        icon: <AssessmentIcon />,
    },
];

export const adminMenuItems = [
    ...defaultMenuItems,
    {
        id: "admin",
        title: "Quản trị hệ thống",
        path: "/admin",
        icon: <AdminPanelSettingsIcon />,
        children: [
            {
                id: "admin-users",
                title: "Tài khoản người dùng",
                path: "/admin/nguoi-dung",
                icon: <ManageAccountsIcon />,
            },
            {
                id: "admin-permissions",
                title: "Vai trò & phân quyền",
                path: "/admin/phan-quyen",
                icon: <SecurityIcon />,
            },
            {
                id: "admin-audit",
                title: "Nhật ký hệ thống",
                path: "/admin/nhat-ky",
                icon: <HistoryIcon />,
            },
        ],
    },
];

export function filterMenuByRole(items, allowedIds) {
    if (!Array.isArray(allowedIds) || allowedIds.length === 0) return items;
    const allowSet = new Set(allowedIds);
    return items.filter((item) => allowSet.has(item.id));
}
