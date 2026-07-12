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
    if (!payload || width < 40) return null;
    return (
        <text
            x={x + width + 6}
            y={y + 10}
            fill="#64748B"
            fontSize={11}
            dominantBaseline="middle"
        >
            {payload.da_kham}/{payload.tong_quan_so}
        </text>
    );
};

export default function KetQuaKhamDonVi({ donViData }) {
    if (!donViData || donViData.length === 0) return null;

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                    Tỷ lệ đã khám theo đơn vị
                </Typography>
                {donViData.length > 0 && (
                    <ResponsiveContainer
                        width="100%"
                        height={Math.max(550, donViData.length * 52)}
                    >
                        <BarChart
                            data={donViData}
                            layout="vertical"
                            margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
                        >
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                            />
                            <YAxis
                                type="category"
                                dataKey="ten_don_vi"
                                width={120}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value, name, props) => [
                                    `${value}%`,
                                    `Đã khám: ${props.payload.da_kham} / Tổng: ${props.payload.tong_quan_so}`,
                                ]}
                                contentStyle={{
                                    borderRadius: 8,
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Bar
                                dataKey="ty_le_da_kham"
                                radius={[0, 6, 6, 0]}
                                maxBarSize={60}
                            >
                                {donViData.map((_, idx) => (
                                    <Cell
                                        key={idx}
                                        fill={
                                            idx % 2 === 0
                                                ? "#0B3B60"
                                                : "#00B4D8"
                                        }
                                    />
                                ))}
                                <LabelList
                                    dataKey="ty_le_da_kham"
                                    content={renderLabel}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
