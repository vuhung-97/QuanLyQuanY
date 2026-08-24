import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
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
    DoDisturb as DoDisturbIcon,
    CheckCircle as CheckCircleIcon,
    Edit as EditIcon,
    Print as PrintIcon,
    RestartAlt as RestartAltIcon,
    Send as SendIcon,
    Update as UpdateIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import StatusFilter from "@/components/common/StatusFilter.jsx";
import { formatDateTime } from "@/utils/date.js";
import IfRole from "@/components/common/IfRole.jsx";
import { ROLES } from "@/constants/roleConstants.js";
import {
    findNearestDetail,
    getScheduleStatus,
    statusColor,
} from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";

const STATUS_UI = {
    da_duyet: { label: "Đã duyệt", color: "success", variant: "filled" },
    cho_duyet: { label: "Chờ duyệt", color: "warning", variant: "filled" },
    cho_gui: { label: "Chờ gửi", color: "default", variant: "outlined" },
    tu_choi: { label: "Từ chối", color: "error", variant: "filled" },
    tam_hoan: { label: "Tạm hoãn", color: "secondary", variant: "filled" },
};

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
    onApprove,
    onReject,
    onSubmit,
    onView,
    onHoan,
    onPrint,
    isSelected,
    onSelectRow,
}) {
    const currentStatus = getScheduleStatus(row);
    const nearest = findNearestDetail(details);

    const isDangThucHien = currentStatus === "Đang thực hiện";

    const rowBg = isSelected
        ? "rgba(11, 59, 96, 0.12)"
        : isDangThucHien
          ? statusColor(currentStatus).bgcolor
          : undefined;

    return (
        <TableRow
            hover
            onClick={() => onSelectRow(row.ma_lich_kham)}
            sx={{
                cursor: "pointer",
                ...(rowBg ? { bgcolor: rowBg } : {}),
            }}
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
                            STATUS_UI[row.trang_thai]?.label ||
                            row.trang_thai ||
                            "—"
                        }
                        color={STATUS_UI[row.trang_thai]?.color || "default"}
                        variant={STATUS_UI[row.trang_thai]?.variant || "filled"}
                        sx={{ fontWeight: 600 }}
                    />
                </Stack>
            </TableCell>
            <TableCell>
                {row.trang_thai === "da_duyet" ? (
                    <Stack direction="row" spacing={0.5}>
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
                        <IfRole roles={[ROLES.ADMIN, ROLES.CNQY, ROLES.YSI]}>
                            <ActionIcon
                                title="In lịch khám"
                                icon={<PrintIcon />}
                                color="success"
                                onClick={() => onPrint?.(row)}
                            />
                        </IfRole>
                        {currentStatus !== "Đã kết thúc" && (
                            <IfRole roles={[ROLES.ADMIN, ROLES.CNQY]}>
                                <ActionIcon
                                    title="Hoãn"
                                    icon={<UpdateIcon />}
                                    color="warning"
                                    onClick={() => onHoan(row)}
                                />
                            </IfRole>
                        )}
                    </Stack>
                ) : row.trang_thai === "tam_hoan" ? (
                    <Stack direction="row" spacing={0.5}>
                        <ActionIcon
                            title="Xem"
                            icon={<VisibilityIcon />}
                            color="info"
                            onClick={() => onView(row)}
                        />
                        <IfRole roles={[ROLES.ADMIN, ROLES.CNQY]}>
                            <ActionIcon
                                title="Sửa"
                                icon={<EditIcon />}
                                onClick={() => onEdit(row)}
                            />
                        </IfRole>
                    </Stack>
                ) : row.trang_thai === "cho_gui" ? (
                    <IfRole
                        roles={[ROLES.ADMIN, ROLES.CNQY, ROLES.YSI]}
                    >
                        <Stack direction="row" spacing={0.5}>
                            <ActionIcon
                                title="Sửa"
                                icon={<EditIcon />}
                                onClick={() => onEdit(row)}
                            />
                            <ActionIcon
                                title="Gửi duyệt"
                                icon={<SendIcon />}
                                onClick={() => onSubmit(row)}
                            />
                            <ActionIcon
                                title="Xóa"
                                icon={<DeleteIcon />}
                                color="error"
                                onClick={() => onDelete(row)}
                            />
                        </Stack>
                    </IfRole>
                ) : row.trang_thai === "cho_duyet" ? (
                    <Stack direction="row" spacing={0.5}>
                        <ActionIcon
                            title="Xem"
                            icon={<VisibilityIcon />}
                            color="info"
                            onClick={() => onView(row)}
                        />
                        <IfRole roles={[ROLES.ADMIN, ROLES.CNQY]}>
                            <ActionIcon
                                title="Duyệt"
                                icon={<CheckCircleIcon />}
                                color="success"
                                onClick={() => onApprove?.(row)}
                            />
                            <ActionIcon
                                title="Không duyệt"
                                icon={<DoDisturbIcon />}
                                color="error"
                                onClick={() => onReject?.(row)}
                            />
                            <ActionIcon
                                title="Xóa"
                                icon={<DeleteIcon />}
                                color="error"
                                onClick={() => onDelete(row)}
                            />
                        </IfRole>
                    </Stack>
                ) : row.trang_thai === "tu_choi" ? (
                    <Stack direction="row" spacing={0.5}>
                        <ActionIcon
                            title="Xem"
                            icon={<VisibilityIcon />}
                            color="info"
                            onClick={() => onView(row)}
                        />
                        <IfRole roles={[ROLES.ADMIN, ROLES.CNQY]}>
                            <ActionIcon
                                title="Xóa"
                                icon={<DeleteIcon />}
                                color="error"
                                onClick={() => onDelete(row)}
                            />
                        </IfRole>
                    </Stack>
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
    onApprove,
    onReject,
    onSubmit,
    onView,
    onHoan,
    onPrint,
    activeLichId,
    onSelectRow,
    onResetDefault,
}) {
    const [year, setYear] = useState("Tất cả");
    const [status, setStatus] = useState(initialStatus || "");

    const statusOptions = [
        "Chờ gửi",
        "Chờ duyệt",
        "Từ chối",
        "Tạm hoãn",
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
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                    >
                        {onResetDefault && activeLichId && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<RestartAltIcon />}
                                onClick={onResetDefault}
                            >
                                Mặc định
                            </Button>
                        )}
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
                                onApprove={onApprove}
                                onReject={onReject}
                                onSubmit={onSubmit}
                                onView={onView}
                                onHoan={onHoan}
                                onPrint={onPrint}
                                isSelected={activeLichId === row.ma_lich_kham}
                                onSelectRow={onSelectRow}
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
