import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { baoCaoService } from "@/services/baoCaoService.js";

function getPrevMonth(thang, nam) {
    if (thang === 1) return { thang: 12, nam: nam - 1 };
    return { thang: thang - 1, nam };
}

export default function SoSanhThangTruoc({ thang, nam, currentData }) {
    const [prevData, setPrevData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!thang || !nam || !currentData) return;
        const prev = getPrevMonth(thang, nam);
        setLoading(true);
        baoCaoService
            .getQuanYThang(prev.thang, prev.nam)
            .then((res) => setPrevData(res.data))
            .catch(() => setPrevData(null))
            .finally(() => setLoading(false));
    }, [thang, nam, currentData]);

    if (!thang) {
        return (
            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
                }}
            >
                <CardContent sx={{ p: "24px !important" }}>
                    <Typography color="text.secondary" textAlign="center">
                        Chọn tháng để xem so sánh
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    const cur = currentData?.tong_quan;
    const prev = prevData?.tong_quan;
    const prevMonth = getPrevMonth(thang, nam);
    const curLabel = `T${thang}/${nam}`;

    const chartData =
        cur && prev
            ? [
                  {
                      name: "Lượt khám",
                      "Tháng trước": prev.tong_luot_kham,
                      "Tháng này": cur.tong_luot_kham,
                  },
                  {
                      name: "Nội trú",
                      "Tháng trước": prev.tong_noi_tru,
                      "Tháng này": cur.tong_noi_tru,
                  },
                  {
                      name: "Chuyển tuyến",
                      "Tháng trước": prev.tong_chuyen_tuyen,
                      "Tháng này": cur.tong_chuyen_tuyen,
                  },
              ]
            : [];

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
            }}
        >
            <CardContent sx={{ p: "24px !important" }}>
                <Stack spacing={1.5}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: "#1E293B" }}
                    >
                        So sánh tháng trước
                    </Typography>

                    {loading && !prevData ? (
                        <Typography color="text.secondary">
                            Đang tải...
                        </Typography>
                    ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fontSize: 12,
                                        fill: "#64748B",
                                    }}
                                />
                                <YAxis
                                    tick={{
                                        fontSize: 12,
                                        fill: "#64748B",
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span
                                            style={{
                                                color: "#64748B",
                                                fontSize: 12,
                                            }}
                                        >
                                            {value === "Tháng trước"
                                                ? `T${prevMonth.thang}/${prevMonth.nam}`
                                                : curLabel}
                                        </span>
                                    )}
                                />
                                <Bar
                                    dataKey="Tháng trước"
                                    fill="#94A3B8"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="Tháng này"
                                    fill="#00B4D8"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Typography color="text.secondary">
                            Không có dữ liệu
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
