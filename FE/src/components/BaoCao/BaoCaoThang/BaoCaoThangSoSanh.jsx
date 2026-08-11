import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LabelList,
} from "recharts";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";
import { baoCaoService } from "@/services/baoCaoService.js";

export default function BaoCaoThangSoSanh({ mode = "month" }) {
    const theme = useTheme();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [monthA, setMonthA] = useState(
        mode === "month" ? (currentMonth === 1 ? 12 : currentMonth - 1) : 1,
    );
    const [yearA, setYearA] = useState(
        mode === "month"
            ? currentMonth === 1
                ? currentYear - 1
                : currentYear
            : currentYear - 1,
    );
    const [monthB, setMonthB] = useState(currentMonth);
    const [yearB, setYearB] = useState(currentYear);
    const [dataA, setDataA] = useState(null);
    const [dataB, setDataB] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCompare = useCallback(async () => {
        setLoading(true);
        try {
            const fetchA =
                mode === "month"
                    ? baoCaoService.getQuanYThang(monthA, yearA)
                    : baoCaoService.getQuanYNam(yearA);
            const fetchB =
                mode === "month"
                    ? baoCaoService.getQuanYThang(monthB, yearB)
                    : baoCaoService.getQuanYNam(yearB);
            const [resA, resB] = await Promise.all([fetchA, fetchB]);
            setDataA(resA.data);
            setDataB(resB.data);
        } catch {
            setDataA(null);
            setDataB(null);
        } finally {
            setLoading(false);
        }
    }, [mode, monthA, yearA, monthB, yearB]);

    useEffect(() => {
        handleCompare();
    }, []);

    const soSanhData = [];
    if (dataA && dataB) {
        const labelA =
            mode === "month"
                ? `Tháng ${dataA.thang}/${dataA.nam}`
                : `Năm ${dataA.nam}`;
        const labelB =
            mode === "month"
                ? `Tháng ${dataB.thang}/${dataB.nam}`
                : `Năm ${dataB.nam}`;
        soSanhData.push(
            {
                name: labelA,
                "Lượt khám": dataA.tong_quan.tong_luot_kham,
                "Nội trú": dataA.tong_quan.tong_noi_tru,
                "Chuyển tuyến": dataA.tong_quan.tong_chuyen_tuyen,
            },
            {
                name: labelB,
                "Lượt khám": dataB.tong_quan.tong_luot_kham,
                "Nội trú": dataB.tong_quan.tong_noi_tru,
                "Chuyển tuyến": dataB.tong_quan.tong_chuyen_tuyen,
            },
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                    {mode === "month" ? "So sánh tháng" : "So sánh năm"}
                </Typography>

                <Stack
                    direction="row"
                    spacing={3}
                    sx={{ alignItems: "flex-end", flexWrap: "wrap", mb: 3 }}
                >
                    <Box>
                        <YearMonthFilter
                            thang={mode === "month" ? monthA : undefined}
                            onThangChange={setMonthA}
                            nam={yearA}
                            onNamChange={setYearA}
                            showThang={mode === "month"}
                            allowAll={false}
                        />
                    </Box>
                    <Typography>vs</Typography>
                    <Box>
                        <YearMonthFilter
                            thang={mode === "month" ? monthB : undefined}
                            onThangChange={setMonthB}
                            nam={yearB}
                            onNamChange={setYearB}
                            showThang={mode === "month"}
                            allowAll={false}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleCompare}
                        disabled={loading}
                    >
                        {loading ? "Đang tải..." : "So sánh"}
                    </Button>
                </Stack>

                {soSanhData.length > 0 && (
                    <Box sx={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="350">
                            <BarChart
                                data={soSanhData}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    bottom: 5,
                                    left: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
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
                                <Bar
                                    dataKey="Lượt khám"
                                    fill={theme.palette.primary.main}
                                    radius={[4, 4, 0, 0]}
                                >
                                    <LabelList
                                        dataKey="Lượt khám"
                                        position="top"
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                    />
                                </Bar>
                                <Bar
                                    dataKey="Nội trú"
                                    fill={theme.palette.secondary.main}
                                    radius={[4, 4, 0, 0]}
                                >
                                    <LabelList
                                        dataKey="Nội trú"
                                        position="top"
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                    />
                                </Bar>
                                <Bar
                                    dataKey="Chuyển tuyến"
                                    fill={theme.palette.warning.main}
                                    radius={[4, 4, 0, 0]}
                                >
                                    <LabelList
                                        dataKey="Chuyển tuyến"
                                        position="top"
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
