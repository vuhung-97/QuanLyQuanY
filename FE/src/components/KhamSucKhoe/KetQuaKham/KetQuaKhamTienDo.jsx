import { Card, CardContent, Grid, Typography } from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function KetQuaKhamTienDo({ tienDo, donViData }) {
    if (!tienDo || tienDo.length === 0) return null;

    return (
        <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
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
                                    label={({ name, value, payload }) =>
                                        `${name}: ${value}`
                                    }
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                            Tiến độ theo đơn vị
                        </Typography>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: "Đã khám", value: tienDo.find((t) => t.name === "Đã khám")?.value || 0, color: "#10B981" },
                                        { name: "Còn lại", value: (tienDo.find((t) => t.name === "Đang khám")?.value || 0) + (tienDo.find((t) => t.name === "Chưa khám")?.value || 0), color: "#E2E8F0" },
                                    ]}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={60}
                                    label={({ value, payload }) =>
                                        `${((value / tienDo.reduce((s, t) => s + t.value, 0)) * 100).toFixed(1)}%`
                                    }
                                >
                                    {[0, 1].map((idx) => (
                                        <Cell key={idx}
                                            fill={[ "#10B981", "#E2E8F0" ][idx]}
                                        />
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
            </Grid>
        </Grid>
    );
}
