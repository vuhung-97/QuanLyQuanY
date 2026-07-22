import { forwardRef, memo, useCallback, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    TextField,
    Typography,
    Stack,
} from "@mui/material";
import useTongQuanTab from "@/hooks/useTongQuanTab";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";
import PhanLoaiSelect from "../common/PhanLoaiSelect.jsx";
import RangeFieldSM from "../common/RangeFieldSM.jsx";
import NormalToggleFieldSM from "../common/NormalToggleFieldSM.jsx";

const TIEN_SU_FIELDS = [
    {
        name: "ban_than",
        label: "Bản thân (bệnh tật, chấn thương, phẫu thuật...)",
        multiline: true,
        minRows: 3,
        grid: { xs: 12, sm: 6 },
    },
    {
        name: "di_ung",
        label: "Dị ứng đặc thù (thuốc, hóa chất, thức ăn...)",
        grid: { xs: 12, sm: 6 },
        multiline: true,
        minRows: 3,
        normalText: "Không",
    },
    {
        name: "gia_dinh",
        label: "Gia đình (Bệnh di truyền, bệnh tim mạch, tâm thần...)",
        multiline: true,
        minRows: 3,
        grid: { xs: 12, sm: 6 },
        normalText: "Không",
    },
    {
        name: "khac",
        label: "Khác",
        grid: { xs: 12, sm: 6 },
        multiline: true,
        minRows: 3,
        normalText: "Không",
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

const getBmiStatus = (bmiStr) => {
    if (!bmiStr) return { text: "Chưa tính", color: "default" };
    const bmi = parseFloat(bmiStr);
    if (isNaN(bmi)) return { text: "Không hợp lệ", color: "default" };
    if (bmi < 18.5) return { text: "Gầy", color: "info" };
    if (bmi < 25) return { text: "Bình thường", color: "success" };
    if (bmi < 30) return { text: "Tiền béo phì", color: "warning" };
    return { text: "Béo phì", color: "error" };
};

const MatNumberFieldSM = memo(({ name, label, dataRef, readOnly }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

    const handleChange = useCallback(
        (e) => {
            const v = e.target.value;
            setVal(v);
            dataRef.current[name] = v;
        },
        [name, dataRef],
    );

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

const BmiDisplaySM = memo(({ dataRef, tick }) => {
    const h = parseFloat(dataRef.current.chieu_cao);
    const w = parseFloat(dataRef.current.can_nang);
    let bmi = "";
    if (h > 0 && w > 0) {
        bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
    }
    const info = getBmiStatus(bmi);
    return (
        <>
            <Typography
                variant="body2"
                fontWeight="600"
                sx={{ whiteSpace: "nowrap" }}
            >
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
        </>
    );
});

const MatKhamSection = memo(({ dataRef, readOnly }) => (
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
                <NormalToggleFieldSM
                    name="mat_benh"
                    label="Bệnh về mắt"
                    dataRef={dataRef}
                    readOnly={readOnly}
                    multiline
                    minRows={3}
                    maxRows={3}
                    grid={{ xs: 12, sm: 12 }}
                />
                {MAT_KHONG_KINH_FIELDS.map((f) => (
                    <MatNumberFieldSM
                        key={f.name}
                        name={f.name}
                        label={f.label}
                        dataRef={dataRef}
                        readOnly={readOnly}
                    />
                ))}
                <PhanLoaiSelect
                    name="mat_loai"
                    label="Phân loại mắt"
                    dataRef={dataRef}
                    readOnly={readOnly}
                />
            </Grid>
        </CardContent>
    </Card>
));

const TongQuanTab = memo(
    forwardRef(function TongQuanTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const { dataRef } = useTongQuanTab(initialData, ref);
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
                                    normalText={f.normalText}
                                />
                            ))}
                            <PhanLoaiSelect
                                name="tien_su_loai"
                                label="Phân loại tiền sử"
                                dataRef={dataRef}
                                readOnly={readOnly}
                            />
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
                                    xs={12}
                                    sm={4}
                                    md={2}
                                    onChangeExtra={
                                        f.name === "chieu_cao" ||
                                        f.name === "can_nang"
                                            ? onBmiChange
                                            : undefined
                                    }
                                />
                            ))}
                            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        height: "100%",
                                    }}
                                >
                                    <BmiDisplaySM
                                        dataRef={dataRef}
                                        tick={bmiTick}
                                    />
                                </Box>
                            </Grid>
                            <PhanLoaiSelect
                                name="the_luc_loai"
                                label="Phân loại thể lực"
                                dataRef={dataRef}
                                readOnly={readOnly}
                                gridProps={{ xs: 12, sm: 4, md: 2 }}
                            />
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
                                    xs={12}
                                    sm={4}
                                    md={3}
                                />
                            ))}
                            <PhanLoaiSelect
                                name="sinh_ton_loai"
                                label="Phân loại chỉ số sinh tồn"
                                dataRef={dataRef}
                                readOnly={readOnly}
                                gridProps={{ xs: 12, sm: 4, md: 3 }}
                            />
                        </Grid>
                    </CardContent>
                </Card>

                <MatKhamSection dataRef={dataRef} readOnly={readOnly} />
            </Stack>
        );
    }),
);

export default TongQuanTab;
