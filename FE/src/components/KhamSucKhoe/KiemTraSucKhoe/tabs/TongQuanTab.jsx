import { forwardRef, memo, useCallback, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Stack,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import NormalToggleField from "@/components/common/NormalToggleField";
import RangeField from "../common/fields/RangeField.jsx";
import useTongQuanTab from "@/hooks/useTongQuanTab";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";
import { PHAN_LOAI_OPTIONS } from "@/constants/khamSucKhoeConstants.js";

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

const MAT_KHONG_KINH_FIELDS = [
    { name: "mat_khong_kinh_trai", label: "Thị lực không kính (Trái)" },
    { name: "mat_khong_kinh_phai", label: "Thị lực không kính (Phải)" },
];

const MAT_CO_KINH_FIELDS = [
    { name: "mat_co_kinh_trai", label: "Thị lực có kính (Trái)" },
    { name: "mat_co_kinh_phai", label: "Thị lực có kính (Phải)" },
];

const getBmiStatus = (bmiStr) => {
    if (!bmiStr) return { text: "Chưa tính", color: "default" };
    const bmi = parseFloat(bmiStr);
    if (isNaN(bmi)) return { text: "Không hợp lệ", color: "default" };
    if (bmi < 18.5) return { text: "Gầy", color: "info" };
    if (bmi < 25) return { text: "Bình thường", color: "success" };
    if (bmi < 30) return { text: "Tiền béo phì", color: "warning" };
    return { text: "Béo phì", color: "error" };
};

const RangeFieldSM = memo(({ name, label, dataRef, readOnly, unit, step, min, xs, sm, md, onChangeExtra }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setVal(v);
        dataRef.current[name] = v;
        onChangeExtra?.(name, v);
    }, [name, dataRef, onChangeExtra]);

    return (
        <RangeField
            name={name}
            label={label}
            value={val}
            unit={unit}
            onChange={handleChange}
            readOnly={readOnly}
            step={step}
            min={min}
            xs={xs}
            sm={sm}
            md={md}
        />
    );
});

const NormalToggleFieldSM = memo(({ name, label, dataRef, readOnly, multiline, minRows, grid }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setVal(v);
        dataRef.current[e.target.name] = v;
    }, [dataRef]);

    return (
        <Grid size={grid}>
            <NormalToggleField
                label={label}
                name={name}
                value={val}
                onChange={handleChange}
                readOnly={readOnly}
                size="small"
                normalText="Không"
                multiline={multiline}
                minRows={minRows}
            />
        </Grid>
    );
});

const MatNumberFieldSM = memo(({ name, label, dataRef, readOnly }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setVal(v);
        dataRef.current[name] = v;
    }, [name, dataRef]);

    return (
        <Grid size={{ xs: 6, sm: 4, md: true }}>
            <TextField
                name={name}
                label={label}
                type="number"
                value={val}
                onChange={handleChange}
                disabled={readOnly}
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 1, max: 10, step: 1 } }}
            />
        </Grid>
    );
});

const SelectFieldSM = memo(({ name, label, dataRef, readOnly, options }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? options[0]);

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setVal(v);
        dataRef.current[name] = v;
    }, [name, dataRef]);

    return (
        <Grid size={{ xs: 6, sm: 4, md: true }}>
            <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                    name={name}
                    value={val}
                    onChange={handleChange}
                    label={label}
                    disabled={readOnly}
                >
                    {options.map((loai) => (
                        <MenuItem key={loai} value={loai}>
                            {loai}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
});

const BmiDisplaySM = memo(({ dataRef, tick }) => {
    const h = parseFloat(dataRef.current.chieu_cao);
    const w = parseFloat(dataRef.current.can_nang);
    let bmi = "";
    if (h > 0 && w > 0) {
        bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
    }
    const info = getBmiStatus(bmi);
    return (
        <Grid size={12}>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="body2" fontWeight="600">
                    BMI: {bmi || "—"}
                </Typography>
                {bmi && (
                    <Chip
                        label={info.text}
                        color={info.color}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                    />
                )}
            </Box>
        </Grid>
    );
});

const MatKhamSection = memo(
    ({ dataRef, readOnly, showCoKinh, onToggleCoKinh }) => (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                border: "1px solid",
                borderColor: "divider",
                mb: 3,
                bgcolor: "background.paper",
            }}
        >
            <CardContent>
                <SectionTitle>Khám mắt</SectionTitle>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    {MAT_KHONG_KINH_FIELDS.map((f) => (
                        <MatNumberFieldSM
                            key={f.name}
                            name={f.name}
                            label={f.label}
                            dataRef={dataRef}
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
                            onClick={onToggleCoKinh}
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
                        MAT_CO_KINH_FIELDS.map((f) => (
                            <MatNumberFieldSM
                                key={f.name}
                                name={f.name}
                                label={f.label}
                                dataRef={dataRef}
                                readOnly={readOnly}
                            />
                        ))}
                    <SelectFieldSM
                        name="mat_loai"
                        label="Phân loại mắt"
                        dataRef={dataRef}
                        readOnly={readOnly}
                        options={PHAN_LOAI_OPTIONS}
                    />
                </Grid>
            </CardContent>
        </Card>
    ),
);

const TongQuanTab = memo(
    forwardRef(function TongQuanTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const { dataRef, showCoKinh, toggleCoKinh } = useTongQuanTab(
            initialData,
            ref,
        );
        const [bmiTick, setBmiTick] = useState(0);

        const onBmiChange = useCallback(() => {
            const h = parseFloat(dataRef.current.chieu_cao);
            const w = parseFloat(dataRef.current.can_nang);
            if (h > 0 && w > 0) {
                dataRef.current.bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
            } else {
                dataRef.current.bmi = "";
            }
            setBmiTick((t) => t + 1);
        }, [dataRef]);

        return (
            <Stack spacing={2}>
                <Card sx={cardStyle}>
                    <CardContent>
                        <SectionTitle>Tiền sử</SectionTitle>
                        <Grid container spacing={2}>
                            {TIEN_SU_FIELDS.map((f) => (
                                <NormalToggleFieldSM
                                    key={f.name}
                                    name={f.name}
                                    label={f.label}
                                    dataRef={dataRef}
                                    readOnly={readOnly}
                                    multiline={f.multiline}
                                    minRows={f.minRows}
                                    grid={f.grid}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={cardStyle}>
                    <CardContent>
                        <SectionTitle>Thể lực</SectionTitle>
                        <Grid
                            container
                            spacing={2}
                            sx={{ alignItems: "center" }}
                        >
                            {THE_LUC_FIELDS.map((f) => (
                                <RangeFieldSM
                                    key={f.name}
                                    name={f.name}
                                    label={f.label}
                                    dataRef={dataRef}
                                    readOnly={readOnly}
                                    unit={f.unit}
                                    step={f.step}
                                    min={f.min}
                                    onChangeExtra={
                                        f.name === "chieu_cao" || f.name === "can_nang"
                                            ? onBmiChange
                                            : undefined
                                    }
                                />
                            ))}
                            <BmiDisplaySM dataRef={dataRef} tick={bmiTick} />
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={cardStyle}>
                    <CardContent>
                        <SectionTitle>Chỉ số sinh tồn</SectionTitle>
                        <Grid
                            container
                            spacing={2}
                            sx={{ alignItems: "center" }}
                        >
                            {VITAL_SIGNS_FIELDS.map((f) => (
                                <RangeFieldSM
                                    key={f.name}
                                    name={f.name}
                                    label={f.label}
                                    dataRef={dataRef}
                                    readOnly={readOnly}
                                    unit={f.unit}
                                    step={f.step}
                                    min={f.min}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                <MatKhamSection
                    dataRef={dataRef}
                    readOnly={readOnly}
                    showCoKinh={showCoKinh}
                    onToggleCoKinh={toggleCoKinh}
                />
            </Stack>
        );
    }),
);

export default TongQuanTab;
