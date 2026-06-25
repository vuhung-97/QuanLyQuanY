import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import {
    NoteAdd as NoteAddIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import useLapBenhAn from "@/hooks/useLapBenhAn.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import LapBenhAnForm from "./LapBenhAnForm.jsx";

const columns = [
    {
        key: "stt",
        label: "STT",
        render: (row, idx) => idx + 1,
    },
    {
        key: "ma_kham_benh",
        label: "Mã KB",
        sx: { color: "primary.main" },
    },
    { key: "ho_ten", label: "Họ tên QN" },
    {
        key: "ten_don_vi",
        label: "Đơn vị",
        render: (row) => row.ten_don_vi || "--",
    },
    {
        key: "ngay_kham",
        label: "Ngày chỉ định",
        render: (row) =>
            row.ngay_kham
                ? new Date(row.ngay_kham).toLocaleDateString("vi-VN")
                : "--",
    },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row, _idx, { onLapBenhAn }) => (
            <Button
                size="small"
                variant="contained"
                startIcon={<NoteAddIcon />}
                sx={{ textTransform: "none" }}
                onClick={() => onLapBenhAn(row)}
            >
                Lập bệnh án
            </Button>
        ),
    },
];

export default function LapBenhAnList() {
    const {
        initialLoading,
        refreshing,
        searchText,
        setSearchText,
        filtered,
        snackbar,
        setSnackbar,
        openForm,
        selectedExam,
        handleOpenForm,
        handleCloseForm,
        handleLapBenhAn,
        saving,
        loadData,
    } = useLapBenhAn();

    return (
        <>
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
                        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
                            Quân nhân chờ lập bệnh án
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={loadData}
                            sx={{ textTransform: "none" }}
                        >
                            Refresh
                        </Button>
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
                        emptyMessage="Không có quân nhân nào chờ nhập viện."
                        rowExtra={{
                            onLapBenhAn: handleOpenForm,
                        }}
                    />
                </CardContent>
            </Card>

            {selectedExam && (
                <LapBenhAnForm
                    open={openForm}
                    exam={selectedExam}
                    saving={saving}
                    onSave={handleLapBenhAn}
                    onClose={handleCloseForm}
                />
            )}

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />
        </>
    );
}
