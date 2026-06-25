import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    TextField,
    IconButton,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import useQuanLyPhongGiuong from "@/hooks/useQuanLyPhongGiuong.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import BuongDialog from "./BuongDialog.jsx";

const buongColumns = (onEdit, onDelete) => [
    { key: "stt", label: "STT", render: (row, idx) => idx + 1 },
    { key: "ten_buong", label: "Tên buồng" },
    {
        key: "so_giuong_toi_da",
        label: "Sức chứa",
        render: (row) => row.so_giuong_toi_da ?? "--",
    },
    { key: "so_giuong_hien_co", label: "Số giường" },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row) => (
            <Stack direction="row" spacing={0.5}>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(row)}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete("buong", row.ma_buong)}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Stack>
        ),
    },
];

const giuongColumns = (
    transferSource,
    onSelectSource,
    onNhanClick,
    onCancelTransfer,
) => [
    { key: "stt", label: "STT", render: (row, idx) => idx + 1 },
    { key: "ten_giuong", label: "Tên giường" },
    { key: "ten_buong", label: "Buồng" },
    {
        key: "trang_thai",
        label: "Trạng thái",
        render: (row) => (
            <Chip
                label={row.trang_thai}
                color={row.trang_thai === "có người" ? "info" : "default"}
                size="small"
                sx={{ fontWeight: 600 }}
            />
        ),
    },
    {
        key: "ho_ten_benh_nhan",
        label: "Bệnh nhân",
        render: (row) => row.ho_ten_benh_nhan || "--",
    },
    {
        key: "thao_tac",
        label: "Thao tác",
        render: (row) => {
            if (row.ma_giuong === transferSource)
                return (
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={onCancelTransfer}
                        sx={{ textTransform: "none" }}
                    >
                        Hủy
                    </Button>
                );
            if (transferSource && row.trang_thai === "trống")
                return (
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => onNhanClick(row.ma_giuong)}
                        sx={{ textTransform: "none" }}
                    >
                        Nhận
                    </Button>
                );
            if (!transferSource && row.trang_thai === "có người")
                return (
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onSelectSource(row.ma_giuong)}
                        sx={{ textTransform: "none" }}
                    >
                        Chuyển
                    </Button>
                );
            return null;
        },
    },
];

export default function QuanLyPhongGiuong() {
    const {
        loading,
        buongList,
        filteredGiuong,
        filterBuong,
        setFilterBuong,
        snackbar,
        setSnackbar,
        buongDialog,
        buongForm,
        setBuongForm,
        buongFormErrors,
        validateBuongForm,
        tenGiuongMoi,
        setTenGiuongMoi,
        handleOpenAddBuong,
        handleOpenEditBuong,
        handleCloseBuongDialog,
        handleSaveBuong,
        confirmDelete,
        handleDeleteClick,
        handleDeleteCancel,
        handleDeleteConfirm,
        loadData,
        selectedBuong,
        editBuongGiuongList,
        handleAddGiuongInRoom,
        handleDeleteGiuongInRoom,
        transferSource,
        confirmNhan,
        handleSelectSource,
        handleCancelTransfer,
        handleNhanClick,
        handleNhanCancel,
        handleNhanConfirm,
    } = useQuanLyPhongGiuong();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                        <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                            Danh sách buồng
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenAddBuong}
                                sx={{ textTransform: "none" }}
                            >
                                Thêm buồng
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
                    <DataTable
                        columns={buongColumns(
                            handleOpenEditBuong,
                            handleDeleteClick,
                        )}
                        rows={buongList}
                        loading={loading}
                        emptyMessage="Chưa có buồng nào."
                    />
                </CardContent>
            </Card>

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
                            spacing={2}
                            sx={{ alignItems: "center" }}
                        >
                            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                                Danh sách giường
                            </Typography>
                            <Autocomplete
                                options={buongList}
                                value={selectedBuong}
                                getOptionLabel={(o) => o.ten_buong}
                                onChange={(_, v) =>
                                    setFilterBuong(v ? v.ma_buong : "")
                                }
                                sx={{ width: 200 }}
                                size="small"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Lọc theo buồng"
                                    />
                                )}
                            />
                        </Stack>
                    </Stack>
                    <DataTable
                        columns={giuongColumns(
                            transferSource,
                            handleSelectSource,
                            handleNhanClick,
                            handleCancelTransfer,
                        )}
                        rows={filteredGiuong}
                        loading={loading}
                        emptyMessage="Không có giường nào."
                    />
                </CardContent>
            </Card>

            <BuongDialog
                open={buongDialog.open}
                edit={buongDialog.edit}
                onClose={handleCloseBuongDialog}
                buongForm={buongForm}
                setBuongForm={setBuongForm}
                buongFormErrors={buongFormErrors}
                onSave={handleSaveBuong}
                editBuongGiuongList={editBuongGiuongList}
                tenGiuongMoi={tenGiuongMoi}
                setTenGiuongMoi={setTenGiuongMoi}
                onAddGiuong={handleAddGiuongInRoom}
                onDeleteGiuong={handleDeleteGiuongInRoom}
            />

            <ConfirmDialog
                open={confirmDelete.open}
                title={`Xóa ${confirmDelete.type === "buong" ? "buồng" : "giường"}`}
                message={
                    confirmDelete.type === "buong"
                        ? "Xóa buồng sẽ xóa tất cả giường trong buồng. Bạn có chắc?"
                        : "Bạn có chắc muốn xóa giường này?"
                }
                loading={false}
                onConfirm={handleDeleteConfirm}
                onClose={handleDeleteCancel}
            />

            <ConfirmDialog
                open={confirmNhan.open}
                title="Xác nhận chuyển giường"
                message={(() => {
                    const src = filteredGiuong.find(
                        (g) => g.ma_giuong === transferSource,
                    );
                    const tgt = filteredGiuong.find(
                        (g) => g.ma_giuong === confirmNhan.target,
                    );
                    return `Chuyển bệnh nhân từ giường ${src?.ten_giuong || ""} (buồng ${src?.ten_buong || ""}) sang giường ${tgt?.ten_giuong || ""} (buồng ${tgt?.ten_buong || ""})?`;
                })()}
                confirmLabel="Chuyển"
                confirmColor="warning"
                loading={false}
                onConfirm={handleNhanConfirm}
                onClose={handleNhanCancel}
            />

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            />
        </Box>
    );
}
