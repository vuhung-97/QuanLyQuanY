import dayjs from "dayjs";
import { useMemo } from "react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";
import {
    Delete as DeleteIcon,
    Download as DownloadIcon,
    MedicalServices as MedicalServicesIcon,
    PendingActions as PendingActionsIcon,
    PersonAddAlt as PersonAddAltIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import useDanhSachKhamBenh from "@/hooks/useDanhSachKhamBenh.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import KhamBenhForm from "./KhamBenhForm.jsx";

import TiepNhanQnDialog from "./TiepNhanQnDialog.jsx";

const STATUS_MAP = {
    chờ: { label: "Chờ khám", color: "default" },
    đang_khám: { label: "Đang khám", color: "info" },
    chờ_nhận_thuốc: { label: "Chờ nhận thuốc", color: "warning" },
    đã_nhận_thuốc: { label: "Đã nhận thuốc", color: "success" },
    đã_khám: { label: "Đã xong", color: "success" },
    chuyển_tuyến: { label: "Chuyển tuyến", color: "error" },
    nhập_viện: { label: "Nhập viện", color: "secondary" },
};

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
                <Stack>
                    <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                        {new Date(row.ngay_kham).toLocaleDateString("vi-VN")}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ lineHeight: 1.3 }}
                    >
                        {new Date(row.ngay_kham).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Typography>
                </Stack>
            ) : (
                "--"
            ),
    },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row, _idx, { onExam, onDelete }) => (
            <Stack direction="row" spacing={0.5}>
                <Button
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                    onClick={() => onExam(row.ma_kham_benh)}
                >
                    {["đã_khám", "chờ_nhận_thuốc", "đã_nhận_thuốc"].includes(
                        row.trang_thai,
                    )
                        ? "Xem"
                        : "Khám"}
                </Button>
                {!["đã_khám", "đã_nhận_thuốc"].includes(row.trang_thai) && (
                    <Button
                        size="small"
                        color="error"
                        sx={{ textTransform: "none", minWidth: 36 }}
                        onClick={() => onDelete(row.ma_kham_benh)}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                )}
            </Stack>
        ),
    },
];

function Toolbar({ onReceive, onRefresh }) {
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
        searchText,
        setSearchText,
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
        filterMode,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
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

    return (
        <>
            <StatCardGrid items={statItems} loading={initialLoading} />

            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        sx={{
                            mb: 2,
                            justifyContent: "space-between",
                            alignItems: { md: "center" },
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                        >
                            <Typography variant="h2">Danh sách khám</Typography>
                            <FilterModeToggle
                                filterMode={filterMode}
                                onChange={handleFilterModeChange}
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                            />
                        </Stack>
                        <Toolbar
                            onReceive={() => setOpenReceiveDialog(true)}
                            onRefresh={loadData}
                        />
                    </Stack>
                    <SearchBar
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm ca khám..."
                    />
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        loading={initialLoading || refreshing}
                        emptyMessage={
                            filterMode === "tat_ca"
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
                    />
                    {filterMode === "tat_ca" && totalRecords > 0 && (
                        <PaginationWidget
                            page={page}
                            totalRecords={totalRecords}
                            rowsPerPage={ROWS_PER_PAGE}
                            onChange={setPage}
                            sx={{ mt: 2 }}
                        />
                    )}
                </CardContent>
            </Card>

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
        </>
    );
}
