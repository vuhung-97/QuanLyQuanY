import dayjs from "dayjs";
import { useMemo } from "react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import {
    Download as DownloadIcon,
    MedicalServices as MedicalServicesIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import useCapThuoc from "@/hooks/useCapThuoc.jsx";
import { getNamOptions } from "@/utils/yearOptions.js";
import CapThuocForm from "./CapThuocForm.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import { STATUS_MAP } from "@/constants/khamBenhConstants.js";
import { formatDate } from "@/utils/date.js";

const NAM_OPTIONS = getNamOptions();

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
        render: (row, _idx, { onDispense }) => (
            <Button
                size="small"
                variant={
                    row.trang_thai === "chờ_nhận_thuốc"
                        ? "contained"
                        : "outlined"
                }
                color={
                    row.trang_thai === "chờ_nhận_thuốc" ? "primary" : "inherit"
                }
                onClick={() => onDispense(row.ma_kham_benh)}
                sx={{ textTransform: "none" }}
            >
                {row.trang_thai === "chờ_nhận_thuốc" ? "Cấp thuốc" : "Đã nhận"}
            </Button>
        ),
    },
];

export default function CapThuocList() {
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
        handleOpenForm,
        handleCloseForm,
        handleDispense,
        dispensing,
        loadData,
        filterMode,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        ROWS_PER_PAGE,
        offset,
        nam,
        setNam,
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
                                filterMode={filterMode}
                                onChange={handleFilterModeChange}
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                            />
                            {filterMode === "tat_ca" && (
                                <FormControl
                                    size="small"
                                    sx={{ minWidth: 100 }}
                                >
                                    <InputLabel id="nam-label">
                                        Năm
                                    </InputLabel>
                                    <Select
                                        labelId="nam-label"
                                        value={nam ?? ""}
                                        label="Năm"
                                        onChange={(e) => {
                                            setNam(
                                                e.target.value || null,
                                            );
                                            setPage(1);
                                        }}
                                    >
                                        <MenuItem value="">
                                            Tất cả
                                        </MenuItem>
                                        {NAM_OPTIONS.map((y) => (
                                            <MenuItem key={y} value={y}>
                                                {y}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
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
                                ? "Không có quân nhân cấp thuốc."
                                : selectedDate.isSame(dayjs(), "day")
                                  ? "Không có quân nhân chờ cấp thuốc."
                                  : `Không có quân nhân chờ cấp thuốc ngày ${selectedDate.format("DD/MM/YYYY")}.`
                        }
                        rowExtra={{ onDispense: handleOpenForm, offset }}
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
        </>
    );
}
