import { useMemo } from "react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";
import {
    CheckCircle as CheckCircleIcon,
    DoDisturb as DoDisturbIcon,
    MedicalServices as MedicalServicesIcon,
    Refresh as RefreshIcon,
    Send as SendIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import useChuyenTuyen from "@/hooks/useChuyenTuyen.jsx";
import ChuyenTuyenForm from "./ChuyenTuyenForm.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import IfRole from "@/components/common/IfRole.jsx";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import { ROLES } from "@/constants/roleConstants.js";
import { CHUYEN_TUYEN_STATUS_MAP } from "@/constants/khamBenhConstants.js";
import { formatDate } from "@/utils/date.js";

const columns = [
    {
        key: "stt",
        label: "STT",
        render: (row, idx, extra) => (extra?.offset || 0) + idx + 1,
    },
    { key: "ho_ten", label: "Họ tên QN" },
    { key: "don_vi", label: "Đơn vị", render: (row) => row.ten_don_vi || "--" },
    { key: "trieu_chung", label: "Triệu chứng" },
    { key: "chan_doan", label: "Chẩn đoán" },
    {
        key: "chuyen_tuyen_status",
        label: "Trạng thái",
        render: (row) => (
            <Chip
                label={
                    CHUYEN_TUYEN_STATUS_MAP[row.chuyen_tuyen_status]?.label ||
                    row.trang_thai
                }
                color={
                    CHUYEN_TUYEN_STATUS_MAP[row.chuyen_tuyen_status]?.color ||
                    "default"
                }
                size="small"
                sx={{ fontWeight: 600 }}
            />
        ),
    },
    {
        key: "ngay_kham",
        label: "Ngày khám",
        render: (row) => formatDate(row.ngay_kham),
    },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row, _idx, { onView, onApprove, onReject }) =>
            row.da_duyet ? (
                <ActionIcon title="Xem" icon={<VisibilityIcon />} color="info" onClick={() => onView(row.ma_kham_benh)} />
            ) : (
                <IfRole roles={[ROLES.ADMIN, ROLES.CNQY]}>
                    <Stack direction="row" spacing={0.5}>
                        <ActionIcon title="Duyệt" icon={<CheckCircleIcon />} color="success" onClick={() => onApprove(row.ma_kham_benh)} />
                        <ActionIcon title="Không duyệt" icon={<DoDisturbIcon />} color="error" onClick={() => onReject(row.ma_kham_benh)} />
                    </Stack>
                </IfRole>
            ),
    },
];

export default function ChuyenTuyenList() {
    const {
        initialLoading,
        refreshing,
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
        handleApproveChuyenTuyen,
        handleRejectChuyenTuyen,
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
    } = useChuyenTuyen();

    const statItems = useMemo(
        () => [
            {
                label: "Đề nghị chuyển tuyến",
                value: stats.deNghi,
                icon: <SendIcon />,
                color: "#EF4444",
                bg: "#FEE2E2",
            },
            {
                label: "Chờ chuyển tuyến",
                value: stats.choChuyenTuyen,
                icon: <SendIcon />,
                color: "#F59E0B",
                bg: "#FEF3C7",
            },
            {
                label: "Đã chuyển tuyến",
                value: stats.daChuyenTuyen,
                icon: <MedicalServicesIcon />,
                color: "#0B3B60",
                bg: "#DBEAFE",
            },
            {
                label: "Đã về",
                value: stats.daVe,
                icon: <CheckCircleIcon />,
                color: "#10B981",
                bg: "#D1FAE5",
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
                            <FilterModeToggle
                                isLeft={isLeft}
                                onChange={handleFilterModeChange}
                                selectedDate={null}
                                onDateChange={() => {}}
                                labelLeft="Tất cả"
                                labelRight="Chuyển tuyến"
                            />
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
                    <SearchBarDebounced
                        onSearch={setSearchText}
                        placeholder="Tìm kiếm quân nhân..."
                    />
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        loading={initialLoading || refreshing}
                        emptyMessage={
                            isLeft
                                ? "Không có quân nhân chuyển tuyến."
                                : "Không có quân nhân đề nghị chuyển tuyến."
                        }
                        rowExtra={{ onView: handleViewDetail, onApprove: handleApproveChuyenTuyen, onReject: handleRejectChuyenTuyen, offset }}
                    />
                    {totalRecords > ROWS_PER_PAGE && (
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
