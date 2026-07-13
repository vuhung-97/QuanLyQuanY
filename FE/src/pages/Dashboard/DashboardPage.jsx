import { useState, useEffect } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Avatar,
} from "@mui/material";
import {
    PeopleAlt as PeopleAltIcon,
    MedicalServices as MedicalServicesIcon,
    Domain as DomainIcon,
    Description as DescriptionIcon,
    Bed as BedIcon,
    Healing as HealingIcon,
} from "@mui/icons-material";
import api from "@/services/api.js";
import ChartQuanSoKhamChuaBenh from "@/components/Dashboard/ChartQuanSoKhamChuaBenh.jsx";
import PhanLoaiBenhChart from "@/components/BaoCao/BaoCaoThang/PhanLoaiBenhChart.jsx";
import SucKhoeDonViWidget from "@/components/Dashboard/SucKhoeDonViWidget.jsx";
import SoSanhThangTruoc from "@/components/Dashboard/SoSanhThangTruoc.jsx";
import TonKhoCanhBao from "@/components/Dashboard/TonKhoCanhBao.jsx";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";
import useBaoCaoThang from "@/hooks/useBaoCaoThang.js";

const statMeta = [
    {
        key: "tong_quan_so",
        label: "Tổng quân số",
        icon: <PeopleAltIcon sx={{ color: "#0B3B60" }} />,
        bg: "rgba(11, 59, 96, 0.1)",
    },
    {
        key: "luot_kham",
        label: "Lượt khám trong ngày",
        icon: <MedicalServicesIcon sx={{ color: "#00B4D8" }} />,
        bg: "rgba(0, 180, 216, 0.1)",
    },
    {
        key: "noi_tru",
        label: "Đang nội trú",
        icon: <DomainIcon sx={{ color: "#3B82F6" }} />,
        bg: "rgba(59, 130, 246, 0.1)",
    },
    {
        key: "chuyen_tuyen",
        label: "Đang chuyển tuyến",
        icon: <HealingIcon sx={{ color: "#F59E0B" }} />,
        bg: "rgba(245, 158, 11, 0.1)",
    },
    {
        key: "don_thuoc",
        label: "Đơn thuốc đã kê trong ngày",
        icon: <DescriptionIcon sx={{ color: "#10B981" }} />,
        bg: "rgba(16, 185, 129, 0.1)",
    },
    {
        key: "tong_giuong",
        label: "Tổng giường",
        icon: <BedIcon sx={{ color: "#8B5CF6" }} />,
        bg: "rgba(139, 92, 246, 0.1)",
    },
    {
        key: "giuong_trong",
        label: "Giường trống",
        icon: <BedIcon sx={{ color: "#EC4899" }} />,
        bg: "rgba(236, 72, 153, 0.1)",
    },
];

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const {
        thang,
        setThang,
        nam,
        setNam,
        data: thangData,
        loading: thangLoading,
    } = useBaoCaoThang();

    useEffect(() => {
        api.get("/bao-cao/tong-quan")
            .then((res) => setStats(res.data))
            .catch(() => {});
    }, []);

    const flatStats = stats
        ? {
              luot_kham: stats.hom_nay.luot_kham,
              noi_tru: stats.hom_nay.noi_tru,
              chuyen_tuyen: stats.hom_nay.chuyen_tuyen,
              don_thuoc: stats.hom_nay.don_thuoc,
              tong_giuong: stats.tong_quan.tong_giuong,
              giuong_trong: stats.tong_quan.giuong_trong,
              tong_quan_so: stats.tong_quan.tong_quan_so,
          }
        : {};

    return (
        <Stack spacing={3}>
            {/* 7 Stat Cards */}
            <Grid container spacing={2.5}>
                {statMeta.map((m, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={m.key}>
                        <Card
                            sx={{
                                p: 1,
                                borderRadius: 3,
                                boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
                            }}
                        >
                            <CardContent sx={{ p: "16px !important" }}>
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    sx={{ mb: 1, alignItems: "flex-start" }}
                                >
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            bgcolor: m.bg,
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {m.icon}
                                    </Avatar>
                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {m.label}
                                    </Typography>
                                </Stack>
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ color: "#1E293B", ml: 0.5 }}
                                >
                                    {flatStats[m.key] ?? "--"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <ChartQuanSoKhamChuaBenh />

            <SoSanhThangTruoc
                thang={thang}
                nam={nam}
                currentData={thangData}
            />

            <TonKhoCanhBao />

            {/* Bottom Row: Disease Distribution + Unit Health */}
            <Grid container spacing={2.5} alignItems="stretch">
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <CardContent
                            sx={{
                                p: "24px !important",
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Stack spacing={2} sx={{ flex: 1 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{ color: "#1E293B", mr: 2 }}
                                    >
                                        Phân bố bệnh theo nhóm
                                    </Typography>
                                    <YearMonthFilter
                                        thang={thang}
                                        nam={nam}
                                        onThangChange={setThang}
                                        onNamChange={setNam}
                                    />
                                </Stack>
                                {thangLoading ? (
                                    <Typography color="text.secondary">
                                        Đang tải...
                                    </Typography>
                                ) : (
                                    <PhanLoaiBenhChart
                                        data={
                                            thangData?.phan_loai_benh_kham || []
                                        }
                                        title=""
                                    />
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
                    <SucKhoeDonViWidget sx={{ flex: 1 }} />
                </Grid>
            </Grid>
        </Stack>
    );
}
