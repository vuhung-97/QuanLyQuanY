import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import api from "../../services/api.js";

function formatDateTime(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

export default function UnitOverview({ chiTietMap }) {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const res = await api.get("/thong-ke/don-vi", {
                    params: { limit: 100 },
                });
                if (!ignore) setUnits(Array.isArray(res.data) ? res.data : []);
            } catch {
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, []);

    const allDetails = Object.values(chiTietMap || {}).flat();

    const unitScheduleMap = {};
    for (const ct of allDetails) {
        if (!unitScheduleMap[ct.ma_don_vi]) unitScheduleMap[ct.ma_don_vi] = [];
        unitScheduleMap[ct.ma_don_vi].push(ct);
    }

    const filtered = units.filter((u) => {
        if (u.ma_don_vi_truc_thuoc) return false;
        const kw = query.trim().toLowerCase();
        return (
            !kw ||
            [u.ma_don_vi, u.ten_don_vi]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(kw))
        );
    });

    const totalQuanSo = units.reduce((sum, u) => sum + (u.quan_so || 0), 0);

    return (
        <Card sx={{ borderRadius: 3 }}>
            {loading && <LinearProgress />}
            <CardContent sx={{ p: "24px !important" }}>
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
                            Tổng quân số: <strong>{totalQuanSo}</strong> &mdash;{" "}
                            {units.length} đơn vị
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
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                {[
                                    "Mã đơn vị",
                                    "Tên đơn vị",
                                    "Quân số",
                                    "Lịch đã lập",
                                ].map((l) => (
                                    <TableCell
                                        key={l}
                                        sx={{
                                            fontWeight: 700,
                                            color: "text.primary",
                                        }}
                                    >
                                        {l}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
{filtered.map((row) => {
                                const unitSchedules =
                                    unitScheduleMap[row.ma_don_vi] || [];
                                const hasSchedule =
                                    unitSchedules.length > 0;
                                const nearest = hasSchedule
                                    ? unitSchedules.reduce((a, b) => {
                                          const da = a.thoi_gian_bat_dau
                                              ? new Date(
                                                    a.thoi_gian_bat_dau,
                                                )
                                              : 0;
                                          const db = b.thoi_gian_bat_dau
                                              ? new Date(
                                                    b.thoi_gian_bat_dau,
                                                )
                                              : 0;
                                          return db > da ? b : a;
                                      })
                                    : null;
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
                                            {hasSchedule ? (
                                                <Chip
                                                    size="small"
                                                    label={`${formatDateTime(nearest.thoi_gian_bat_dau)} - ${formatDateTime(nearest.thoi_gian_ket_thuc)}`}
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
                            {!loading && filtered.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align="center"
                                        sx={{ py: 6, color: "text.secondary" }}
                                    >
                                        Không có đơn vị nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
