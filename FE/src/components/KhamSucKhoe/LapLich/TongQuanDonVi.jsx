import { useMemo } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import DataTable from "@/components/common/DataTable.jsx";
import { formatDateTime } from "@/utils/date.js";

const columns = [
    { key: "ma_don_vi", label: "Mã đơn vị" },
    { key: "ten_don_vi", label: "Tên đơn vị" },
    { key: "quan_so", label: "Quân số" },
    { key: "lich_da_lap", label: "Lịch đã lập" },
];

export default function TongQuanDonVi({
    chiTietMap,
    unitStats = [],
    latestScheduleId,
    latestStatus = "",
}) {
    const scheduleDetails = chiTietMap?.[latestScheduleId] || [];
    const unitCodes = useMemo(
        () => new Set(scheduleDetails.map((d) => d.ma_don_vi)),
        [scheduleDetails],
    );

    const scheduleUnits = useMemo(
        () => (unitStats ?? []).filter((u) => unitCodes.has(u.ma_don_vi)),
        [unitStats, unitCodes],
    );

    const totalQuanSo = useMemo(
        () => scheduleUnits.reduce((sum, u) => sum + (u.tong_quan_so || 0), 0),
        [scheduleUnits],
    );

    const loading = Boolean(latestScheduleId) && unitStats.length === 0;

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
                        <Typography variant="h2">
                            {latestStatus === "Đang thực hiện"
                                ? "Lịch khám đang thực hiện"
                                : "Lịch khám sắp tới"}
                        </Typography>
                    </Box>
                </Stack>
                <DataTable
                    columns={columns}
                    loading={loading}
                    emptyMessage="Không có đơn vị nào."
                    minWidth={650}
                >
                    {scheduleUnits.map((row) => {
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
