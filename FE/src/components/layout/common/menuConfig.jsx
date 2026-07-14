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
import { MENU_ROLE_MAP } from "@/constants/roleConstants.js";

export const defaultMenuItems = [
    {
        id: "dashboard",
        title: "Tổng quan",
        path: "/",
        icon: <DashboardIcon />,
        allowedRoles: MENU_ROLE_MAP["tong-quan"],
    },
    {
        id: "periodic-checkup",
        title: "Khám sức khỏe định kỳ",
        path: "/kham-dinh-ky",
        icon: <HealthAndSafetyIcon />,
        allowedRoles: MENU_ROLE_MAP["kham-dinh-ky"],
            children: [
            {
                id: "periodic-schedule",
                title: "Lập lịch khám",
                path: "/kham-dinh-ky/lap-lich",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["lap-lich"],
            },
            {
                id: "periodic-exam",
                title: "Khám sức khỏe",
                path: "/kham-dinh-ky/kham-suc-khoe",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["kham-suc-khoe"],
            },
            {
                id: "periodic-result",
                title: "Kết quả khám tổng hợp",
                path: "/kham-dinh-ky/ket-qua-kham",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["ket-qua-kham"],
            },
        ],
    },
    {
        id: "inpatient",
        title: "Quản lý nội trú",
        path: "/noi-tru",
        icon: <BedIcon />,
        allowedRoles: MENU_ROLE_MAP["noi-tru"],
            children: [
            {
                id: "inpatient-list",
                title: "Danh sách nội trú",
                path: "/noi-tru/danh-sach",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["danh-sach-noi-tru"],
            },
            {
                id: "inpatient-record",
                title: "Lập bệnh án",
                path: "/noi-tru/lap-benh-an",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["lap-benh-an"],
            },
            {
                id: "inpatient-bed",
                title: "Quản lý phòng/giường",
                path: "/noi-tru/quan-ly-phong-giuong",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["quan-ly-phong-giuong"],
            },
        ],
    },
    {
        id: "examination",
        title: "Khám bệnh cho quân nhân",
        path: "/kham-benh",
        icon: <MedicalServicesIcon />,
        allowedRoles: MENU_ROLE_MAP["kham-benh"],
            children: [
            {
                id: "examination-list",
                title: "Khám bệnh",
                path: "/kham-benh/Kham-benh-cho-quan-nhan",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["kham-benh-cho-quan-nhan"],
            },
            {
                id: "medicine-dispensing",
                title: "Cấp thuốc",
                path: "/kham-benh/Cap-thuoc",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["cap-thuoc"],
            },
            {
                id: "referral",
                title: "Chuyển tuyến",
                path: "/kham-benh/Chuyen-tuyen",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["chuyen-tuyen"],
            },
            {
                id: "disease-catalog",
                title: "DM nhóm bệnh & triệu chứng",
                path: "/kham-benh/danh-muc",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["danh-muc-benh"],
            },
        ],
    },
    {
                id: "pharmacy",
                title: "Thuốc và vật tư y tế",
                path: "/kho-duoc",
                icon: <InventoryIcon />,
                allowedRoles: MENU_ROLE_MAP["kho-duoc"],
                    children: [
                    {
                        id: "pharmacy-inventory",
                        title: "Kho",
                        path: "/kho-duoc/kho",
                        icon: <CircleIcon sx={{ fontSize: 12 }} />,
                        allowedRoles: MENU_ROLE_MAP["kho"],
                    },
                    {
                        id: "pharmacy-request",
                        title: "Dự trù",
                        path: "/kho-duoc/du-tru",
                        icon: <CircleIcon sx={{ fontSize: 12 }} />,
                        allowedRoles: MENU_ROLE_MAP["du-tru"],
                    },
                    {
                        id: "pharmacy-import",
                        title: "Nhập",
                        path: "/kho-duoc/nhap",
                        icon: <CircleIcon sx={{ fontSize: 12 }} />,
                        allowedRoles: MENU_ROLE_MAP["nhap-kho"],
                    },
                    {
                        id: "pharmacy-export",
                        title: "Xuất",
                        path: "/kho-duoc/xuat",
                        icon: <CircleIcon sx={{ fontSize: 12 }} />,
                        allowedRoles: MENU_ROLE_MAP["xuat-kho"],
                    },
                ],
            },
    {
        id: "reports",
        title: "Báo cáo",
        path: "/bao-cao",
        icon: <AssessmentIcon />,
        allowedRoles: MENU_ROLE_MAP["bao-cao"],
    },
];

export const adminMenuItems = [
    ...defaultMenuItems,
    {
        id: "admin",
        title: "Quản trị hệ thống",
        path: "/admin",
        icon: <AdminPanelSettingsIcon />,
        allowedRoles: MENU_ROLE_MAP["quan-tri"],
            children: [
            {
                id: "admin-users",
                title: "Tài khoản người dùng",
                path: "/admin/nguoi-dung",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["tai-khoan"],
            },
            {
                id: "admin-permissions",
                title: "Vai trò & phân quyền",
                path: "/admin/phan-quyen",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["phan-quyen"],
            },
            {
                id: "admin-audit",
                title: "Nhật ký hệ thống",
                path: "/admin/nhat-ky",
                icon: <CircleIcon sx={{ fontSize: 12 }} />,
                allowedRoles: MENU_ROLE_MAP["nhat-ky"],
            },
        ],
    },
];

export function filterMenuByRole(items, role) {
    if (!role) return items;
    return items
        .filter((item) => {
            const allowed = item.allowedRoles;
            if (!allowed) {
                console.warn(`[Phân quyền] Thiếu mapping role cho menu: ${item.id}`);
                return false;
            }
            return allowed.includes(role);
        })
        .map((item) => {
            if (!item.children) return item;
            const visibleChildren = item.children.filter((child) => {
                const allowed = child.allowedRoles;
                if (!allowed) {
                    console.warn(`[Phân quyền] Thiếu mapping role cho menu con: ${child.id}`);
                    return false;
                }
                return allowed.includes(role);
            });
            if (visibleChildren.length === 0) return null;
            return { ...item, children: visibleChildren };
        })
        .filter(Boolean);
}
