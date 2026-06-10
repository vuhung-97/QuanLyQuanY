import { useMemo, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    LinearProgress,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowUp as ArrowUpIcon,
    Search as SearchIcon,
} from "@mui/icons-material";

const statusOptions = [
    "Tất cả",
    "Sắp diễn ra",
    "Đang thực hiện",
    "Đã kết thúc",
];

function formatDate(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

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

function findNearestDetail(details) {
    if (!details || details.length === 0) return null;
    const now = new Date();
    let nearest = null;
    let minDiff = Infinity;
    for (const d of details) {
        if (!d.thoi_gian_bat_dau) continue;
        const diff = Math.abs(new Date(d.thoi_gian_bat_dau) - now);
        if (diff < minDiff) {
            minDiff = diff;
            nearest = d;
        }
    }
    return nearest;
}

export default function ScheduleList({
    schedules,
    chiTietMap,
    unitMap,
    loading,
    onEdit,
    onDelete,
    onEditDetail,
    onDeleteDetail,
    query,
    onQueryChange,
    status,
    onStatusChange,
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
        setExpanded((prev) => ({
            ...prev,
            [ma_lich_kham]: !prev[ma_lich_kham],
        }));
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
                            {schedules.map((row) => {
                                const currentStatus = getScheduleStatus(row);
                                const details =
                                    chiTietMap[row.ma_lich_kham] || [];
                                const nearest = findNearestDetail(details);
                                const isExpanded = Boolean(
                                    expanded[row.ma_lich_kham],
                                );
                                return (
                                    <>
                                        <TableRow key={row.ma_lich_kham} hover>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        toggleExpand(
                                                            row.ma_lich_kham,
                                                        )
                                                    }
                                                >
                                                    {isExpanded ? (
                                                        <ArrowUpIcon />
                                                    ) : (
                                                        <ArrowDownIcon />
                                                    )}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "primary.main",
                                                }}
                                            >
                                                {row.ma_lich_kham}
                                            </TableCell>
                                            <TableCell>
                                                {formatDateTime(row.thoi_gian_bat_dau)} - {formatDateTime(row.thoi_gian_ket_thuc)}
                                            </TableCell>
                                            <TableCell>
                                                {nearest?.dia_diem || "--"}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={currentStatus}
                                                    sx={{
                                                        ...statusColor(
                                                            currentStatus,
                                                        ),
                                                        fontWeight: 700,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={0.5}
                                                >
                                                    <Tooltip title="Sửa">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() =>
                                                                onEdit(row)
                                                            }
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                onDelete(row)
                                                            }
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            key={`${row.ma_lich_kham}-detail`}
                                        >
                                            <TableCell
                                                sx={{ p: 0 }}
                                                colSpan={6}
                                            >
                                                <Collapse
                                                    in={isExpanded}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            bgcolor: "grey.50",
                                                        }}
                                                    >
                                                        {details.length ===
                                                        0 ? (
                                                            <Typography
                                                                color="text.secondary"
                                                                sx={{
                                                                    textAlign:
                                                                        "center",
                                                                    py: 1,
                                                                }}
                                                            >
                                                                Chưa có đơn vị
                                                                nào trong lịch
                                                                này.
                                                            </Typography>
                                                        ) : (
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        {[
                                                                            "Đơn vị",
                                                                            "Thời gian",
                                                                            "Địa điểm",
                                                                            "Thao tác",
                                                                        ].map(
                                                                            (
                                                                                l,
                                                                            ) => (
                                                                                <TableCell
                                                                                    key={
                                                                                        l
                                                                                    }
                                                                                    sx={{
                                                                                        fontWeight: 700,
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        l
                                                                                    }
                                                                                </TableCell>
                                                                            ),
                                                                        )}
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {details.map(
                                                                        (
                                                                            ct,
                                                                        ) => (
                                                                            <TableRow
                                                                                key={
                                                                                    ct.ma_don_vi
                                                                                }
                                                                            >
                                                                                <TableCell>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        fontWeight={
                                                                                            600
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            ct.ma_don_vi
                                                                                        }
                                                                                    </Typography>
                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        color="text.secondary"
                                                                                    >
                                                                                        {donViLookup.get(
                                                                                            ct.ma_don_vi,
                                                                                        ) ||
                                                                                            ""}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {formatDateTime(
                                                                                        ct.thoi_gian_bat_dau,
                                                                                    )}{" "}
                                                                                    -{" "}
                                                                                    {formatDateTime(
                                                                                        ct.thoi_gian_ket_thuc,
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {ct.dia_diem ||
                                                                                        "--"}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Stack
                                                                                        direction="row"
                                                                                        spacing={
                                                                                            0.5
                                                                                        }
                                                                                    >
                                                                                        <Tooltip title="Sửa">
                                                                                            <IconButton
                                                                                                size="small"
                                                                                                color="primary"
                                                                                                onClick={() =>
                                                                                                    onEditDetail(
                                                                                                        row,
                                                                                                        ct,
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <EditIcon fontSize="small" />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                        <Tooltip title="Xóa">
                                                                                            <IconButton
                                                                                                size="small"
                                                                                                color="error"
                                                                                                onClick={() =>
                                                                                                    onDeleteDetail(
                                                                                                        row,
                                                                                                        ct,
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <DeleteIcon fontSize="small" />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                    </Stack>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ),
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        )}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                );
                            })}
                            {!loading && schedules.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                        sx={{ py: 6, color: "text.secondary" }}
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
