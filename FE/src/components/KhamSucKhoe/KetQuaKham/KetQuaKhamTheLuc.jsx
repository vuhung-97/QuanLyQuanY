import {
    Straighten as HeightIcon,
    MonitorWeight as WeightIcon,
    Favorite as HeartIcon,
    WaterDrop as BloodIcon,
} from "@mui/icons-material";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";

export default function KetQuaKhamTheLuc({ theLucTrungBinh }) {
    if (!theLucTrungBinh) return null;

    const items = [
        {
            label: "Chiều cao TB",
            value: theLucTrungBinh.chieu_cao != null ? `${theLucTrungBinh.chieu_cao.toFixed(1)} cm` : "—",
            icon: <HeightIcon />,
            color: "#0B3B60",
            bg: "rgba(11, 59, 96, 0.1)",
        },
        {
            label: "Cân nặng TB",
            value: theLucTrungBinh.can_nang != null ? `${theLucTrungBinh.can_nang.toFixed(1)} kg` : "—",
            icon: <WeightIcon />,
            color: "#00B4D8",
            bg: "rgba(0, 180, 216, 0.1)",
        },
        {
            label: "BMI TB",
            value: theLucTrungBinh.bmi != null ? theLucTrungBinh.bmi.toFixed(1) : "—",
            icon: <WeightIcon />,
            color: "#3B82F6",
            bg: "rgba(59, 130, 246, 0.1)",
        },
        {
            label: "Mạch TB",
            value: theLucTrungBinh.mach != null ? `${theLucTrungBinh.mach.toFixed(0)} l/ph` : "—",
            icon: <HeartIcon />,
            color: "#EF4444",
            bg: "rgba(239, 68, 68, 0.1)",
        },
        {
            label: "HATT TB",
            value: theLucTrungBinh.huyet_ap_tam_thu != null ? `${theLucTrungBinh.huyet_ap_tam_thu.toFixed(0)} mmHg` : "—",
            icon: <BloodIcon />,
            color: "#F59E0B",
            bg: "rgba(245, 158, 11, 0.1)",
        },
        {
            label: "HATTr TB",
            value: theLucTrungBinh.huyet_ap_tam_truong != null ? `${theLucTrungBinh.huyet_ap_tam_truong.toFixed(0)} mmHg` : "—",
            icon: <BloodIcon />,
            color: "#10B981",
            bg: "rgba(16, 185, 129, 0.1)",
        },
    ];

    return (
        <StatCardGrid
            items={items}
            sizeOverrides={{
                "Chiều cao TB": { md: 4 },
                "Cân nặng TB": { md: 4 },
                "BMI TB": { md: 4 },
                "Mạch TB": { md: 4 },
                "HATT TB": { md: 4 },
                "HATTr TB": { md: 4 },
            }}
        />
    );
}
