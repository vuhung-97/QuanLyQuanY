import { Card, CardContent, Typography } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";

const renderLabel = (props) => {
    const { x, y, width, payload } = props;
    if (!payload) return null;
    return (
        <text
            x={x + width + 6}
            y={y + 10}
            fill="#64748B"
            fontSize={11}
            dominantBaseline="middle"
        >
            {payload.value} ({payload.ty_le}%)
        </text>
    );
};

export default function KetQuaKhamDonVi({ phanBoPhanLoai }) {
    if (!phanBoPhanLoai || phanBoPhanLoai.length === 0) return null;

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                    Phân loại sức khỏe theo 5 loại
                </Typography>
                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <BarChart
                        data={phanBoPhanLoai}
                        margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
                    >
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 13 }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value} người (${props.payload.ty_le}%)`,
                                props.payload.name,
                            ]}
                            contentStyle={{
                                borderRadius: 8,
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={80}
                        >
                            {phanBoPhanLoai.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} />
                            ))}
                            <LabelList
                                dataKey="value"
                                content={renderLabel}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
