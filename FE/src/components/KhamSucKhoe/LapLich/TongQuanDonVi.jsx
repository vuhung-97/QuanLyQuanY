import { useMemo, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import { formatDateTime } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";

const columns = [
    { key: "ma_don_vi", label: "Mã đơn vị" },
    { key: "ten_don_vi", label: "Tên đơn vị" },
    { key: "quan_so", label: "Quân số" },
    { key: "lich_da_lap", label: "Lịch đã lập" },
];

export default function TongQuanDonVi({ chiTietMap, unitStats = [], latestScheduleId }) {
    const [query, setQuery] = useState("");

    const scheduleDetails = chiTietMap?.[latestScheduleId] || [];
    const unitCodes = useMemo(
        () => new Set(scheduleDetails.map((d) => d.ma_don_vi)),
        [scheduleDetails],
    );

    const filtered = useMemo(() => {
        const kw = query.trim().toLowerCase();
        return (unitStats ?? []).filter((u) => {
            if (!unitCodes.has(u.ma_don_vi)) return false;
            if (!kw) return true;
            return [u.ma_don_vi, u.ten_don_vi]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(kw));
        });
    }, [unitStats, unitCodes, query]);

    const totalQuanSo = useMemo(
        () => filtered.reduce((sum, u) => sum + (u.tong_quan_so || 0), 0),
        [filtered],
    );

    const loading = !latestScheduleId || unitStats.length === 0;

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{
                        mb: 2.5,
                        justifyContent: "space-between",
                        alignItems: { md: "center" },
                    }}
                >
                    <Box>
                        <Typography variant="h2">Lịch khám gần nhất</Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Tổng quân số: <strong>{totalQuanSo}</strong> QN
                        </Typography>
                    </Box>
                    <TextField
                        size="small"
                        placeholder="Tìm đơn vị..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <SearchIcon
                                        sx={{ mr: 1, color: "text.secondary" }}
                                    />
                                ),
                            },
                        }}
                        sx={{ minWidth: { xs: "100%", sm: 280 } }}
                    />
                </Stack>
                <DataTable
                    columns={columns}
                    loading={loading}
                    emptyMessage="Không có đơn vị nào."
                    minWidth={650}
                >
                    {filtered.map((row) => {
                        const detail = scheduleDetails.find(
                            (d) => d.ma_don_vi === row.ma_don_vi,
                        );
                        return (
                            <TableRow key={row.ma_don_vi} hover>
                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: "primary.main",
                                        pl: 3,
                                    }}
                                >
                                    {row.ma_don_vi}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    {row.ten_don_vi}
                                </TableCell>
                                <TableCell>
                                    {row.tong_quan_so ?? "--"}
                                </TableCell>
                                <TableCell>
                                    {detail ? (
                                        <Chip
                                            size="small"
                                            label={`${formatDateTime(detail.thoi_gian_bat_dau)} - ${formatDateTime(detail.thoi_gian_ket_thuc)}`}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Chưa có
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </DataTable>
            </CardContent>
        </Card>
    );
}
