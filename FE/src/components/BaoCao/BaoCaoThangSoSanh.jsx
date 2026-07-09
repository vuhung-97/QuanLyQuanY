import { useMemo } from "react";
import { useTheme } from "@mui/material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function BaoCaoThangSoSanh({ data }) {
    const theme = useTheme();

    const soSanhData = useMemo(() => {
        if (!data?.so_sanh_thang_truoc) return [];
        return [
            {
                name: "Lượt khám",
                "Tháng này": data.so_sanh_thang_truoc.luot_kham.thang_nay,
                "Tháng trước": data.so_sanh_thang_truoc.luot_kham.thang_truoc,
            },
            {
                name: "Nội trú",
                "Tháng này": data.so_sanh_thang_truoc.noi_tru.thang_nay,
                "Tháng trước": data.so_sanh_thang_truoc.noi_tru.thang_truoc,
            },
        ];
    }, [data]);

    if (soSanhData.length === 0) return null;

    return (
        <Card>
            <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    So sánh với tháng trước
                </Typography>
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={soSanhData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 8,
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="Tháng này" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Tháng trước" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
