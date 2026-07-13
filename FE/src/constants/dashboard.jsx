import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DomainIcon from "@mui/icons-material/Domain";
import DescriptionIcon from "@mui/icons-material/Description";
import BedIcon from "@mui/icons-material/Bed";
import HealingIcon from "@mui/icons-material/Healing";

export const STAT_META = [
    {
        key: "tong_quan_so",
        label: "Tổng quân số",
        iconName: "PeopleAlt",
        color: "#0B3B60",
        bg: "rgba(11, 59, 96, 0.1)",
    },
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
        label: "Đang chuyển tuyến",
        iconName: "Healing",
        color: "#F59E0B",
        bg: "rgba(245, 158, 11, 0.1)",
    },
    {
        key: "don_thuoc",
        label: "Đơn thuốc đã kê trong ngày",
        iconName: "Description",
        color: "#10B981",
        bg: "rgba(16, 185, 129, 0.1)",
    },
    {
        key: "tong_giuong",
        label: "Tổng giường",
        iconName: "Bed",
        color: "#8B5CF6",
        bg: "rgba(139, 92, 246, 0.1)",
    },
    {
        key: "giuong_trong",
        label: "Giường trống",
        iconName: "Bed",
        color: "#EC4899",
        bg: "rgba(236, 72, 153, 0.1)",
    },
];

export const ICON_MAP = {
    PeopleAlt: <PeopleAltIcon />,
    MedicalServices: <MedicalServicesIcon />,
    Domain: <DomainIcon />,
    Healing: <HealingIcon />,
    Description: <DescriptionIcon />,
    Bed: <BedIcon />,
};
