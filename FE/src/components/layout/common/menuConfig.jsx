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

const ALL = ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI", "ROLE_YSI"];
const NO_YSI = ["ROLE_ADMIN", "ROLE_CNQY", "ROLE_BACSI"];
const ADMIN = ["ROLE_ADMIN", "ROLE_CNQY"];

export const defaultMenuItems = [
    { id: "dashboard", title: "Tổng quan", path: "/", icon: <DashboardIcon />, allowedRoles: ALL },
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
                icon: <PlaylistAddCheckIcon />,
                allowedRoles: NO_YSI,
            },
            {
                id: "periodic-exam",
                title: "Khám sức khỏe định kỳ",
                path: "/kham-dinh-ky/kham-suc-khoe",
                icon: <AssignmentTurnedInIcon />,
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
    },
    {
        id: "examination",
        title: "Khám bệnh",
        path: "/kham-benh",
        icon: <MedicalServicesIcon />,
        allowedRoles: ALL,
        children: [
            {
                id: "examination-list",
                title: "Khám bệnh cho quân nhân",
                path: "/kham-benh/Kham-benh-cho-quan-nhan",
                icon: <PersonIcon />,
                allowedRoles: NO_YSI,
            },
            {
                id: "medicine-dispensing",
                title: "Cấp thuốc",
                path: "/kham-benh/Cap-thuoc",
                icon: <MedicalServicesIcon />,
                allowedRoles: ALL,
            },
            {
                id: "referral",
                title: "Chuyển tuyến",
                path: "/kham-benh/Chuyen-tuyen",
                icon: <AssignmentTurnedInIcon />,
                allowedRoles: ALL,
            },
        ],
    },
    {
        id: "pharmacy",
        title: "Kho dược",
        path: "/kho-duoc",
        icon: <InventoryIcon />,
        allowedRoles: ALL,
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
                icon: <ManageAccountsIcon />,
                allowedRoles: ADMIN,
            },
            {
                id: "admin-permissions",
                title: "Vai trò & phân quyền",
                path: "/admin/phan-quyen",
                icon: <SecurityIcon />,
                allowedRoles: ADMIN,
            },
            {
                id: "admin-audit",
                title: "Nhật ký hệ thống",
                path: "/admin/nhat-ky",
                icon: <HistoryIcon />,
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
