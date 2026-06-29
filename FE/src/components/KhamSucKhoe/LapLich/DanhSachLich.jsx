import { useMemo, useState } from "react";
import React from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    Stack,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowUp as ArrowUpIcon,
} from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import { findNearestDetail } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";
import { formatDateTime } from "@/utils/date.js";

const columns = [
    { key: "expand", label: "", sx: { width: 40 } },
    { key: "ma_lich", label: "Mã lịch" },
    { key: "thoi_gian", label: "Thời gian khám" },
    { key: "dia_diem", label: "Địa điểm" },
    { key: "trang_thai", label: "Trạng thái" },
    { key: "thao_tac", label: "Thao tác" },
];

function DetailSubTable({
    details,
    donViLookup,
    schedule,
    onEditDetail,
    onDeleteDetail,
}) {
    return (
        <DataTable
            columns={[
                { key: "don_vi", label: "Đơn vị" },
                { key: "thoi_gian", label: "Thời gian" },
                { key: "dia_diem", label: "Địa điểm" },
                { key: "thao_tac", label: "Thao tác", sx: { width: 120 } },
            ]}
            emptyMessage=""
            minWidth={500}
        >
            {details.map((ct) => (
                <TableRow key={ct.ma_don_vi}>
                    <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                            {ct.ma_don_vi}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {donViLookup.get(ct.ma_don_vi) || ""}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        {formatDateTime(ct.thoi_gian_bat_dau)} -{" "}
                        {formatDateTime(ct.thoi_gian_ket_thuc)}
                    </TableCell>
                    <TableCell>{ct.dia_diem || "--"}</TableCell>
                    <TableCell>
                        <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Sửa">
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => onEditDetail(schedule, ct)}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => onDeleteDetail(schedule, ct)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </TableCell>
                </TableRow>
            ))}
        </DataTable>
    );
}

function ScheduleTableRow({
    row,
    details,
    isExpanded,
    onToggle,
    onEdit,
    onDelete,
    onEditDetail,
    onDeleteDetail,
    donViLookup,
    getScheduleStatus,
    statusColor,
}) {
    const currentStatus = getScheduleStatus(row);
    const nearest = findNearestDetail(details);

    return (
        <React.Fragment>
            <TableRow hover>
                <TableCell>
                    <IconButton size="small" onClick={onToggle}>
                        {isExpanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                    {row.ma_lich_kham}
                </TableCell>
                <TableCell>
                    {formatDateTime(row.thoi_gian_bat_dau)} -{" "}
                    {formatDateTime(row.thoi_gian_ket_thuc)}
                </TableCell>
                <TableCell>{nearest?.dia_diem || "--"}</TableCell>
                <TableCell>
                    <Chip
                        size="small"
                        label={currentStatus}
                        sx={{ ...statusColor(currentStatus), fontWeight: 700 }}
                    />
                </TableCell>
                <TableCell>
                    <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Sửa">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onEdit(row)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDelete(row)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={{ p: 0 }} colSpan={6}>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                            {details.length === 0 ? (
                                <Typography
                                    color="text.secondary"
                                    sx={{ textAlign: "center", py: 1 }}
                                >
                                    Chưa có đơn vị nào trong lịch này.
                                </Typography>
                            ) : (
                                <DetailSubTable
                                    details={details}
                                    donViLookup={donViLookup}
                                    schedule={row}
                                    onEditDetail={onEditDetail}
                                    onDeleteDetail={onDeleteDetail}
                                />
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function DanhSachLich({
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
        setExpanded((prev) => ({
            ...prev,
            [ma_lich_kham]: !prev[ma_lich_kham],
        }));
    };

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
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
                <DataTable
                    columns={columns}
                    loading={loading}
                    emptyMessage="Không có lịch khám phù hợp."
                    minWidth={760}
                >
                    {schedules.map((row) => (
                        <ScheduleTableRow
                            key={row.ma_lich_kham}
                            row={row}
                            details={chiTietMap[row.ma_lich_kham] || []}
                            isExpanded={Boolean(expanded[row.ma_lich_kham])}
                            onToggle={() => toggleExpand(row.ma_lich_kham)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onEditDetail={onEditDetail}
                            onDeleteDetail={onDeleteDetail}
                            donViLookup={donViLookup}
                            getScheduleStatus={getScheduleStatus}
                            statusColor={statusColor}
                        />
                    ))}
                </DataTable>
            </CardContent>
        </Card>
    );
}
