import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DomainIcon from "@mui/icons-material/Domain";
import DescriptionIcon from "@mui/icons-material/Description";
import HealingIcon from "@mui/icons-material/Healing";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import InventoryIcon from "@mui/icons-material/Inventory";

export const STAT_META = [
    {
        key: "luot_kham",
        label: "Lượt khám trong ngày",
        iconName: "MedicalServices",
        color: "#00B4D8",
        bg: "rgba(0, 180, 216, 0.1)",
    },
    {
        key: "noi_tru",
        label: "Đang nội trú",
        iconName: "Domain",
        color: "#3B82F6",
        bg: "rgba(59, 130, 246, 0.1)",
    },
    {
        key: "chuyen_tuyen",
        label: "Đã chuyển tuyến",
        iconName: "Healing",
        color: "#F59E0B",
        bg: "rgba(245, 158, 11, 0.1)",
    },
];

export const STAT_META_2 = [
    {
        key: "lich_kham_sk_chua_duyet",
        label: "Lịch khám SK chưa duyệt",
        iconName: "EventNote",
        color: "#F97316",
        bg: "rgba(249, 115, 22, 0.1)",
    },
    {
        key: "nhap_vien_chua_duyet",
        label: "Nhập viện chưa duyệt",
        iconName: "LocalHospital",
        color: "#EF4444",
        bg: "rgba(239, 68, 68, 0.1)",
    },
    {
        key: "chuyen_tuyen_chua_duyet",
        label: "Chuyển tuyến chưa duyệt",
        iconName: "Healing",
        color: "#F59E0B",
        bg: "rgba(245, 158, 11, 0.1)",
    },
    {
        key: "phieu_du_tru_chua_duyet",
        label: "Phiếu dự trù chưa duyệt",
        iconName: "Description",
        color: "#8B5CF6",
        bg: "rgba(139, 92, 246, 0.1)",
    },
    {
        key: "phieu_xuat_chua_duyet",
        label: "Phiếu xuất chưa duyệt",
        iconName: "Inventory",
        color: "#EC4899",
        bg: "rgba(236, 72, 153, 0.1)",
    },
];

export const ICON_MAP = {
    MedicalServices: <MedicalServicesIcon />,
    Domain: <DomainIcon />,
    Healing: <HealingIcon />,
    Description: <DescriptionIcon />,
    EventNote: <EventNoteIcon />,
    LocalHospital: <LocalHospitalIcon />,
    Inventory: <InventoryIcon />,
};
