import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import NumberField from "@/components/common/NumberField.jsx";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ActionIcon from "@/components/common/ActionIcon.jsx";

export default function BuongDialog({
    buong,
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
        <Dialog open={!!buong} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitleWrapper wrap={false}>
                Sửa phòng: {buong?.ten_buong}
            </DialogTitleWrapper>
            <DialogContent dividers>
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
                    <NumberField
                        label="Sức chứa (số giường tối đa)"
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

                    <Divider />
                    <Typography variant="h3">
                        Danh sách giường
                    </Typography>

                    {editBuongGiuongList.map((g) => {
                        const isOccupied = g.trang_thai === "có người";
                        return (
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
                                    color={isOccupied ? "info" : "default"}
                                    sx={{ fontWeight: 600 }}
                                />
                                {!isOccupied && (
                                    <ActionIcon
                                        title="Xoá"
                                        icon={<DeleteIcon />}
                                        color="error"
                                        onClick={() => onDeleteGiuong(g.ma_giuong)}
                                    />
                                )}
                            </Stack>
                        );
                    })}

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
                                        buong.ma_buong,
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
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ textTransform: "none" }}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={onSave}
                    sx={{ textTransform: "none" }}
                >
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
}
