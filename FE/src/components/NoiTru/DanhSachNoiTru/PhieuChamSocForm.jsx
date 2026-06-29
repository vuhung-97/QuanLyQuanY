import { useCallback, useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import KhoThuocDialog from "@/components/KhamBenhChoQN/KhamBenh/KhoThuocDialog.jsx";

export default function PhieuChamSocForm({ open, initialData, onSave, onClose, defaultGiuong = "", defaultBuong = "" }) {
    const [formState, setFormState] = useState({
        thoi_gian: new Date().toISOString().slice(0, 16),
        so_giuong: "",
        buong: "",
        theo_doi_dien_bien: "",
        thuc_hien_y_lenh: "",
    });
    const [thuocItems, setThuocItems] = useState([]);
    const [openThemThuoc, setOpenThemThuoc] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (initialData) {
            setFormState({
                thoi_gian: initialData.thoi_gian
                    ? new Date(initialData.thoi_gian).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
                so_giuong: initialData.so_giuong || "",
                buong: initialData.buong || "",
                theo_doi_dien_bien: initialData.theo_doi_dien_bien || "",
                thuc_hien_y_lenh: initialData.thuc_hien_y_lenh || "",
            });
            setThuocItems(initialData.chi_tiet || []);
        } else {
            setFormState({
                thoi_gian: new Date().toISOString().slice(0, 16),
                so_giuong: defaultGiuong || "",
                buong: defaultBuong || "",
                theo_doi_dien_bien: "",
                thuc_hien_y_lenh: "",
            });
            setThuocItems([]);
        }
    }, [open, initialData, defaultGiuong, defaultBuong]);

    const updateField = useCallback((name, value) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleThemThuocConfirm = useCallback((items) => {
        setThuocItems((prev) => [...prev, ...items]);
    }, []);

    const handleXoaThuoc = useCallback((index) => {
        setThuocItems((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleSave = useCallback(() => {
        onSave({
            ...formState,
            thoi_gian: new Date(formState.thoi_gian).toISOString(),
            chi_tiet: thuocItems,
        });
    }, [formState, thuocItems, onSave]);

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {initialData ? "Sửa phiếu chăm sóc" : "Thêm phiếu chăm sóc"}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Thời gian"
                                    type="datetime-local"
                                    fullWidth
                                    value={formState.thoi_gian}
                                    onChange={(e) => updateField("thoi_gian", e.target.value)}
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                                <TextField
                                    label="Số giường"
                                    fullWidth
                                    value={formState.so_giuong}
                                    onChange={(e) => updateField("so_giuong", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                                <TextField
                                    label="Buồng"
                                    fullWidth
                                    value={formState.buong}
                                    onChange={(e) => updateField("buong", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Diễn biến"
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    value={formState.theo_doi_dien_bien}
                                    onChange={(e) => updateField("theo_doi_dien_bien", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Y lệnh đã thực hiện"
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    value={formState.thuc_hien_y_lenh}
                                    onChange={(e) => updateField("thuc_hien_y_lenh", e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <Typography variant="h3" sx={{ color: "text.primary" }}>
                                    Thuốc / VTYT đã dùng
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenThemThuoc(true)}
                                    sx={{ textTransform: "none" }}
                                >
                                    Thêm thuốc
                                </Button>
                            </Stack>
                            {thuocItems.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    Chưa có thuốc nào.
                                </Typography>
                            ) : (
                                <Stack spacing={1}>
                                    {thuocItems.map((item, idx) => (
                                        <Stack
                                            key={idx}
                                            direction="row"
                                            spacing={1}
                                            sx={{ alignItems: "center" }}
                                        >
                                            <Typography variant="body2" sx={{ flex: 1 }}>
                                                {idx + 1}. {item.ten_thuoc_vtyt || item.ma_thuoc_vtyt}
                                            </Typography>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={item.so_luong}
                                                onChange={(e) => {
                                                    const newItems = [...thuocItems];
                                                    newItems[idx] = { ...newItems[idx], so_luong: Math.max(1, parseInt(e.target.value) || 1) };
                                                    setThuocItems(newItems);
                                                }}
                                                slotProps={{ htmlInput: { min: 1, style: { width: 60 } } }}
                                                sx={{ "& .MuiInputBase-root": { fontSize: "0.8125rem" } }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                ({item.don_vi_tinh || "?"})
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleXoaThuoc(idx)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    ))}
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} sx={{ textTransform: "none" }}>Hủy</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ textTransform: "none" }}>
                        Lưu phiếu
                    </Button>
                </DialogActions>
            </Dialog>

            <KhoThuocDialog
                open={openThemThuoc}
                onClose={() => setOpenThemThuoc(false)}
                onConfirm={handleThemThuocConfirm}
            />
        </>
    );
}