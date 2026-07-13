import {
    Card,
    CardContent,
    Typography,
    Stack,
    Box,
    Divider,
} from "@mui/material";
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
import useBaoCaoQuanSoKhoe from "@/hooks/useBaoCaoQuanSoKhoe.jsx";
import { CHART_COLORS } from "@/constants/bao_cao.js";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";

export default function SucKhoeDonViWidget({ sx }) {
    const { thang, setThang, nam, setNam, data, loading, chartData } =
        useBaoCaoQuanSoKhoe();

    const tq = data?.tong_quan;
    const topUnits = [...(chartData || [])]
        .sort((a, b) => a.ty_le - b.ty_le)
        .slice(0, 5);

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                ...sx,
            }}
        >
            <CardContent
                sx={{
                    p: "24px !important",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Stack spacing={2} sx={{ flex: 1 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ color: "#1E293B", mr: 2 }}
                        >
                            Sức khỏe đơn vị
                        </Typography>
                        <YearMonthFilter
                            thang={thang}
                            nam={nam}
                            onThangChange={setThang}
                            onNamChange={setNam}
                        />
                    </Stack>

                    {loading && !data ? (
                        <Typography color="text.secondary">
                            Đang tải...
                        </Typography>
                    ) : tq ? (
                        <>
                            <Stack
                                direction="row"
                                spacing={2}
                                divider={
                                    <Divider orientation="vertical" flexItem />
                                }
                                justifyContent="center"
                            >
                                <Box sx={{ textAlign: "center", flex: 1 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Tổng quân số
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700}>
                                        {tq.tong_quan_so}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: "center", flex: 1 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Quân số khỏe
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                        sx={{ color: "#10B981" }}
                                    >
                                        {tq.quan_so_khoe}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: "center", flex: 1 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Tỷ lệ
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                        sx={{ color: "#0B3B60" }}
                                    >
                                        {tq.ty_le_khoe}%
                                    </Typography>
                                </Box>
                            </Stack>

                            {topUnits.length > 0 && (
                                <>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        fontWeight={500}
                                    >
                                        Tỷ lệ quân số khỏe theo đơn vị
                                    </Typography>
                                    <Box sx={{ flex: 1 }}>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart
                                                data={topUnits}
                                                layout="vertical"
                                                margin={{
                                                    left: 10,
                                                    right: 50,
                                                    top: 5,
                                                    bottom: 5,
                                                }}
                                            >
                                                <XAxis
                                                    type="number"
                                                    domain={[0, 100]}
                                                    hide
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    width={100}
                                                    tick={{
                                                        fontSize: 13,
                                                        fill: "#64748B",
                                                    }}
                                                />
                                                <Tooltip
                                                    formatter={(v) => `${v}%`}
                                                />
                                                <Bar
                                                    dataKey="ty_le"
                                                    radius={[0, 4, 4, 0]}
                                                    maxBarSize={32}
                                                >
                                                    {topUnits.map((_, idx) => (
                                                        <Cell
                                                            key={idx}
                                                            fill={
                                                                idx === 0
                                                                    ? "#EF4444"
                                                                    : CHART_COLORS[
                                                                          idx %
                                                                              CHART_COLORS.length
                                                                      ]
                                                            }
                                                        />
                                                    ))}
                                                    <LabelList
                                                        dataKey="ty_le"
                                                        position="right"
                                                        formatter={(v) =>
                                                            `${v}%`
                                                        }
                                                        style={{
                                                            fontSize: 13,
                                                            fill: "#64748B",
                                                        }}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </>
                            )}
                        </>
                    ) : (
                        <Typography color="text.secondary">
                            Chưa có dữ liệu
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
