import {
    Dashboard as DashboardIcon,
    HealthAndSafety as HealthAndSafetyIcon,
    Person as PersonIcon,
    Bed as BedIcon,
    MedicalServices as MedicalServicesIcon,
    Inventory2 as InventoryIcon,
    Assessment as AssessmentIcon,
} from "@mui/icons-material";

export const defaultMenuItems = [
    { id: "dashboard", title: "Tổng quan", path: "/", icon: <DashboardIcon /> },
    { id: "periodic-checkup", title: "Khám sức khỏe định kỳ", path: "/kham-dinh-ky", icon: <HealthAndSafetyIcon /> },
    { id: "personnel", title: "Hồ sơ quân nhân", path: "/ho-so", icon: <PersonIcon /> },
    { id: "inpatient", title: "Quản lý nội trú", path: "/noi-tru", icon: <BedIcon /> },
    { id: "examination", title: "Khám bệnh", path: "/kham-benh", icon: <MedicalServicesIcon /> },
    { id: "pharmacy", title: "Kho dược", path: "/kho-duoc", icon: <InventoryIcon /> },
    { id: "reports", title: "Báo cáo", path: "/bao-cao", icon: <AssessmentIcon /> },
];

export function filterMenuByRole(items, allowedIds) {
    if (!Array.isArray(allowedIds) || allowedIds.length === 0) return items;
    const allowSet = new Set(allowedIds);
    return items.filter((item) => allowSet.has(item.id));
}
