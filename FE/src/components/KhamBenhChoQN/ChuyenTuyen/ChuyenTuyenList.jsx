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
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import {
    MedicalServices as MedicalServicesIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import useChuyenTuyen from "@/hooks/useChuyenTuyen.jsx";
import ChuyenTuyenForm from "./ChuyenTuyenForm.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";

const STATUS_MAP = {
    chuyển_tuyến: { label: "Chuyển tuyến", color: "error" },
};

const columns = [
    { key: "stt", label: "STT", render: (row, idx, extra) => (extra?.offset || 0) + idx + 1 },
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
            row.ngay_kham
                ? new Date(row.ngay_kham).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                  })
                : "--",
    },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row, _idx, { onView }) => (
            <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => onView(row.ma_kham_benh)}
                sx={{ textTransform: "none" }}
            >
                Xem
            </Button>
        ),
    },
];

export default function ChuyenTuyenList() {
    const {
        initialLoading,
        refreshing,
        selectedDate,
        setSelectedDate,
        searchText,
        setSearchText,
        filtered,
        stats,
        snackbar,
        setSnackbar,
        selectedExam,
        examDetail,
        detailLoading,
        openForm,
        selectedGiayGt,
        selectedDiTuyen,
        saving,
        handleViewDetail,
        handleCloseForm,
        handleSave,
        loadData,
        filterMode,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
    } = useChuyenTuyen();

    const statItems = useMemo(
        () => [
            {
                label: "Chuyển tuyến",
                value: stats.tongSo,
                icon: <MedicalServicesIcon />,
                color: "#EF4444",
                bg: "#FEE2E2",
            },
        ],
        [stats],
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
                            <Typography variant="h2">
                                Danh sách quân nhân chuyển tuyến
                            </Typography>
                            <FilterModeToggle
                                filterMode={filterMode}
                                onChange={handleFilterModeChange}
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                            />
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={loadData}
                                sx={{ textTransform: "none" }}
                            >
                                Refresh
                            </Button>
                        </Stack>
                    </Stack>
                    <SearchBar
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm quân nhân..."
                    />
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        loading={initialLoading || refreshing}
                        emptyMessage={
                            filterMode === "tat_ca"
                                ? "Không có quân nhân chuyển tuyến."
                                : selectedDate.isSame(dayjs(), "day")
                                    ? "Không có quân nhân chuyển tuyến."
                                    : `Không có quân nhân chuyển tuyến ngày ${selectedDate.format("DD/MM/YYYY")}.`
                        }
                        rowExtra={{ onView: handleViewDetail, offset }}
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

            <ChuyenTuyenForm
                open={openForm}
                selectedExam={selectedExam}
                examDetail={examDetail}
                loading={detailLoading}
                giayGt={selectedGiayGt}
                diTuyen={selectedDiTuyen}
                saving={saving}
                onClose={handleCloseForm}
                onSave={handleSave}
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
