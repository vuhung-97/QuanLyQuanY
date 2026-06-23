import { forwardRef, memo, useCallback, useImperativeHandle, useState } from "react";
import {
    Card, CardContent, Grid, InputAdornment,
    MenuItem, TextField, Tooltip, Typography,
} from "@mui/material";
import { fieldRanges, isOutOfRange } from "./fieldRanges";

function SectionTitle({ children }) {
    return (
        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            {children}
        </Typography>
    );
}

const xetNghiemMauFields = [
    { name: "hong_cau",     label: "Hồng cầu",       unit: "T/L" },
    { name: "bach_cau",     label: "Bạch cầu",       unit: "G/L" },
    { name: "tieu_cau",     label: "Tiểu cầu",        unit: "G/L" },
    { name: "glucose_mau",  label: "Glucose",         unit: "mmol/l" },
    { name: "ure",          label: "Ure",             unit: "mmol/l" },
    { name: "creatinin",    label: "Creatinin",       unit: "umol/l" },
    { name: "ast",          label: "AST",             unit: "U/L" },
    { name: "alt",          label: "ALT",             unit: "U/L" },
];

const xetNghiemNuocTieuFields = [
    { name: "nuoc_tieu_glucose", label: "Glucose nước tiểu", type: "select", options: ["Âm tính", "Dương tính"] },
    { name: "nuoc_tieu_protein", label: "Protein nước tiểu", type: "select", options: ["Âm tính", "Dương tính"] },
    { name: "nuoc_tieu_te_bao",  label: "Tế bào nước tiểu" },
];

const XetNghiemTab = memo(forwardRef(function XetNghiemTab({ initialData, cardStyle, readOnly = false }, ref) {
    const [xn, setXn] = useState({ ...initialData });

    useImperativeHandle(ref, () => ({
        getData: () => ({ ...xn }),
    }), [xn]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setXn((prev) => ({ ...prev, [name]: value }));
    }, []);

    return (
        <>
            <Card sx={cardStyle}>
                <CardContent>
                    <SectionTitle>Xét nghiệm máu</SectionTitle>
                    <Grid container spacing={2}>
                        {xetNghiemMauFields.map((f) => {
                            const outOfRange = isOutOfRange(f.name, xn[f.name]);
                            return (
                                <Grid size={{ xs: 12, sm: 3 }} key={f.name}>
                                    <Tooltip title={fieldRanges[f.name]?.tooltip || ""} arrow placement="right">
                                        <TextField
                                            name={f.name}
                                            label={f.label}
                                            type="number"
                                            value={xn[f.name]}
                                            onChange={handleChange}
                                            fullWidth
                                            size="small"
                                            error={outOfRange}
                                            slotProps={{
                                                htmlInput: { step: "1", min: "1" },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {f.unit}
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            disabled={readOnly}
                                        />
                                    </Tooltip>
                                </Grid>
                            );
                        })}
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={cardStyle}>
                <CardContent>
                    <SectionTitle>Xét nghiệm nước tiểu</SectionTitle>
                    <Grid container spacing={2}>
                        {xetNghiemNuocTieuFields.map((f) => {
                            const outOfRange = isOutOfRange(f.name, xn[f.name]);
                            return (
                                <Grid size={{ xs: 12, sm: 4 }} key={f.name}>
                                    <Tooltip title={fieldRanges[f.name]?.tooltip || ""} arrow placement="right">
                                        {f.type === "select" ? (
                                            <TextField
                                                select
                                                name={f.name}
                                                label={f.label}
                                                value={xn[f.name]}
                                                onChange={handleChange}
                                                fullWidth
                                                size="small"
                                                error={outOfRange}
                                                disabled={readOnly}
                                            >
                                                <MenuItem value="">-- Chọn --</MenuItem>
                                                {f.options.map((opt) => (
                                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                ))}
                                            </TextField>
                                        ) : (
                                            <TextField
                                                name={f.name}
                                                label={f.label}
                                                type="number"
                                                value={xn[f.name]}
                                                onChange={handleChange}
                                                fullWidth
                                                size="small"
                                                error={outOfRange}
                                                slotProps={{
                                                    htmlInput: { step: "1", min: "1" },
                                                }}
                                                disabled={readOnly}
                                            />
                                        )}
                                    </Tooltip>
                                </Grid>
                            );
                        })}
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}));

export default XetNghiemTab;
