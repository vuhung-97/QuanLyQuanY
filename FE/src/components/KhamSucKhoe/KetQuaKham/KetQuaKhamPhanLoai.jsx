import { Card, CardContent, Grid, Typography } from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function KetQuaKhamPhanLoai({ phanBoPhanLoai, lamSangBatThuong }) {
    if (!phanBoPhanLoai || phanBoPhanLoai.length === 0) return null;

    return (
        <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                            Phân bố phân loại sức khỏe
                        </Typography>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={phanBoPhanLoai}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={50}
                                    label={({ name, ty_le }) => `${name}: ${ty_le}%`}
                                >
                                    {phanBoPhanLoai.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [
                                        `${value} người`,
                                        name,
                                    ]}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ color: "#64748B", fontSize: 13 }}>
                                            {value}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                            Lâm sàng bất thường
                        </Typography>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: 14,
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: "8px 4px", borderBottom: "2px solid #E2E8F0" }}>
                                        Chuyên khoa
                                    </th>
                                    <th style={{ textAlign: "right", padding: "8px 4px", borderBottom: "2px solid #E2E8F0" }}>
                                        Số lượng
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {lamSangBatThuong?.map((item) => {
                                    if (!item || !item.label) return null;
                                    return (
                                        <tr key={item.label}>
                                            <td style={{ padding: "6px 4px", borderBottom: "1px solid #F1F5F9" }}>
                                                {item.label}
                                            </td>
                                            <td style={{
                                                padding: "6px 4px",
                                                borderBottom: "1px solid #F1F5F9",
                                                textAlign: "right",
                                                fontWeight: 600,
                                                color: item.value > 0 ? "#EF4444" : undefined,
                                            }}>
                                                {item.value}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {(!lamSangBatThuong || lamSangBatThuong.length === 0) && (
                                    <tr>
                                        <td colSpan={2} style={{ textAlign: "center", padding: 16, color: "#94A3B8", fontStyle: "italic" }}>
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
