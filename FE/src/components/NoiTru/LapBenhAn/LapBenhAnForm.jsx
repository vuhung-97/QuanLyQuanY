import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import NumberField from "@/components/common/NumberField.jsx";
import useLapBenhAnForm from "../../../hooks/useLapBenhAnForm";
import PatientInfoCard from "./PatientInfoCard";
import ChiTietBenhAnFields from "./ChiTietBenhAnFields";
import SectionTitle from "@/components/NoiTru/common/SectionTitle.jsx";

const VITAL_SIGNS = [
    { key: "nhiet_do", label: "Nhiệt độ (°C)" },
    { key: "ha_tam_thu", label: "HA tối đa" },
    { key: "ha_tam_truong", label: "HA tối thiểu" },
    { key: "nhip_tim", label: "Nhịp tim (lần/ph)" },
];

export default function LapBenhAnForm({
    open,
    exam,
    saving,
    onSave,
    onClose,
    benhAn,
}) {
    const {
        buongList,
        giuongList,
        nhomBenhList,
        loadingBuong,
        loadingGiuong,
        maBuong,
        ngayNhapVien,
        selectedBuong,
        selectedGiuong,
        selectedNhomBenh,
        setMaBuong,
        setMaGiuong,
        setMaNhomBenh,
        errors,
        refMap,
        lyDoRef,
        chiTietRef,
        handleSave,
        defaultValues,
        chiTietInitialValues,
        isEdit,
    } = useLapBenhAnForm({ open, onSave, benhAn, exam });

    const infoSource = benhAn || exam;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{ "& .MuiDialog-paper": { height: "80vh" } }}
        >
            <DialogTitleWrapper>
                {isEdit ? "Sửa bệnh án nội trú" : "Lập bệnh án nội trú"}
            </DialogTitleWrapper>
            <DialogContent dividers>
                {infoSource && (
                    <Stack spacing={3}>
                        <PatientInfoCard
                            exam={infoSource}
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
                                            <NumberField
                                                label={f.label}
                                                fullWidth
                                                size="medium"
                                                defaultValue={
                                                    isEdit
                                                        ? defaultValues[
                                                              f.key
                                                          ] || ""
                                                        : ""
                                                }
                                                inputRef={refMap[f.key]}
                                                error={!!errors[f.key]}
                                                helperText={errors[f.key]}
                                                min={0}
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
                                    defaultValue={
                                        isEdit
                                            ? defaultValues.ly_do_nhap_vien ||
                                              ""
                                            : ""
                                    }
                                    inputRef={lyDoRef}
                                />
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <SectionTitle>Phân loại bệnh</SectionTitle>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Autocomplete
                                            options={nhomBenhList}
                                            value={selectedNhomBenh}
                                            getOptionLabel={(o) => o.ten_nhom}
                                            onChange={(_, v) =>
                                                setMaNhomBenh(
                                                    v ? v.ma_nhom : "",
                                                )
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Nhóm bệnh"
                                                    fullWidth
                                                    size="medium"
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <SectionTitle>Chi tiết bệnh án</SectionTitle>
                                <ChiTietBenhAnFields
                                    ref={chiTietRef}
                                    initialValues={chiTietInitialValues}
                                />
                            </CardContent>
                        </Card>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ textTransform: "none" }}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                >
                    {saving
                        ? isEdit
                            ? "Đang cập nhật..."
                            : "Đang lưu..."
                        : isEdit
                          ? "Cập nhật"
                          : "Lập bệnh án"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
