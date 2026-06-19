import { forwardRef, memo, useCallback, useImperativeHandle, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    CheckCircleOutlined,
    ExpandLess,
    ExpandMore,
    Undo,
} from "@mui/icons-material";
import { fieldRanges, isOutOfRange } from "./fieldRanges";

const specialities = [
    { id: "tim_mach", label: "Tim mạch" },
    { id: "ho_hap", label: "Hô hấp" },
    { id: "tieu_hoa", label: "Tiêu hóa" },
    {
        id: "than_tiet_nieu_sinh_duc_nam",
        label: "Thận, tiết niệu - sinh dục nam",
    },
    { id: "tam_than_than_kinh", label: "Tâm thần - thần kinh" },
    { id: "co_xuong_khop", label: "Cơ, xương khớp" },
    {
        id: "noi_tiet_chuyen_hoa_mien_dich",
        label: "Nội tiết, chuyển hóa, miễn dịch",
    },
    { id: "benh_mau", label: "Bệnh máu" },
    { id: "ngoai_khoa", label: "Ngoại khoa" },
    { id: "da_lieu", label: "Da liễu" },
    { id: "phu_san", label: "Phụ sản" },
    { id: "tai_mui_hong", label: "Tai mũi họng" },
    { id: "rang_ham_mat", label: "Răng hàm mặt" },
];

const PHAN_LOAI_OPTIONS = ["Loại 1", "Loại 2", "Loại 3", "Loại 4", "Loại 5"];

const theLucFields = [
    {
        name: "chieu_cao",
        label: "Chiều cao",
        step: "0.1",
        min: "0.1",
        unit: "cm",
    },
    {
        name: "can_nang",
        label: "Cân nặng",
        step: "0.1",
        min: "0.1",
        unit: "kg",
    },
    {
        name: "vong_nguc",
        label: "Vòng ngực",
        step: "0.1",
        min: "0.1",
        unit: "cm",
    },
    {
        name: "vong_bung",
        label: "Vòng bụng",
        step: "0.1",
        min: "0.1",
        unit: "cm",
    },
    { name: "mach", label: "Mạch", step: "1", min: "1", unit: "lần/phút" },
    {
        name: "huyet_ap_tam_thu",
        label: "HA Tâm thu",
        step: "1",
        min: "1",
        unit: "mmHg",
    },
    {
        name: "huyet_ap_tam_truong",
        label: "HA Tâm trương",
        step: "1",
        min: "1",
        unit: "mmHg",
    },
];

const matKhongKinhFields = [
    { name: "mat_khong_kinh_trai", label: "Thị lực không kính (Trái)" },
    { name: "mat_khong_kinh_phai", label: "Thị lực không kính (Phải)" },
];

const matCoKinhFields = [
    { name: "mat_co_kinh_trai", label: "Thị lực có kính (Trái)" },
    { name: "mat_co_kinh_phai", label: "Thị lực có kính (Phải)" },
];

function SectionTitle({ children }) {
    return (
        <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="#0B3B60"
            sx={{ mb: 2 }}
        >
            {children}
        </Typography>
    );
}

const TheLucField = memo(({ field, value, onChange, readOnly }) => {
    const outOfRange = isOutOfRange(field.name, value);
    return (
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Tooltip title={fieldRanges[field.name]?.tooltip || ""} arrow placement="right">
                <TextField
                    name={field.name}
                    label={field.label}
                    type="number"
                    value={value}
                    onChange={onChange}
                    disabled={readOnly}
                    fullWidth
                    size="small"
                    error={outOfRange}
                    slotProps={{
                        htmlInput: { step: field.step, min: field.min },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    {field.unit}
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Tooltip>
        </Grid>
    );
});

const ChuyenKhoaRow = memo(
    ({ sp, noteValue, loaiValue, onChange, readOnly }) => {
        const isNormal = noteValue === "Bình thường";
        const handleToggleNormal = () => {
            if (readOnly) return;
            onChange({
                target: { name: `${sp.id}_note`, value: isNormal ? "" : "Bình thường" },
            });
        };
        return (
            <Grid size={12}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography
                            variant="body2"
                            fontWeight="600"
                            color="#0B3B60"
                        >
                            {sp.label}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name={`${sp.id}_note`}
                            label="Kết quả khám"
                            value={noteValue}
                            onChange={onChange}
                            disabled={readOnly || isNormal}
                            fullWidth
                            size="small"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={handleToggleNormal}
                                                color={
                                                    isNormal ? "success" : "default"
                                                }
                                                disabled={readOnly}
                                            >
                                                {isNormal ? (
                                                    <Undo fontSize="small" />
                                                ) : (
                                                    <CheckCircleOutlined fontSize="small" />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Phân loại</InputLabel>
                            <Select
                                name={`${sp.id}_loai`}
                                value={loaiValue}
                                onChange={onChange}
                                label="Phân loại"
                                disabled={readOnly}
                            >
                                {PHAN_LOAI_OPTIONS.map((loai) => (
                                    <MenuItem key={loai} value={loai}>
                                        {loai}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <Divider sx={{ opacity: 0.5 }} />
                    </Grid>
                </Grid>
            </Grid>
        );
    },
);

const MatNumberField = memo(({ name, label, value, onChange, readOnly }) => (
    <Grid size={{ xs: 6, sm: 4, md: true }}>
        <TextField
            name={name}
            label={label}
            type="number"
            value={value}
            onChange={onChange}
            disabled={readOnly}
            fullWidth
            size="small"
            slotProps={{ htmlInput: { min: 1, max: 10, step: 1 } }}
        />
    </Grid>
));

const getBmiStatus = (bmiStr) => {
    if (!bmiStr) return { text: "Chưa tính", color: "default" };
    const bmi = parseFloat(bmiStr);
    if (isNaN(bmi)) return { text: "Không hợp lệ", color: "default" };
    if (bmi < 18.5) return { text: "Gầy", color: "info" };
    if (bmi < 25) return { text: "Bình thường", color: "success" };
    if (bmi < 30) return { text: "Tiền béo phì", color: "warning" };
    return { text: "Béo phì", color: "error" };
};

const LamSangTab = memo(forwardRef(function LamSangTab({ initialData, cardStyle, readOnly = false }, ref) {
    const [ls, setLs] = useState({ ...initialData });

    useImperativeHandle(ref, () => ({
        getData: () => ({ ...ls }),
    }), [ls]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setLs((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "chieu_cao" || name === "can_nang") {
                const h = parseFloat(name === "chieu_cao" ? value : prev.chieu_cao);
                const w = parseFloat(name === "can_nang" ? value : prev.can_nang);
                if (h > 0 && w > 0) {
                    updated.bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
                } else {
                    updated.bmi = "";
                }
            }
            return updated;
        });
    }, []);

    const bmiInfo = getBmiStatus(ls.bmi);
    const [showCoKinh, setShowCoKinh] = useState(false);

    return (
        <>
            <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                    <SectionTitle>Thể lực & Chỉ số sinh tồn</SectionTitle>
                    <Grid container spacing={2} sx={{ alignItems: "center" }}>
                        {theLucFields.map((f) => (
                            <TheLucField
                                key={f.name}
                                field={f}
                                value={ls[f.name]}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        ))}
                        <Grid size={12}>
                            <Box
                                sx={{
                                    mt: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="body2" fontWeight="600">
                                    BMI: {ls.bmi || "—"}
                                </Typography>
                                {ls.bmi && (
                                    <Chip
                                        label={bmiInfo.text}
                                        color={bmiInfo.color}
                                        size="small"
                                        sx={{ fontWeight: "bold" }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                    <SectionTitle>Khám chuyên khoa</SectionTitle>
                    <Grid container spacing={2}>
                        {specialities.map((sp) => (
                            <ChuyenKhoaRow
                                key={sp.id}
                                sp={sp}
                                noteValue={ls[`${sp.id}_note`]}
                                loaiValue={ls[`${sp.id}_loai`]}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                    <SectionTitle>Khám mắt</SectionTitle>
                    <Grid container spacing={2} sx={{ alignItems: "center" }}>
                        {matKhongKinhFields.map((f) => (
                            <MatNumberField
                                key={f.name}
                                name={f.name}
                                label={f.label}
                                value={ls[f.name]}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        ))}
                        <Grid size={{ xs: 6, sm: 4, md: true }}>
                            <Button
                                size="small"
                                variant="text"
                                startIcon={
                                    showCoKinh ? <ExpandLess /> : <ExpandMore />
                                }
                                onClick={() => setShowCoKinh((p) => !p)}
                                sx={{
                                    textTransform: "none",
                                    color: "primary.main",
                                    fontWeight: 600,
                                }}
                            >
                                Khám có kính
                            </Button>
                        </Grid>
                        {showCoKinh &&
                            matCoKinhFields.map((f) => (
                                <MatNumberField
                                    key={f.name}
                                    name={f.name}
                                    label={f.label}
                                    value={ls[f.name]}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                />
                            ))}
                        <Grid size={{ xs: 6, sm: 4, md: true }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Phân loại mắt</InputLabel>
                                <Select
                                    name="mat_loai"
                                    value={ls.mat_loai}
                                    onChange={handleChange}
                                    label="Phân loại mắt"
                                    disabled={readOnly}
                                >
                                    {PHAN_LOAI_OPTIONS.map((loai) => (
                                        <MenuItem key={loai} value={loai}>
                                            {loai}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}));

export default LamSangTab;
