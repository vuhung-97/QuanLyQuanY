import dayjs from "dayjs";
import { useMemo } from "react";
import {
    Button,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import {
    Delete as DeleteIcon,
    Download as DownloadIcon,
    MedicalServices as MedicalServicesIcon,
    PendingActions as PendingActionsIcon,
    PersonAddAlt as PersonAddAltIcon,
    Refresh as RefreshIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";
import useDanhSachKhamBenh from "@/hooks/useDanhSachKhamBenh.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import ExamListPage from "@/components/common/ExamListPage.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import StatusFilter from "@/components/common/StatusFilter.jsx";
import KhamBenhForm from "./KhamBenhForm.jsx";
import TiepNhanQnDialog from "./TiepNhanQnDialog.jsx";
import { STATUS_MAP } from "@/constants/khamBenhConstants.js";
import { formatDateTime } from "@/utils/date.js";

const columns = [
    {
        key: "stt",
        label: "STT",
        render: (row, idx, extra) => (extra?.offset || 0) + idx + 1,
    },
    {
        key: "ma_kham_benh",
        label: "Mã KB",
        sx: { color: "primary.main" },
    },
    { key: "ho_ten", label: "Họ tên QN" },
    { key: "don_vi", label: "Đơn vị", render: (row) => row.ten_don_vi || "--" },
    {
        key: "trang_thai",
        label: "Trạng thái",
        render: (row) => (
            <Chip
                label={STATUS_MAP[row.trang_thai]?.label || row.trang_thai}
                color={STATUS_MAP[row.trang_thai]?.color || "default"}
                size="small"
                sx={{ fontWeight: 600 }}
            />
        ),
    },
    {
        key: "ngay_kham",
        label: "Ngày khám",
        render: (row) =>
            row.ngay_kham ? (
                <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                    {formatDateTime(row.ngay_kham)}
                </Typography>
            ) : (
                "--"
            ),
    },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row, _idx, { onExam, onDelete }) => (
            <Stack direction="row" spacing={0.5}>
                {["đã_khám", "chờ_nhận_thuốc", "đã_nhận_thuốc"].includes(
                    row.trang_thai,
                ) ? (
                    <ActionIcon title="Xem" icon={<VisibilityIcon />} color="info" onClick={() => onExam(row.ma_kham_benh)} />
                ) : (
                    <ActionIcon title="Khám" icon={<MedicalServicesIcon />} color="primary" onClick={() => onExam(row.ma_kham_benh)} />
                )}
                {!["đã_khám", "đã_nhận_thuốc"].includes(row.trang_thai) && (
                    <ActionIcon title="Xoá" icon={<DeleteIcon />} color="error" onClick={() => onDelete(row.ma_kham_benh)} />
                )}
            </Stack>
        ),
    },
];

function ToolbarRight({ onReceive, onRefresh }) {
    return (
        <Stack direction="row" spacing={1.5}>
            <Button
                variant="contained"
                startIcon={<PersonAddAltIcon />}
                onClick={onReceive}
                sx={{ textTransform: "none" }}
            >
                Tiếp nhận QN mới
            </Button>
            <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                sx={{ textTransform: "none" }}
            >
                Refresh
            </Button>
        </Stack>
    );
}

export default function DanhSachKhamBenh() {
    const {
        initialLoading,
        refreshing,
        setSearchText,
        statusFilter,
        setStatusFilter,
        filtered,
        statusCounts,
        snackbar,
        setSnackbar,
        confirmDelete,
        handleDeleteClick,
        handleDeleteCancel,
        handleDeleteConfirm,
        openExamForm,
        selectedExamId,
        handleOpenExamForm,
        handleCloseExamForm,
        openReceiveDialog,
        setOpenReceiveDialog,
        handleSelectQN,
        loadData,
        selectedDate,
        setSelectedDate,
        isLeft,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
        nam,
        setNam,
        thang,
        handleFilterThangChange,
    } = useDanhSachKhamBenh();

    const statItems = useMemo(
        () => [
            {
                label: "Chờ khám",
                value: statusCounts.cho,
                icon: <PendingActionsIcon />,
                color: "#F59E0B",
                bg: "#FEF3C7",
            },
            {
                label: "Đang khám",
                value: statusCounts.dangKham,
                icon: <MedicalServicesIcon />,
                color: "#0B3B60",
                bg: "#DBEAFE",
            },
            {
                label: "Đã xong",
                value: statusCounts.daXong,
                icon: <DownloadIcon />,
                color: "#10B981",
                bg: "#D1FAE5",
            },
            {
                label: "Chuyển tuyến",
                value: statusCounts.chuyenTuyen,
                icon: <MedicalServicesIcon />,
                color: "#EF4444",
                bg: "#FEE2E2",
            },
        ],
        [statusCounts],
    );

    const toolbar = (
        <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
                mb: 2,
                justifyContent: "space-between",
                alignItems: { md: "center" },
            }}
        >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <FilterModeToggle
                    isLeft={isLeft}
                    onChange={handleFilterModeChange}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
                {isLeft && (
                    <YearMonthFilter
                        nam={nam}
                        onNamChange={(v) => {
                            setNam(v);
                            setPage(1);
                        }}
                        thang={thang}
                        onThangChange={handleFilterThangChange}
                    />
                )}
                <StatusFilter
                    value={statusFilter}
                    onChange={setStatusFilter}
                    statusMap={STATUS_MAP}
                />
            </Stack>
            <ToolbarRight
                onReceive={() => setOpenReceiveDialog(true)}
                onRefresh={loadData}
            />
        </Stack>
    );

    return (
        <ExamListPage
            statItems={statItems}
            loading={initialLoading}
            refreshing={refreshing}
            toolbar={toolbar}
            searchPlaceholder="Tìm kiếm ca khám..."
            onSearch={setSearchText}
            columns={columns}
            rows={filtered}
            emptyMessage={
                isLeft
                    ? "Không có ca khám nào."
                    : selectedDate.isSame(dayjs(), "day")
                      ? "Chưa có ca khám nào hôm nay."
                      : `Không có ca khám nào ngày ${selectedDate.format("DD/MM/YYYY")}.`
            }
            rowExtra={{
                onExam: handleOpenExamForm,
                onDelete: handleDeleteClick,
                offset,
            }}
            showPagination={isLeft && totalRecords > 0}
            page={page}
            totalRecords={totalRecords}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={setPage}
        >
            <TiepNhanQnDialog
                open={openReceiveDialog}
                onClose={() => setOpenReceiveDialog(false)}
                onSelected={handleSelectQN}
            />

            <ConfirmDialog
                open={confirmDelete.open}
                title="Xác nhận xóa"
                message="Bạn có chắc muốn xóa ca khám này? Hành động này không thể hoàn tác."
                confirmLabel="Xóa"
                confirmColor="error"
                onConfirm={handleDeleteConfirm}
                onClose={handleDeleteCancel}
            />

            <KhamBenhForm
                open={openExamForm}
                examinationId={selectedExamId}
                rowData={filtered.find(
                    (e) => e.ma_kham_benh === selectedExamId,
                )}
                onClose={handleCloseExamForm}
                onSaved={loadData}
            />

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />
        </ExamListPage>
    );
}
