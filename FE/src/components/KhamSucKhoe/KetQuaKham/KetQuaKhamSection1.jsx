import { Card, CardContent, Grid, Typography } from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

function TienDoChart({ tienDo }) {
    if (!tienDo || tienDo.length === 0) return null;
    return (
        <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
                <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                    Tiến độ khám tổng thể
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                        <Pie
                            data={tienDo}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={50}
                            label={({ name, value }) => `${name}: ${value}`}
                        >
                            {tienDo.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
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
    );
}

function PhanBoChart({ phanBoPhanLoai }) {
    if (!phanBoPhanLoai || phanBoPhanLoai.length === 0) return null;
    return (
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
                            formatter={(value, name) => [`${value} người`, name]}
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
    );
}

export default function KetQuaKhamSection1({ tienDo, phanBoPhanLoai }) {
    return (
        <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
                <TienDoChart tienDo={tienDo} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <PhanBoChart phanBoPhanLoai={phanBoPhanLoai} />
            </Grid>
        </Grid>
    );
}