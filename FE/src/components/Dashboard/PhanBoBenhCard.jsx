import { Card, CardContent, Typography, Stack } from "@mui/material";
import PhanLoaiBenhChart from "@/components/BaoCao/BaoCaoThang/PhanLoaiBenhChart.jsx";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";

export default function PhanBoBenhCard({
    thang,
    nam,
    onThangChange,
    onNamChange,
    data,
    loading,
}) {
    return (
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
                            onThangChange={onThangChange}
                            onNamChange={onNamChange}
                        />
                    </Stack>
                    {loading ? (
                        <Typography color="text.secondary">
                            Đang tải...
                        </Typography>
                    ) : (
                        <PhanLoaiBenhChart
                            data={data?.phan_loai_benh_kham || []}
                            title=""
                        />
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
