import { useEffect, useMemo, useState } from "react";
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
import { khamSucKhoeService } from "../../../services/khamSucKhoeService.js";
import DataTable from "../../common/DataTable.jsx";
import { formatDateTime } from "../KhamSucKhoeUtils.js";

const columns = [
    { key: "ma_don_vi", label: "Mã đơn vị" },
    { key: "ten_don_vi", label: "Tên đơn vị" },
    { key: "quan_so", label: "Quân số" },
    { key: "lich_da_lap", label: "Lịch đã lập" },
];

export default function TongQuanDonVi({ chiTietMap }) {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const res = await khamSucKhoeService.getDonViList();
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

    const unitScheduleMap = useMemo(() => {
        const map = {};
        const allDetails = Object.values(chiTietMap || {}).flat();
        for (const ct of allDetails) {
            if (!map[ct.ma_don_vi]) map[ct.ma_don_vi] = [];
            map[ct.ma_don_vi].push(ct);
        }
        return map;
    }, [chiTietMap]);

    const filtered = useMemo(() => {
        const kw = query.trim().toLowerCase();
        return units.filter((u) => {
            if (u.ma_don_vi_truc_thuoc) return false;
            return (
                !kw ||
                [u.ma_don_vi, u.ten_don_vi]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(kw))
            );
        });
    }, [units, query]);

    const totalQuanSo = useMemo(
        () => units.reduce((sum, u) => sum + (u.quan_so || 0), 0),
        [units],
    );

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
                        const unitSchedules =
                            unitScheduleMap[row.ma_don_vi] || [];
                        const hasSchedule = unitSchedules.length > 0;
                        const nearest = hasSchedule
                            ? unitSchedules.reduce((a, b) => {
                                  const da = a.thoi_gian_bat_dau
                                      ? new Date(a.thoi_gian_bat_dau)
                                      : 0;
                                  const db = b.thoi_gian_bat_dau
                                      ? new Date(b.thoi_gian_bat_dau)
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
                </DataTable>
            </CardContent>
        </Card>
    );
}
