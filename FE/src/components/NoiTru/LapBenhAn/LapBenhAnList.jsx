import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    DoDisturb as DoDisturbIcon,
    NoteAdd as NoteAddIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import useLapBenhAn from "@/hooks/useLapBenhAn.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import IfRole from "@/components/common/IfRole.jsx";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";
import LapBenhAnForm from "./LapBenhAnForm.jsx";
import { ROLES } from "@/constants/roleConstants.js";
import { formatDate } from "@/utils/date.js";

const columns = [
    {
        key: "stt",
        label: "STT",
        render: (row, idx) => idx + 1,
    },
    { key: "ho_ten", label: "Họ tên QN" },
    {
        key: "ten_don_vi",
        label: "Đơn vị",
        render: (row) => row.ten_don_vi || "--",
    },
    { key: "trieu_chung", label: "Triệu chứng", render: (row) => row.trieu_chung || "--" },
    {
        key: "chan_doan",
        label: "Chẩn đoán",
        render: (row) => (
            <Box sx={{ maxHeight: 100, overflow: "auto", whiteSpace: "normal", wordBreak: "break-word" }}>
                {row.chan_doan || "--"}
            </Box>
        ),
    },
    {
        key: "ngay_kham",
        label: "Ngày chỉ định",
        render: (row) => formatDate(row.ngay_kham),
    },
    {
        key: "trang_thai",
        label: "Trạng thái",
        render: (row) => (
            <Chip
                label={row.da_duyet ? "Đã duyệt" : "Chờ duyệt"}
                color={row.da_duyet ? "success" : "warning"}
                size="small"
                sx={{ fontWeight: 600 }}
            />
        ),
    },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row, _idx, { onLapBenhAn, onApprove, onReject }) =>
            row.da_duyet ? (
                <ActionIcon title="Lập bệnh án" icon={<NoteAddIcon />} color="primary" onClick={() => onLapBenhAn(row)} />
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

export default function LapBenhAnList() {
    const {
        initialLoading,
        refreshing,
        setSearchText,
        filtered,
        snackbar,
        setSnackbar,
        openForm,
        selectedExam,
        handleOpenForm,
        handleCloseForm,
        handleLapBenhAn,
        handleApprove,
        handleReject,
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
                    <SearchBarDebounced
                        onSearch={setSearchText}
                        placeholder="Tìm kiếm quân nhân..."
                    />
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        loading={initialLoading || refreshing}
                        emptyMessage="Không có quân nhân nào chờ nhập viện."
                        rowExtra={{
                            onLapBenhAn: handleOpenForm,
                            onApprove: handleApprove,
                            onReject: handleReject,
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
