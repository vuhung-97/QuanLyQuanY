import dayjs from "dayjs";
import { useMemo } from "react";
import {
    Button,
    Chip,
    Stack,
} from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";
import {
    Download as DownloadIcon,
    LocalPharmacy as LocalPharmacyIcon,
    MedicalServices as MedicalServicesIcon,
    Refresh as RefreshIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import useCapThuoc from "@/hooks/useCapThuoc.jsx";
import CapThuocForm from "./CapThuocForm.jsx";
import ExamListPage from "@/components/common/ExamListPage.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import StatusFilter from "@/components/common/StatusFilter.jsx";
import { STATUS_MAP } from "@/constants/khamBenhConstants.js";
import { formatDate } from "@/utils/date.js";

const CAP_THUOC_STATUS_MAP = {
    chờ_nhận_thuốc: { label: "Chờ nhận thuốc" },
    đã_nhận_thuốc: { label: "Đã nhận thuốc" },
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
        render: (row) => formatDate(row.ngay_kham) || "--",
    },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row, _idx, { onDispense }) =>
            row.trang_thai === "chờ_nhận_thuốc" ? (
                <ActionIcon
                    title="Cấp thuốc"
                    icon={<LocalPharmacyIcon />}
                    color="primary"
                    onClick={() => onDispense(row.ma_kham_benh)}
                />
            ) : (
                <ActionIcon
                    title="Xem"
                    icon={<VisibilityIcon />}
                    color="default"
                    onClick={() => onDispense(row.ma_kham_benh)}
                />
            ),
    },
];

export default function CapThuocList() {
    const {
        initialLoading,
        refreshing,
        selectedDate,
        setSelectedDate,
        setSearchText,
        statusFilter,
        setStatusFilter,
        filtered,
        stats,
        snackbar,
        setSnackbar,
        selectedExam,
        examDetail,
        detailLoading,
        openForm,
        handleOpenForm,
        handleCloseForm,
        handleDispense,
        dispensing,
        loadData,
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
        setThang,
    } = useCapThuoc();

    const statItems = useMemo(
        () => [
            {
                label: "Chờ cấp thuốc",
                value: stats.choCap,
                icon: <MedicalServicesIcon />,
                color: "#F59E0B",
                bg: "#FEF3C7",
            },
            {
                label: "Đã nhận thuốc",
                value: stats.daNhan,
                icon: <DownloadIcon />,
                color: "#10B981",
                bg: "#D1FAE5",
            },
        ],
        [stats],
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
                        onThangChange={(v) => {
                            setThang(v);
                            setPage(1);
                        }}
                    />
                )}
                <StatusFilter
                    value={statusFilter}
                    onChange={setStatusFilter}
                    statusMap={CAP_THUOC_STATUS_MAP}
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
    );

    return (
        <ExamListPage
            statItems={statItems}
            loading={initialLoading}
            refreshing={refreshing}
            toolbar={toolbar}
            searchPlaceholder="Tìm kiếm quân nhân..."
            onSearch={setSearchText}
            columns={columns}
            rows={filtered}
            emptyMessage={
                isLeft
                    ? "Không có quân nhân cấp thuốc."
                    : selectedDate.isSame(dayjs(), "day")
                      ? "Không có quân nhân chờ cấp thuốc."
                      : `Không có quân nhân chờ cấp thuốc ngày ${selectedDate.format("DD/MM/YYYY")}.`
            }
            rowExtra={{ onDispense: handleOpenForm, offset }}
            showPagination={isLeft && totalRecords > 0}
            page={page}
            totalRecords={totalRecords}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={setPage}
        >
            <CapThuocForm
                open={openForm}
                selectedExam={selectedExam}
                examDetail={examDetail}
                loading={detailLoading}
                onClose={handleCloseForm}
                onDispense={handleDispense}
                dispensing={dispensing}
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
