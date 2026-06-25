import { memo, useCallback, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

function InfoRow({ label, value }) {
    return (
        <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
                {value}
            </Typography>
        </Box>
    );
}

const PatientInfoCard = memo(function PatientInfoCard({ exam }) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#F8FAFC" }}>
            <CardContent>
                <Stack direction="row" spacing={2} sx={{ "& > *": { flex: 1, minWidth: 0 } }}>
                    <InfoRow label="QN:" value={`${exam.ho_ten || ""} - ${exam.ma_quan_nhan || ""}`} />
                    <InfoRow label="Đơn vị:" value={exam.ten_don_vi || "--"} />
                    <InfoRow label="Chẩn đoán:" value={exam.chan_doan || "--"} />
                </Stack>
            </CardContent>
        </Card>
    );
});

export default function LapBenhAnForm({ open, exam, saving, onSave, onClose }) {
    const [formState, setFormState] = useState({
        ngoai_kieu: "",
        doi_tuong: "",
        quan_ly_nguoi_benh: "",
        chi_tiet_benh_an: "",
        nhiet_do: "",
        ha_tam_thu: "",
        ha_tam_truong: "",
        nhip_tim: "",
        nhip_tho: "",
        so_giuong: "",
        buong: "",
        ly_do: "",
    });

    const updateField = useCallback((name, value) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSave = useCallback(() => {
        onSave(formState);
    }, [formState, onSave]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h2">Lập bệnh án nội trú</Typography>
            </DialogTitle>
            <DialogContent dividers>
                {exam && (
                    <Stack spacing={3}>
                        <PatientInfoCard exam={exam} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Ngoại kiều"
                                    fullWidth
                                    value={formState.ngoai_kieu}
                                    onChange={(e) => updateField("ngoai_kieu", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Đối tượng"
                                    fullWidth
                                    value={formState.doi_tuong}
                                    onChange={(e) => updateField("doi_tuong", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Quản lý người bệnh"
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    value={formState.quan_ly_nguoi_benh}
                                    onChange={(e) => updateField("quan_ly_nguoi_benh", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Chi tiết bệnh án"
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    value={formState.chi_tiet_benh_an}
                                    onChange={(e) => updateField("chi_tiet_benh_an", e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Box>
                            <Typography variant="h3" sx={{ mb: 1.5, color: "text.primary" }}>
                                Chỉ số sinh tồn
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <TextField
                                        label="Nhiệt độ (°C)"
                                        type="number"
                                        fullWidth
                                        value={formState.nhiet_do}
                                        onChange={(e) => updateField("nhiet_do", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 3, md: 1.5 }}>
                                    <TextField
                                        label="HA tối đa"
                                        type="number"
                                        fullWidth
                                        value={formState.ha_tam_thu}
                                        onChange={(e) => updateField("ha_tam_thu", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 3, md: 1.5 }}>
                                    <TextField
                                        label="HA tối thiểu"
                                        type="number"
                                        fullWidth
                                        value={formState.ha_tam_truong}
                                        onChange={(e) => updateField("ha_tam_truong", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <TextField
                                        label="Nhịp tim (lần/ph)"
                                        type="number"
                                        fullWidth
                                        value={formState.nhip_tim}
                                        onChange={(e) => updateField("nhip_tim", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <TextField
                                        label="Nhịp thở (lần/ph)"
                                        type="number"
                                        fullWidth
                                        value={formState.nhip_tho}
                                        onChange={(e) => updateField("nhip_tho", e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="Số giường"
                                    fullWidth
                                    value={formState.so_giuong}
                                    onChange={(e) => updateField("so_giuong", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="Buồng"
                                    fullWidth
                                    value={formState.buong}
                                    onChange={(e) => updateField("buong", e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Lý do nhập viện"
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    value={formState.ly_do}
                                    onChange={(e) => updateField("ly_do", e.target.value)}
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