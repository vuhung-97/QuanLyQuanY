import {
    AddCircle as AddCircleIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    Assessment as AssessmentIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    Ballot as BallotIcon,
    Bed as BedIcon,
    Dashboard as DashboardIcon,
    HealthAndSafety as HealthAndSafetyIcon,
    Healing as HealingIcon,
    History as HistoryIcon,
    Inventory2 as InventoryIcon,
    ManageAccounts as ManageAccountsIcon,
    MedicalServices as MedicalServicesIcon,
    NoteAdd as NoteAddIcon,
    Person as PersonIcon,
    PlaylistAddCheck as PlaylistAddCheckIcon,
    RemoveCircle as RemoveCircleIcon,
    Security as SecurityIcon,
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
        children: [
            {
                id: "inpatient-record",
                title: "Lập bệnh án",
                path: "/noi-tru/lap-benh-an",
                icon: <NoteAddIcon />,
                allowedRoles: ALL,
            },
            {
                id: "inpatient-treatment",
                title: "Điều trị",
                path: "/noi-tru/dieu-tri",
                icon: <HealingIcon />,
                allowedRoles: ALL,
            },
        ],
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
        title: "Thuốc và vật tư y tế",
        path: "/kho-duoc",
        icon: <InventoryIcon />,
        allowedRoles: ALL,
        children: [
            {
                id: "pharmacy-request",
                title: "Dự trù",
                path: "/kho-duoc/du-tru",
                icon: <BallotIcon />,
                allowedRoles: NO_YSI,
            },
            {
                id: "pharmacy-import",
                title: "Nhập",
                path: "/kho-duoc/nhap",
                icon: <AddCircleIcon />,
                allowedRoles: NO_YSI,
            },
            {
                id: "pharmacy-export",
                title: "Xuất",
                path: "/kho-duoc/xuat",
                icon: <RemoveCircleIcon />,
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
