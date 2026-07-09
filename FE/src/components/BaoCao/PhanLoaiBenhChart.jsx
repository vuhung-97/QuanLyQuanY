import { Box, Typography } from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { CHART_COLORS } from "@/constants/bao_cao.js";

export default function PhanLoaiBenhChart({ data, title }) {
    if (!data || data.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 300,
                }}
            >
                <Typography color="text.secondary">Chưa có dữ liệu</Typography>
            </Box>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="so_ca"
                    nameKey="ten_nhom"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    label={({ ty_le }) => `${ty_le}%`}
                >
                    {data.map((_, index) => (
                        <Cell
                            key={index}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                    ))}
                </Pie>
                <Legend
                    formatter={(value) => (
                        <span style={{ color: "#64748B", fontSize: 13 }}>
                            {value}
                        </span>
                    )}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
