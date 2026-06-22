import {
    forwardRef,
    memo,
    useCallback,
    useImperativeHandle,
    useState,
} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
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

const TIEN_SU_FIELDS = [
    {
        name: "ban_than",
        label: "Bản thân (bệnh tật, chấn thương, phẫu thuật...)",
        multiline: true,
        minRows: 3,
        grid: 12,
    },
    {
        name: "di_ung",
        label: "Dị ứng đặc thù (thuốc, hóa chất, thức ăn...)",
        grid: { xs: 12, sm: 6 },
    },
    { name: "khac", label: "Khác", grid: { xs: 12, sm: 6 } },
    {
        name: "gia_dinh",
        label: "Gia đình (Bệnh di truyền, bệnh tim mạch, tâm thần...)",
        multiline: true,
        minRows: 3,
        grid: 12,
    },
];

const THE_LUC_FIELDS = [
    { name: "chieu_cao", label: "Chiều cao", step: "1", min: "1", unit: "cm" },
    { name: "can_nang", label: "Cân nặng", step: "1", min: "1", unit: "kg" },
    { name: "vong_nguc", label: "Vòng ngực", step: "1", min: "1", unit: "cm" },
    { name: "vong_bung", label: "Vòng bụng", step: "1", min: "1", unit: "cm" },
];

const VITAL_SIGNS_FIELDS = [
    { name: "mach", label: "Mạch", step: "1", min: "1", unit: "lần/phút" },
    { name: "huyet_ap_tam_thu", label: "HA Tâm thu", step: "1", min: "1", unit: "mmHg" },
    { name: "huyet_ap_tam_truong", label: "HA Tâm trương", step: "1", min: "1", unit: "mmHg" },
];

const MAT_KHONG_KINH_FIELDS = [
    { name: "mat_khong_kinh_trai", label: "Thị lực không kính (Trái)" },
    { name: "mat_khong_kinh_phai", label: "Thị lực không kính (Phải)" },
];

const MAT_CO_KINH_FIELDS = [
    { name: "mat_co_kinh_trai", label: "Thị lực có kính (Trái)" },
    { name: "mat_co_kinh_phai", label: "Thị lực có kính (Phải)" },
];

const PHAN_LOAI_OPTIONS = ["Loại 1", "Loại 2", "Loại 3", "Loại 4", "Loại 5"];

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

const getBmiStatus = (bmiStr) => {
    if (!bmiStr) return { text: "Chưa tính", color: "default" };
    const bmi = parseFloat(bmiStr);
    if (isNaN(bmi)) return { text: "Không hợp lệ", color: "default" };
    if (bmi < 18.5) return { text: "Gầy", color: "info" };
    if (bmi < 25) return { text: "Bình thường", color: "success" };
    if (bmi < 30) return { text: "Tiền béo phì", color: "warning" };
    return { text: "Béo phì", color: "error" };
};

const TheLucField = memo(({ field, value, onChange, readOnly }) => {
    const outOfRange = isOutOfRange(field.name, value);
    return (
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Tooltip
                title={fieldRanges[field.name]?.tooltip || ""}
                arrow
                placement="right"
            >
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

const TienSuField = memo(({ field, value, onChange, onToggle, readOnly }) => {
    const isNormal = value === "Không";
    return (
        <Grid size={field.grid}>
            <TextField
                label={field.label}
                value={value}
                onChange={onChange}
                disabled={readOnly || isNormal}
                name={field.name}
                multiline={field.multiline}
                minRows={field.minRows}
                fullWidth
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={readOnly ? undefined : () => onToggle(field.name)}
                                    color={isNormal ? "success" : "default"}
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
    );
});

const BmiDisplay = memo(({ bmi }) => {
    const info = getBmiStatus(bmi);
    return (
        <Grid size={12}>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="body2" fontWeight="600">
                    BMI: {bmi || "—"}
                </Typography>
                {bmi && (
                    <Chip label={info.text} color={info.color} size="small" sx={{ fontWeight: "bold" }} />
                )}
            </Box>
        </Grid>
    );
});

const MatKhamSection = memo(({ data, onChange, readOnly, showCoKinh, onToggleCoKinh }) => (
    <Card sx={{ borderRadius: 2, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid", borderColor: "divider", mb: 3, bgcolor: "background.paper" }}>
        <CardContent>
            <SectionTitle>Khám mắt</SectionTitle>
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
                {MAT_KHONG_KINH_FIELDS.map((f) => (
                    <MatNumberField
                        key={f.name}
                        name={f.name}
                        label={f.label}
                        value={data[f.name]}
                        onChange={onChange}
                        readOnly={readOnly}
                    />
                ))}
                <Grid size={{ xs: 6, sm: 4, md: true }}>
                    <Button
                        size="small"
                        variant="text"
                        startIcon={showCoKinh ? <ExpandLess /> : <ExpandMore />}
                        onClick={onToggleCoKinh}
                        sx={{ textTransform: "none", color: "primary.main", fontWeight: 600 }}
                    >
                        Khám có kính
                    </Button>
                </Grid>
                {showCoKinh &&
                    MAT_CO_KINH_FIELDS.map((f) => (
                        <MatNumberField
                            key={f.name}
                            name={f.name}
                            label={f.label}
                            value={data[f.name]}
                            onChange={onChange}
                            readOnly={readOnly}
                        />
                    ))}
                <Grid size={{ xs: 6, sm: 4, md: true }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Phân loại mắt</InputLabel>
                        <Select
                            name="mat_loai"
                            value={data.mat_loai ?? "Loại 1"}
                            onChange={onChange}
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
));

const TongQuanTab = memo(
    forwardRef(function TongQuanTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const [data, setData] = useState({ ...initialData });
        const [showCoKinh, setShowCoKinh] = useState(false);

        useImperativeHandle(
            ref,
            () => ({
                getData: () => ({ ...data }),
            }),
            [data],
        );

        const handleChange = useCallback((e) => {
            const { name, value } = e.target;
            setData((prev) => {
                const updated = { ...prev, [name]: value };
                if (name === "chieu_cao" || name === "can_nang") {
                    const h = parseFloat(
                        name === "chieu_cao" ? value : prev.chieu_cao,
                    );
                    const w = parseFloat(
                        name === "can_nang" ? value : prev.can_nang,
                    );
                    if (h > 0 && w > 0) {
                        updated.bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
                    } else {
                        updated.bmi = "";
                    }
                }
                return updated;
            });
        }, []);

        const handleToggle = useCallback((name) => {
            setData((prev) => ({
                ...prev,
                [name]: prev[name] === "Không" ? "" : "Không",
            }));
        }, []);

        return (
            <>
                <Card sx={cardStyle}>
                    <CardContent>
                        <SectionTitle>Tiền sử</SectionTitle>
                        <Grid container spacing={2}>
                            {TIEN_SU_FIELDS.map((f) => (
                                <TienSuField
                                    key={f.name}
                                    field={f}
                                    value={data[f.name]}
                                    onChange={handleChange}
                                    onToggle={handleToggle}
                                    readOnly={readOnly}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={cardStyle}>
                    <CardContent>
                        <SectionTitle>Thể lực</SectionTitle>
                        <Grid container spacing={2} sx={{ alignItems: "center" }}>
                            {THE_LUC_FIELDS.map((f) => (
                                <TheLucField
                                    key={f.name}
                                    field={f}
                                    value={data[f.name]}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                />
                            ))}
                            <BmiDisplay bmi={data.bmi} />
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={cardStyle}>
                    <CardContent>
                        <SectionTitle>Chỉ số sinh tồn</SectionTitle>
                        <Grid container spacing={2} sx={{ alignItems: "center" }}>
                            {VITAL_SIGNS_FIELDS.map((f) => (
                                <TheLucField
                                    key={f.name}
                                    field={f}
                                    value={data[f.name]}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                <MatKhamSection
                    data={data}
                    onChange={handleChange}
                    readOnly={readOnly}
                    showCoKinh={showCoKinh}
                    onToggleCoKinh={() => setShowCoKinh((p) => !p)}
                />
            </>
        );
    }),
);

export default TongQuanTab;
