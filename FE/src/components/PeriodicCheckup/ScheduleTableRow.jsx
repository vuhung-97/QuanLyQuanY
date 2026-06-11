import React from "react";
import {
    Box,
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
import { findNearestDetail, formatDateTime } from "./periodicUtils";
import DetailSubTable from "./DetailSubTable";

export default function ScheduleTableRow({
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
