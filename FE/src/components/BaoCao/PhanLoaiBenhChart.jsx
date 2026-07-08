import { useTheme } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#00B4D8", "#0B3B60", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899", "#F97316"];

export default function PhanLoaiBenhChart({ data, title }) {
    const theme = useTheme();

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="so_ca"
                    nameKey="ten_nhom"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    label={({ ten_nhom, ty_le }) => `${ten_nhom}: ${ty_le}%`}
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
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
