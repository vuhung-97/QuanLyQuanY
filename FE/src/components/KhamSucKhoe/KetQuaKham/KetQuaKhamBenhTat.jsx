import { Card, CardContent, Grid, Typography } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import DataTable from "@/components/common/DataTable.jsx";

const CHART_COLORS = ["#0B3B60", "#00B4D8", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

function XetNghiemChart({ xetNghiemTrungBinh }) {
    if (!xetNghiemTrungBinh || xetNghiemTrungBinh.length === 0) return null;
    const data = xetNghiemTrungBinh
        .filter((f) => f.avgValue != null)
        .map((f) => ({ name: f.label, value: Number(f.avgValue.toFixed(1)) }));

    if (data.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip
                    contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {data.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

const BENH_TAT_COLUMNS = [
    { key: "ten", label: "Bệnh tật theo dõi", sx: { minWidth: 250 } },
    { key: "so_luong", label: "Số ca", sx: { width: 100, textAlign: "center" } },
];

export default function KetQuaKhamBenhTat({ benhTat, xetNghiemTrungBinh, XN_FIELDS }) {
    const hasXn = xetNghiemTrungBinh && xetNghiemTrungBinh.some((f) => f.avgValue != null);

    return (
        <Grid container spacing={2.5}>
            {hasXn && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 3, height: "100%" }}>
                        <CardContent>
                            <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                                Xét nghiệm (giá trị TB)
                            </Typography>
                            <XetNghiemChart xetNghiemTrungBinh={xetNghiemTrungBinh} />
                        </CardContent>
                    </Card>
                </Grid>
            )}
            <Grid size={{ xs: 12, md: hasXn ? 6 : 12 }}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                            Bệnh tật phát hiện
                        </Typography>
                        {benhTat && benhTat.length > 0 ? (
                            <DataTable
                                columns={BENH_TAT_COLUMNS}
                                rows={benhTat}
                                minWidth={400}
                                emptyMessage="Không có dữ liệu."
                            />
                        ) : (
                            <Typography color="text.secondary" sx={{ fontStyle: "italic", py: 2, textAlign: "center" }}>
                                Không có dữ liệu bệnh tật.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
