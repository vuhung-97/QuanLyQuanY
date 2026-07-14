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
import {
    ALL_STAFF,
    ALL_WITH_QN,
    ADMIN_ONLY,
} from "@/constants/roleConstants.js";

export const defaultMenuItems = [
    {
        id: "dashboard",
        title: "Tổng quan",
        path: "/",
        icon: <DashboardIcon />,
        allowedRoles: ALL_WITH_QN,
    },
    {
        id: "periodic-checkup",
        title: "Khám sức khỏe định kỳ",
        path: "/kham-dinh-ky",
        icon: <HealthAndSafetyIcon />,
        allowedRoles: ALL_STAFF,
            children: [
            {
                id: "periodic-schedule",
                title: "Lập lịch khám",
                path: "/kham-dinh-ky/lap-lich",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
            {
                id: "periodic-exam",
                title: "Khám sức khỏe",
                path: "/kham-dinh-ky/kham-suc-khoe",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
            {
                id: "periodic-result",
                title: "Kết quả khám tổng hợp",
                path: "/kham-dinh-ky/ket-qua-kham",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
        ],
    },
    {
        id: "inpatient",
        title: "Quản lý nội trú",
        path: "/noi-tru",
        icon: <BedIcon />,
        allowedRoles: ALL_STAFF,
            children: [
            {
                id: "inpatient-list",
                title: "Danh sách nội trú",
                path: "/noi-tru/danh-sach",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
            {
                id: "inpatient-record",
                title: "Lập bệnh án",
                path: "/noi-tru/lap-benh-an",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
            {
                id: "inpatient-bed",
                title: "Quản lý phòng/giường",
                path: "/noi-tru/quan-ly-phong-giuong",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
        ],
    },
    {
        id: "examination",
        title: "Khám bệnh cho quân nhân",
        path: "/kham-benh",
        icon: <MedicalServicesIcon />,
        allowedRoles: ALL_STAFF,
            children: [
            {
                id: "examination-list",
                title: "Khám bệnh",
                path: "/kham-benh/Kham-benh-cho-quan-nhan",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
            {
                id: "medicine-dispensing",
                title: "Cấp thuốc",
                path: "/kham-benh/Cap-thuoc",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
            {
                id: "referral",
                title: "Chuyển tuyến",
                path: "/kham-benh/Chuyen-tuyen",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
            {
                id: "disease-catalog",
                title: "DM nhóm bệnh & triệu chứng",
                path: "/kham-benh/danh-muc",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ALL_STAFF,
            },
        ],
    },
    {
                id: "pharmacy",
                title: "Thuốc và vật tư y tế",
                path: "/kho-duoc",
                icon: <InventoryIcon />,
                allowedRoles: ALL_STAFF,
                    children: [
                    {
                        id: "pharmacy-inventory",
                        title: "Kho",
                        path: "/kho-duoc/kho",
                        icon: <CircleIcon sx={{ fontSize: 12 }} />,
                        allowedRoles: ALL_STAFF,
                    },
                    {
                        id: "pharmacy-request",
                        title: "Dự trù",
                        path: "/kho-duoc/du-tru",
                        icon: <CircleIcon sx={{ fontSize: 12 }} />,
                        allowedRoles: ALL_STAFF,
                    },
                    {
                        id: "pharmacy-import",
                        title: "Nhập",
                        path: "/kho-duoc/nhap",
                        icon: <CircleIcon sx={{ fontSize: 12 }} />,
                        allowedRoles: ALL_STAFF,
                    },
                    {
                        id: "pharmacy-export",
                        title: "Xuất",
                        path: "/kho-duoc/xuat",
                        icon: <CircleIcon sx={{ fontSize: 12 }} />,
                        allowedRoles: ALL_STAFF,
                    },
                ],
            },
    {
        id: "reports",
        title: "Báo cáo",
        path: "/bao-cao",
        icon: <AssessmentIcon />,
        allowedRoles: ALL_WITH_QN,
    },
];

export const adminMenuItems = [
    ...defaultMenuItems,
    {
        id: "admin",
        title: "Quản trị hệ thống",
        path: "/admin",
        icon: <AdminPanelSettingsIcon />,
        allowedRoles: ADMIN_ONLY,
            children: [
            {
                id: "admin-users",
                title: "Tài khoản người dùng",
                path: "/admin/nguoi-dung",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ADMIN_ONLY,
            },
            {
                id: "admin-permissions",
                title: "Vai trò & phân quyền",
                path: "/admin/phan-quyen",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ADMIN_ONLY,
            },
            {
                id: "admin-audit",
                title: "Nhật ký hệ thống",
                path: "/admin/nhat-ky",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: ADMIN_ONLY,
            },
        ],
    },
];

export function filterMenuByRole(items, role) {
    if (!role) return items;
    return items
        .filter((item) => (item.allowedRoles || ALL_STAFF).includes(role))
        .map((item) => {
            if (!item.children) return item;
            const visibleChildren = item.children.filter((child) =>
                (child.allowedRoles || ALL_STAFF).includes(role),
            );
            if (visibleChildren.length === 0) return null;
            return { ...item, children: visibleChildren };
        })
        .filter(Boolean);
}
