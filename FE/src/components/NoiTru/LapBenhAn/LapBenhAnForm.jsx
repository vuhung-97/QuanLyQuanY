import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import useLapBenhAnForm from "../../../hooks/useLapBenhAnForm";
import PatientInfoCard from "./PatientInfoCard";

const VITAL_SIGNS = [
    { key: "nhiet_do", label: "Nhiệt độ (°C)" },
    { key: "ha_tam_thu", label: "HA tối đa" },
    { key: "ha_tam_truong", label: "HA tối thiểu" },
    { key: "nhip_tim", label: "Nhịp tim (lần/ph)" },
];

export default function LapBenhAnForm({ open, exam, saving, onSave, onClose }) {
    const {
        buongList,
        giuongList,
        loadingBuong,
        loadingGiuong,
        maBuong,
        ngayNhapVien,
        selectedBuong,
        selectedGiuong,
        setMaBuong,
        setMaGiuong,
        errors,
        refMap,
        lyDoRef,
        handleSave,
    } = useLapBenhAnForm({ open, onSave });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography
                    sx={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}
                >
                    Lập bệnh án nội trú
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                {exam && (
                    <Stack spacing={3}>
                        <PatientInfoCard
                            exam={exam}
                            ngayNhapVien={ngayNhapVien}
                        />

                        <Box>
                            <Typography
                                variant="h3"
                                sx={{ mb: 1.5, color: "text.primary" }}
                            >
                                Chỉ số sinh tồn
                            </Typography>
                            <Grid container spacing={2}>
                                {VITAL_SIGNS.map((f) => (
                                    <Grid key={f.key} size={{ xs: 6, md: 3 }}>
                                        <TextField
                                            label={f.label}
                                            type="number"
                                            fullWidth
                                            defaultValue=""
                                            inputRef={refMap[f.key]}
                                            slotProps={{
                                                htmlInput: { min: 0 },
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <Autocomplete
                                    options={buongList}
                                    loading={loadingBuong}
                                    value={selectedBuong}
                                    getOptionLabel={(o) => o.ten_buong}
                                    onChange={(_, v) => {
                                        setMaBuong(v ? v.ma_buong : "");
                                        setMaGiuong("");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Buồng"
                                            fullWidth
                                            error={!!errors.ma_buong}
                                            helperText={errors.ma_buong}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Autocomplete
                                    options={giuongList}
                                    loading={loadingGiuong}
                                    value={selectedGiuong}
                                    getOptionLabel={(o) => o.ten_giuong}
                                    disabled={!maBuong}
                                    onChange={(_, v) =>
                                        setMaGiuong(v ? v.ma_giuong : "")
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Số giường"
                                            fullWidth
                                            error={!!errors.ma_giuong}
                                            helperText={errors.ma_giuong}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Lý do nhập viện"
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    defaultValue=""
                                    inputRef={lyDoRef}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} sx={{ textTransform: "none" }}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                >
                    {saving ? "Đang lưu..." : "Lập bệnh án"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
