import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Card,
    CardContent,
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
import UnitOverviewRow from "./UnitOverviewRow";

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
                if (!ignore)
                    setUnits(Array.isArray(res.data) ? res.data : []);
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
                            {filtered.map((row) => (
                                <UnitOverviewRow
                                    key={row.ma_don_vi}
                                    row={row}
                                    unitScheduleMap={unitScheduleMap}
                                />
                            ))}
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
