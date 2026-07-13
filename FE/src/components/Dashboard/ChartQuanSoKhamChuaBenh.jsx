import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import dayjs from "dayjs";
import useChartQuanSoKhamChuaBenh from "@/hooks/useChartQuanSoKhamChuaBenh.jsx";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";

const NAM_MIN = 2025;
const currentYear = new Date().getFullYear();
const namOptions = Array.from({ length: currentYear - NAM_MIN + 1 }, (_, i) => NAM_MIN + i);

const COLORS = {
    so_luot_kham: "#00B4D8",
    so_noi_tru: "#3B82F6",
    so_chuyen_tuyen: "#F59E0B",
};

const LABELS = {
    so_luot_kham: "Khám bệnh",
    so_noi_tru: "Nội trú",
    so_chuyen_tuyen: "Chuyển tuyến",
};

const KEYS = ["so_luot_kham", "so_noi_tru", "so_chuyen_tuyen"];

export default function ChartQuanSoKhamChuaBenh() {
    const { isLeft, endDate, setEndDate, nam, setNam, data, loading, error, handleFilterModeChange } = useChartQuanSoKhamChuaBenh();

    return (
        <Card sx={{ borderRadius: 3, boxShadow: "0px 4px 12px rgba(0,0,0,0.03)", overflow: "visible" }}>
            <CardContent sx={{ p: "24px !important" }}>
                <Stack direction="row" sx={{ mb: 3, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#1E293B" }}>
                        Quân số khám chữa bệnh tại bệnh xá
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <FilterModeToggle
                            isLeft={isLeft}
                            onChange={handleFilterModeChange}
                            selectedDate={endDate ? dayjs(endDate) : null}
                            onDateChange={(d) => setEndDate(d.format("YYYY-MM-DD"))}
                            labelLeft="Theo tháng"
                            labelRight="Theo ngày"
                        />
                        {isLeft && (
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Năm</InputLabel>
                                <Select
                                    value={nam}
                                    label="Năm"
                                    onChange={(e) => setNam(Number(e.target.value))}
                                >
                                    {namOptions.map((y) => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Stack>
                </Stack>
                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box sx={{ height: 320, width: "100%", minWidth: 0 }}>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", pt: 12 }}>
                            Đang tải...
                        </Typography>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    {KEYS.map((key) => (
                                        <linearGradient key={key} id={`gradient_${key}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS[key]} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={COLORS[key]} stopOpacity={0} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                                <RechartsTooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span style={{ color: "#64748B", fontSize: 13 }}>{value}</span>}
                                />
                                {KEYS.map((key) => (
                                    <Area
                                        key={key}
                                        type="monotone"
                                        dataKey={key}
                                        name={LABELS[key]}
                                        stroke={COLORS[key]}
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill={`url(#gradient_${key})`}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}