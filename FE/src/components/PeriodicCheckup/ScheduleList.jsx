import { useMemo, useState } from "react";
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
    Typography,
} from "@mui/material";
import ScheduleTableRow from "./ScheduleTableRow";

export default function ScheduleList({
    schedules,
    chiTietMap,
    unitMap,
    loading,
    onEdit,
    onDelete,
    onEditDetail,
    onDeleteDetail,
    getScheduleStatus,
    statusColor,
}) {
    const donViLookup = useMemo(() => {
        const m = new Map();
        (unitMap || []).forEach((u) => m.set(u.ma_don_vi, u.ten_don_vi));
        return m;
    }, [unitMap]);

    const [expanded, setExpanded] = useState({});

    const toggleExpand = (ma_lich_kham) => {
        setExpanded((prev) => ({ ...prev, [ma_lich_kham]: !prev[ma_lich_kham] }));
    };

    return (
        <Card sx={{ borderRadius: 3 }}>
            {loading && <LinearProgress />}
            <CardContent sx={{ p: "24px !important" }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mb: 2.5, justifyContent: "space-between" }}
                >
                    <Box>
                        <Typography variant="h2">
                            Danh sách lịch khám
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Tổng số: {schedules.length} lịch
                        </Typography>
                    </Box>
                </Stack>
                <TableContainer>
                    <Table sx={{ minWidth: 760 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 40 }} />
                                {[
                                    "Mã lịch",
                                    "Thời gian khám",
                                    "Địa điểm",
                                    "Trạng thái",
                                    "Thao tác",
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
                            {schedules.map((row) => (
                                <ScheduleTableRow
                                    key={row.ma_lich_kham}
                                    row={row}
                                    details={
                                        chiTietMap[row.ma_lich_kham] || []
                                    }
                                    isExpanded={Boolean(
                                        expanded[row.ma_lich_kham],
                                    )}
                                    onToggle={() =>
                                        toggleExpand(row.ma_lich_kham)
                                    }
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onEditDetail={onEditDetail}
                                    onDeleteDetail={onDeleteDetail}
                                    donViLookup={donViLookup}
                                    getScheduleStatus={getScheduleStatus}
                                    statusColor={statusColor}
                                />
                            ))}
                            {!loading && schedules.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                        sx={{
                                            py: 6,
                                            color: "text.secondary",
                                        }}
                                    >
                                        Không có lịch khám phù hợp.
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
