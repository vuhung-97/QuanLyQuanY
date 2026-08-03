import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography, Grid } from "@mui/material";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import ChartQuanSoKhamChuaBenh from "@/components/Dashboard/ChartQuanSoKhamChuaBenh.jsx";
import SoSanhThangTruoc from "@/components/Dashboard/SoSanhThangTruoc.jsx";
import PhanBoBenhCard from "@/components/Dashboard/PhanBoBenhCard.jsx";
import SucKhoeDonViWidget from "@/components/Dashboard/SucKhoeDonViWidget.jsx";
import DotKhamSucKhoeWidget from "@/components/Dashboard/DotKhamSucKhoeWidget.jsx";
import useKhoList from "@/hooks/useKhoList.js";
import useThresholdSettings from "@/hooks/useThresholdSettings.js";
import { WarningAmber as WarningAmberIcon } from "@mui/icons-material";
import useDashboardStats from "@/hooks/useDashboardStats.js";
import useBaoCaoThang from "@/hooks/useBaoCaoThang.js";
import { STAT_META, STAT_META_2, ICON_MAP } from "@/constants/dashboard.jsx";
import { getCurrentUser } from "@/services/api.js";
import { ROLES } from "@/constants/roleConstants.js";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { flatStats, loading: statsLoading } = useDashboardStats();
    const role = getCurrentUser()?.role;
    const canXemChoXuLy =
        role === ROLES.ADMIN || role === ROLES.CNQY;
    const { thresholds } = useThresholdSettings();
    const kho = useKhoList(thresholds);
    const {
        thang,
        setThang,
        nam,
        setNam,
        data: thangData,
        loading: thangLoading,
    } = useBaoCaoThang();

    const NAV_MAP = {
        luot_kham: "/kham-benh/Kham-benh-cho-quan-nhan",
        noi_tru: "/noi-tru/danh-sach",
        chuyen_tuyen:
            "/kham-benh/Chuyen-tuyen?filter=đã_chuyển_tuyến&all=1",
        lich_kham_sk_chua_duyet:
            "/kham-dinh-ky/lap-lich?filter=Chờ duyệt",
        nhap_vien_chua_duyet: "/noi-tru/lap-benh-an",
        chuyen_tuyen_chua_duyet: "/kham-benh/Chuyen-tuyen",
        phieu_du_tru_chua_duyet: "/kho-duoc/du-tru?filter=chua_duyet",
        phieu_xuat_chua_duyet: "/kho-duoc/xuat?filter=cho_duyet",
        ton_kho_thap: "/kho-duoc/kho?filter=low-stock",
    };

    const handleCardClick = (key) => {
        const path = NAV_MAP[key];
        if (path) navigate(path);
    };

    const statItems = [
        ...STAT_META.map((m) => ({
            label: m.label,
            value: flatStats[m.key] ?? "--",
            icon: ICON_MAP[m.iconName],
            color: m.color,
            bg: m.bg,
            filterKey: m.key,
        })),
        {
            label: "Thuốc sắp hết",
            value:
                kho.statItems.find((s) => s.filterKey === "low-stock")?.value ??
                "--",
            icon: <WarningAmberIcon />,
            color: "#F59E0B",
            bg: "#FEF3C7",
            filterKey: "ton_kho_thap",
        },
    ];

    const pendingItems = STAT_META_2.map((m) => ({
        label: m.label,
        value: flatStats[m.key] ?? "--",
        icon: ICON_MAP[m.iconName],
        color: m.color,
        bg: m.bg,
        filterKey: m.key,
    }));

    return (
        <Stack spacing={3}>
            <Box>
                <Typography
                    variant="h4"
                    sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                >
                    Tổng quan
                </Typography>
                <StatCardGrid
                    items={statItems}
                    loading={statsLoading || kho.loading}
                    onCardClick={handleCardClick}
                />
            </Box>

            {canXemChoXuLy && (
                <Box>
                    <Typography
                        variant="h4"
                        sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                    >
                        Chờ xử lý
                    </Typography>
                    <StatCardGrid
                        items={pendingItems}
                        loading={statsLoading}
                        onCardClick={handleCardClick}
                    />
                </Box>
            )}

            <DotKhamSucKhoeWidget />

            <ChartQuanSoKhamChuaBenh />

            <SoSanhThangTruoc thang={thang} nam={nam} currentData={thangData} />

            <Grid container spacing={2.5} sx={{ alignItems: "stretch" }}>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
                    <PhanBoBenhCard
                        thang={thang}
                        nam={nam}
                        onThangChange={setThang}
                        onNamChange={setNam}
                        data={thangData}
                        loading={thangLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
                    <SucKhoeDonViWidget sx={{ flex: 1 }} />
                </Grid>
            </Grid>
        </Stack>
    );
}
