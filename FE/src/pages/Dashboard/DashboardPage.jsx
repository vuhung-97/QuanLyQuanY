import { Stack, Grid } from "@mui/material";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import ChartQuanSoKhamChuaBenh from "@/components/Dashboard/ChartQuanSoKhamChuaBenh.jsx";
import SoSanhThangTruoc from "@/components/Dashboard/SoSanhThangTruoc.jsx";
import TonKhoCanhBao from "@/components/Dashboard/TonKhoCanhBao.jsx";
import PhanBoBenhCard from "@/components/Dashboard/PhanBoBenhCard.jsx";
import SucKhoeDonViWidget from "@/components/Dashboard/SucKhoeDonViWidget.jsx";
import useDashboardStats from "@/hooks/useDashboardStats.js";
import useBaoCaoThang from "@/hooks/useBaoCaoThang.js";
import { STAT_META, ICON_MAP } from "@/constants/dashboard.jsx";

export default function DashboardPage() {
    const { flatStats, loading: statsLoading } = useDashboardStats();
    const {
        thang,
        setThang,
        nam,
        setNam,
        data: thangData,
        loading: thangLoading,
    } = useBaoCaoThang();

    const statItems = STAT_META.map((m) => ({
        label: m.label,
        value: flatStats[m.key] ?? "--",
        icon: ICON_MAP[m.iconName],
        color: m.color,
        bg: m.bg,
    }));

    return (
        <Stack spacing={3}>
            <StatCardGrid items={statItems} loading={statsLoading} />

            <ChartQuanSoKhamChuaBenh />

            <SoSanhThangTruoc
                thang={thang}
                nam={nam}
                currentData={thangData}
            />

            <TonKhoCanhBao />

            <Grid container spacing={2.5} alignItems="stretch">
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
