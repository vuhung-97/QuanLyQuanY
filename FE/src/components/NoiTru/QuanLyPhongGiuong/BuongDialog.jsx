import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

export default function BuongDialog({
    open,
    edit,
    onClose,
    buongForm,
    setBuongForm,
    buongFormErrors,
    onSave,
    editBuongGiuongList,
    tenGiuongMoi,
    setTenGiuongMoi,
    onAddGiuong,
    onDeleteGiuong,
}) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}
            >
                {edit ? `Sửa phòng: ${edit.ten_buong}` : "Thêm phòng mới"}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Tên phòng"
                        fullWidth
                        value={buongForm.ten_buong}
                        onChange={(e) =>
                            setBuongForm((f) => ({
                                ...f,
                                ten_buong: e.target.value,
                            }))
                        }
                        error={!!buongFormErrors.ten_buong}
                        helperText={buongFormErrors.ten_buong}
                    />
                    <TextField
                        label="Sức chứa (số giường tối đa)"
                        type="number"
                        fullWidth
                        value={buongForm.so_giuong_toi_da}
                        onChange={(e) =>
                            setBuongForm((f) => ({
                                ...f,
                                so_giuong_toi_da: Number(e.target.value),
                            }))
                        }
                        slotProps={{ htmlInput: { min: 1 } }}
                    />

                    {edit && (
                        <>
                            <Divider />
                            <Typography variant="h3">
                                Danh sách giường
                            </Typography>

                            {editBuongGiuongList.map((g) => (
                                <Stack
                                    key={g.ma_giuong}
                                    direction="row"
                                    spacing={1}
                                    sx={{ alignItems: "center", py: 0.5 }}
                                >
                                    <Typography sx={{ flex: 1 }}>
                                        {g.ten_giuong}
                                    </Typography>
                                    <Chip
                                        label={g.trang_thai}
                                        size="small"
                                        color={
                                            g.trang_thai === "có người"
                                                ? "info"
                                                : "default"
                                        }
                                        sx={{ fontWeight: 600 }}
                                    />
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            onDeleteGiuong(g.ma_giuong)
                                        }
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            ))}

                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                            >
                                Số giường: {editBuongGiuongList.length} /{" "}
                                {buongForm.so_giuong_toi_da}
                            </Typography>

                            {editBuongGiuongList.length <
                            buongForm.so_giuong_toi_da ? (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ alignItems: "center" }}
                                >
                                    <TextField
                                        size="small"
                                        label="Tên giường mới"
                                        value={tenGiuongMoi}
                                        onChange={(e) =>
                                            setTenGiuongMoi(e.target.value)
                                        }
                                        sx={{ flex: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        disabled={!tenGiuongMoi.trim()}
                                        onClick={() => {
                                            onAddGiuong(
                                                edit.ma_buong,
                                                tenGiuongMoi.trim(),
                                            );
                                            setTenGiuongMoi("");
                                        }}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Thêm
                                    </Button>
                                </Stack>
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{ color: "error.main" }}
                                >
                                    Đã đạt tối đa {buongForm.so_giuong_toi_da}{" "}
                                    giường.
                                </Typography>
                            )}
                        </>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ textTransform: "none" }}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={onSave}
                    sx={{ textTransform: "none" }}
                >
                    {edit ? "Cập nhật" : "Thêm"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
