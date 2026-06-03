import {
    Dashboard as DashboardIcon,
    HealthAndSafety as HealthAndSafetyIcon,
    PlaylistAddCheck as PlaylistAddCheckIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    PersonSearch as PersonSearchIcon,
    Person as PersonIcon,
    Bed as BedIcon,
    MedicalServices as MedicalServicesIcon,
    Inventory2 as InventoryIcon,
    Assessment as AssessmentIcon,
} from "@mui/icons-material";

export const defaultMenuItems = [
    { id: "dashboard", title: "Tổng quan", path: "/", icon: <DashboardIcon /> },
    {
        id: "periodic-checkup",
        title: "Khám sức khỏe định kỳ",
        path: "/kham-dinh-ky",
        icon: <HealthAndSafetyIcon />,
        children: [
            { id: "periodic-schedule", title: "Lập lịch khám", path: "/kham-dinh-ky/lap-lich", icon: <PlaylistAddCheckIcon /> },
            { id: "periodic-exam", title: "Khám sức khỏe định kỳ", path: "/kham-dinh-ky/kham-suc-khoe", icon: <AssignmentTurnedInIcon /> },
            { id: "periodic-missing", title: "Danh sách quân nhân chưa khám", path: "/kham-dinh-ky/chua-kham", icon: <PersonSearchIcon /> },
        ],
    },
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
