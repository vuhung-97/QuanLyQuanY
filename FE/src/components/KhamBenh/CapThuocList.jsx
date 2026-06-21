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
import DatePicker from "../common/DatePicker.jsx";
import {
    Download as DownloadIcon,
    MedicalServices as MedicalServicesIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import useCapThuoc from "../../hooks/useCapThuoc.jsx";
import {
    buildCapThuocXlsContent,
    saveWorkbook,
} from "../../utils/xlsExport.js";
import CapThuocForm from "./CapThuocForm.jsx";
import DataTable from "../common/DataTable.jsx";
import FeedbackSnackbar from "../common/FeedbackSnackbar.jsx";
import SearchBar from "../common/SearchBar.jsx";
import StatCardGrid from "../common/StatCardGrid.jsx";

const STATUS_MAP = {
    chờ_nhận_thuốc: { label: "Chờ cấp thuốc", color: "warning" },
    đã_nhận_thuốc: { label: "Đã nhận thuốc", color: "success" },
};

const columns = [
    { key: "stt", label: "STT", render: (row, idx) => idx + 1 },
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

    const handleExport = async () => {
        try {
            const wb = buildCapThuocXlsContent(filtered);
            await saveWorkbook(wb, "danh_sach_cap_thuoc.xlsx");
        } catch {
            /* ignore */
        }
    };

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
                                Danh sách quân nhân cấp thuốc ngày
                            </Typography>
                            <DatePicker
                                value={selectedDate}
                                onChange={setSelectedDate}
                            />
                        </Stack>
                        <Stack direction="row" spacing={1.5}>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={handleExport}
                                sx={{ textTransform: "none" }}
                            >
                                In đơn thuốc
                            </Button>
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
                            selectedDate.isSame(dayjs(), "day")
                                ? "Không có quân nhân chờ cấp thuốc."
                                : `Không có quân nhân chờ cấp thuốc ngày ${selectedDate.format("DD/MM/YYYY")}.`
                        }
                        rowExtra={{ onDispense: handleOpenForm }}
                    />
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
