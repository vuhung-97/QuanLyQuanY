import {
    Autocomplete,
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
import NormalToggleField from "@/components/common/NormalToggleField";
import useLapBenhAnForm from "../../../hooks/useLapBenhAnForm";
import PatientInfoCard from "./PatientInfoCard";

const VITAL_SIGNS = [
    { key: "nhiet_do", label: "Nhiệt độ (°C)" },
    { key: "ha_tam_thu", label: "HA tối đa" },
    { key: "ha_tam_truong", label: "HA tối thiểu" },
    { key: "nhip_tim", label: "Nhịp tim (lần/ph)" },
];

const CHI_TIET_FIELDS = [
    { label: "Bệnh sử", name: "benh_su", minRows: 3 },
    { label: "Tiền sử bản thân", name: "tien_su_ban_than", minRows: 3 },
    { label: "Tiền sử gia đình", name: "tien_su_gia_dinh", minRows: 3 },
    {
        label: "Tóm tắt bệnh án",
        name: "tom_tat_benh_an",
        minRows: 3,
        normalText: "Không có",
    },
    { label: "Chẩn đoán bệnh chính", name: "chan_doan_chinh", minRows: 2 },
    {
        label: "Chẩn đoán bệnh kèm theo",
        name: "chan_doan_kem_theo",
        minRows: 2,
        normalText: "Không có",
    },
    {
        label: "Chẩn đoán phân biệt",
        name: "chan_doan_phan_biet",
        minRows: 2,
        normalText: "Không có",
    },
];

function SectionTitle({ children }) {
    return (
        <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary"
            sx={{ mb: 2 }}
        >
            {children}
        </Typography>
    );
}

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
        chiTiet,
        handleChiTietChange,
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

                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <SectionTitle>Chỉ số sinh tồn</SectionTitle>
                                <Grid container spacing={2}>
                                    {VITAL_SIGNS.map((f) => (
                                        <Grid
                                            key={f.key}
                                            size={{ xs: 6, md: 3 }}
                                        >
                                            <TextField
                                                label={f.label}
                                                type="number"
                                                fullWidth
                                                size="medium"
                                                defaultValue=""
                                                inputRef={refMap[f.key]}
                                                slotProps={{
                                                    htmlInput: { min: 0 },
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <SectionTitle>Vị trí</SectionTitle>
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
                                                    label="Phòng"
                                                    fullWidth
                                                    size="medium"
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
                                                setMaGiuong(
                                                    v ? v.ma_giuong : "",
                                                )
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Số giường"
                                                    fullWidth
                                                    size="medium"
                                                    error={!!errors.ma_giuong}
                                                    helperText={
                                                        errors.ma_giuong
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <SectionTitle>Lý do vào viện</SectionTitle>
                                <TextField
                                    label="Lý do nhập viện"
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    size="medium"
                                    defaultValue=""
                                    inputRef={lyDoRef}
                                />
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <SectionTitle>Chi tiết bệnh án</SectionTitle>
                                <Stack spacing={2}>
                                    {CHI_TIET_FIELDS.map((field) => (
                                        <NormalToggleField
                                            key={field.name}
                                            label={field.label}
                                            name={field.name}
                                            value={chiTiet[field.name]}
                                            onChange={handleChiTietChange}
                                            normalText={field.normalText}
                                            multiline
                                            minRows={field.minRows}
                                            size="medium"
                                        />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
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
