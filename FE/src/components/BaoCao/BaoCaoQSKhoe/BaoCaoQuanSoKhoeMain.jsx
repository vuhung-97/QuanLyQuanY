import { Stack, Typography, Card, CardContent, Grid } from "@mui/material";
import DataTable from "@/components/common/DataTable.jsx";
import LoadingAlert from "@/components/common/LoadingAlert.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {
    Groups as GroupsIcon,
    Sick as SickIcon,
    LocalHospital as LocalHospitalIcon,
    Mood as MoodIcon,
} from "@mui/icons-material";
import useBaoCaoQuanSoKhoe from "@/hooks/useBaoCaoQuanSoKhoe.jsx";
import BaoCaoToolbar from "../BaoCaoToolbar.jsx";
import BaoCaoQuanSoKhoePrintDialog from "./BaoCaoQuanSoKhoePrintDialog.jsx";
import { QUAN_SO_KHOE_COLUMNS, CHART_COLORS } from "@/constants/bao_cao.js";

export default function BaoCaoQuanSoKhoeMain() {
    const {
        thang, setThang, nam, setNam,
        data, loading, error,
        fetchData, treeRows, chartData,
        printOpen, setPrintOpen,
    } = useBaoCaoQuanSoKhoe();

    return (
        <Stack spacing={3}>
            <BaoCaoToolbar
                thang={thang}
                nam={nam}
                onThangChange={setThang}
                onNamChange={setNam}
                onPrint={() => setPrintOpen(true)}
                onRefresh={fetchData}
                loading={loading}
                dataAvailable={!!data}
            />

            <Typography variant="h3" sx={{ color: "text.primary" }}>
                Quân số khỏe tháng {thang}/{nam}
            </Typography>

            <LoadingAlert
                loading={loading}
                error={error}
                empty={!data}
                emptyMessage=""
            />

            {data && (
                <>
                    <StatCardGrid
                        items={[
                            {
                                label: "Tổng quân số",
                                value: data.tong_quan.tong_quan_so,
                                icon: <GroupsIcon />,
                                color: "#0B3B60",
                                bg: "rgba(11, 59, 96, 0.1)",
                            },
                            {
                                label: "Người ốm",
                                value: data.tong_quan.tong_nguoi_om,
                                icon: <SickIcon />,
                                color: "#EF4444",
                                bg: "rgba(239, 68, 68, 0.1)",
                            },
                            {
                                label: "Lượt ốm",
                                value: data.tong_quan.tong_luot_om,
                                icon: <LocalHospitalIcon />,
                                color: "#F59E0B",
                                bg: "rgba(245, 158, 11, 0.1)",
                            },
                            {
                                label: "Quân số khỏe",
                                value: data.tong_quan.quan_so_khoe,
                                icon: <MoodIcon />,
                                color: "#10B981",
                                bg: "rgba(16, 185, 129, 0.1)",
                            },
                        ]}
                    />

                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                                Chi tiết theo đơn vị
                            </Typography>
                            <DataTable
                                columns={QUAN_SO_KHOE_COLUMNS}
                                rows={treeRows}
                                minWidth={900}
                                emptyMessage="Không có dữ liệu đơn vị."
                                sx={{ maxHeight: 600, overflow: "auto" }}
                                rowSx={(row) => row._rowStyle}
                            />
                        </CardContent>
                    </Card>

                    {chartData.length > 0 && (
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                                    So sánh tỷ lệ quân số khỏe giữa các đơn vị
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <ResponsiveContainer width="100%" height={420}>
                                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fontSize: 12, fill: "#64748B" }}
                                                    angle={-20}
                                                    textAnchor="end"
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{ fontSize: 12, fill: "#64748B" }}
                                                    tickFormatter={(v) => `${v}%`}
                                                />
                                                <Tooltip
                                                    formatter={(value) => `${value}%`}
                                                    contentStyle={{
                                                        borderRadius: 8,
                                                        border: "none",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                    }}
                                                />
                                                <Bar dataKey="ty_le" name="Tỷ lệ" radius={[6, 6, 0, 0]} maxBarSize={120}>
                                                    {chartData.map((_, idx) => (
                                                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            <BaoCaoQuanSoKhoePrintDialog
                open={printOpen}
                onClose={() => setPrintOpen(false)}
                data={data}
            />
        </Stack>
    );
}
