import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    FormControl,
    MenuItem,
    Select,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Send as SendIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import StatusFilter from "@/components/common/StatusFilter.jsx";
import { findNearestDetail } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";
import { formatDateTime } from "@/utils/date.js";
import IfRole from "@/components/common/IfRole.jsx";
import { ROLES } from "@/constants/roleConstants.js";

const columns = [
    { key: "ma_lich", label: "Mã lịch" },
    { key: "thoi_gian", label: "Thời gian khám" },
    { key: "dia_diem", label: "Địa điểm" },
    { key: "trang_thai", label: "Trạng thái" },
    { key: "thao_tac", label: "Thao tác" },
];

function ScheduleTableRow({
    row,
    details,
    onEdit,
    onDelete,
    onSubmit,
    onView,
    getScheduleStatus,
    statusColor,
}) {
    const currentStatus = getScheduleStatus(row);
    const nearest = findNearestDetail(details);

    const isDangThucHien = currentStatus === "Đang thực hiện";

    return (
        <TableRow
            hover
            sx={
                isDangThucHien
                    ? { bgcolor: statusColor(currentStatus).bgcolor }
                    : undefined
            }
        >
            <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                {row.ma_lich_kham}
            </TableCell>
            <TableCell>
                {formatDateTime(row.thoi_gian_bat_dau)} -{" "}
                {formatDateTime(row.thoi_gian_ket_thuc)}
            </TableCell>
            <TableCell>{nearest?.dia_diem || "--"}</TableCell>
            <TableCell>
                <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ alignItems: "center" }}
                >
                    <Chip
                        size="small"
                        label={currentStatus}
                        sx={{
                            ...statusColor(currentStatus),
                            fontWeight: 700,
                        }}
                    />
                    <Chip
                        size="small"
                        label={
                            row.trang_thai === "da_duyet"
                                ? "Đã duyệt"
                                : row.trang_thai === "cho_duyet"
                                  ? "Chờ duyệt"
                                  : row.trang_thai === "cho_gui"
                                    ? "Chờ gửi"
                                    : row.trang_thai === "tu_choi"
                                      ? "Từ chối"
                                      : row.trang_thai || "—"
                        }
                        color={
                            row.trang_thai === "da_duyet"
                                ? "success"
                                : row.trang_thai === "cho_duyet"
                                  ? "warning"
                                  : row.trang_thai === "tu_choi"
                                    ? "error"
                                    : "default"
                        }
                        variant={row.trang_thai === "cho_gui" ? "outlined" : "filled"}
                        sx={{ fontWeight: 600 }}
                    />
                </Stack>
            </TableCell>
            <TableCell>
                {row.trang_thai === "da_duyet" ? (
                    <IfRole
                        roles={[
                            ROLES.ADMIN,
                            ROLES.CNQY,
                            ROLES.BACSI,
                            ROLES.YSI,
                        ]}
                    >
                        <ActionIcon
                            title="Xem"
                            icon={<VisibilityIcon />}
                            color="info"
                            onClick={() => onView(row)}
                        />
                    </IfRole>
                ) : row.trang_thai === "cho_gui" ? (
                    <IfRole
                        roles={[
                            ROLES.ADMIN,
                            ROLES.CNQY,
                            ROLES.BACSI,
                            ROLES.YSI,
                        ]}
                    >
                        <Stack direction="row" spacing={0.5}>
                            <ActionIcon title="Sửa" icon={<EditIcon />} onClick={() => onEdit(row)} />
                            <ActionIcon title="Gửi duyệt" icon={<SendIcon />} onClick={() => onSubmit(row)} />
                            <ActionIcon title="Xóa" icon={<DeleteIcon />} color="error" onClick={() => onDelete(row)} />
                        </Stack>
                    </IfRole>
                ) : row.trang_thai === "cho_duyet" ? (
                    <Stack direction="row" spacing={0.5}>
                        <ActionIcon title="Xem" icon={<VisibilityIcon />} color="info" onClick={() => onView(row)} />
                        <IfRole roles={[ROLES.ADMIN, ROLES.CNQY]}>
                            <ActionIcon title="Xóa" icon={<DeleteIcon />} color="error" onClick={() => onDelete(row)} />
                        </IfRole>
                    </Stack>
                ) : row.trang_thai === "tu_choi" ? (
                    <ActionIcon
                        title="Xem"
                        icon={<VisibilityIcon />}
                        color="info"
                        onClick={() => onView(row)}
                    />
                ) : null}
            </TableCell>
        </TableRow>
    );
}

export default function DanhSachLich({
    schedules,
    chiTietMap,
    loading,
    initialStatus = "",
    onEdit,
    onDelete,
    onSubmit,
    onView,
    getScheduleStatus,
    statusColor,
}) {
    const [year, setYear] = useState("Tất cả");
    const [status, setStatus] = useState(initialStatus || "");

    const statusOptions = [
        "Chờ gửi",
        "Chờ duyệt",
        "Từ chối",
        "Sắp diễn ra",
        "Đang thực hiện",
        "Đã kết thúc",
    ];

    const availableYears = useMemo(() => {
        const years = new Set(
            schedules.map((s) => new Date(s.thoi_gian_bat_dau).getFullYear()),
        );
        return ["Tất cả", ...Array.from(years).sort()];
    }, [schedules]);

    const filteredSchedules = useMemo(() => {
        return schedules.filter((s) => {
            const matchYear =
                year === "Tất cả" ||
                new Date(s.thoi_gian_bat_dau).getFullYear() === Number(year);
            const matchStatus =
                status === "" || getScheduleStatus(s) === status;
            return matchYear && matchStatus;
        });
    }, [schedules, year, status, getScheduleStatus]);

    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => setPage(1), [year, status]);

    const paginatedSchedules = useMemo(
        () =>
            filteredSchedules.slice(
                (page - 1) * rowsPerPage,
                page * rowsPerPage,
            ),
        [filteredSchedules, page, rowsPerPage],
    );

    const totalPages = Math.ceil(filteredSchedules.length / rowsPerPage);

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
                            Tổng số: {filteredSchedules.length} lịch
                            {filteredSchedules.length > 0 && (
                                <span>
                                    {" "}
                                    — Trang {page}/{totalPages}
                                </span>
                            )}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <StatusFilter
                            value={status}
                            onChange={setStatus}
                            options={statusOptions.map((s) => ({
                                value: s,
                                label: s,
                            }))}
                            label="Trạng thái"
                        />
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                sx={{ textTransform: "none" }}
                            >
                                {availableYears.map((y) => (
                                    <MenuItem key={y} value={y}>
                                        {y}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
                <Box sx={{ maxHeight: 560, overflow: "auto" }}>
                    <DataTable
                        columns={columns}
                        loading={loading}
                        emptyMessage="Không có lịch khám phù hợp."
                        minWidth={760}
                    >
                        {paginatedSchedules.map((row) => (
                            <ScheduleTableRow
                                key={row.ma_lich_kham}
                                row={row}
                                details={chiTietMap[row.ma_lich_kham] || []}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onSubmit={onSubmit}
                                onView={onView}
                                getScheduleStatus={getScheduleStatus}
                                statusColor={statusColor}
                            />
                        ))}
                    </DataTable>
                </Box>
                {filteredSchedules.length > rowsPerPage && (
                    <PaginationWidget
                        page={page}
                        totalRecords={filteredSchedules.length}
                        rowsPerPage={rowsPerPage}
                        onChange={setPage}
                        sx={{ mt: 2 }}
                    />
                )}
            </CardContent>
        </Card>
    );
}
