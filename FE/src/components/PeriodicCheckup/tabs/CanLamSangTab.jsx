import React from "react";
import {
    Card, CardContent, Grid, IconButton, InputAdornment,
    MenuItem, TextField, Tooltip, Typography,
} from "@mui/material";
import { CheckCircleOutlined, Undo } from "@mui/icons-material";
import { fieldRanges, isOutOfRange } from "./fieldRanges";

function SectionTitle({ children }) {
    return (
        <Typography variant="subtitle1" fontWeight="bold" color="#0B3B60" sx={{ mb: 2 }}>
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

const cdhaFields = [
    { name: "dien_tim", label: "Điện tim (ECG)" },
    { name: "x_quang",  label: "X-Quang tim phổi" },
    { name: "sieu_am",  label: "Siêu âm ổ bụng" },
    { name: "khac",     label: "Cận lâm sàng khác" },
];

const CanLamSangTab = React.memo(({ cls, onClsChange, cardStyle, readOnly = false }) => {
    return (
        <>
            <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                    <SectionTitle>Xét nghiệm máu</SectionTitle>
                    <Grid container spacing={2}>
                        {xetNghiemMauFields.map((f) => {
                            const outOfRange = isOutOfRange(f.name, cls[f.name]);
                            return (
                                <Grid size={{ xs: 12, sm: 3 }} key={f.name}>
                                    <Tooltip title={fieldRanges[f.name]?.tooltip || ""} arrow placement="right">
                                        <TextField
                                            name={f.name}
                                            label={f.label}
                                            type="number"
                                            value={cls[f.name]}
                                            onChange={onClsChange}
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
                <CardContent sx={{ p: 3 }}>
                    <SectionTitle>Xét nghiệm nước tiểu</SectionTitle>
                    <Grid container spacing={2}>
                        {xetNghiemNuocTieuFields.map((f) => {
                            const outOfRange = isOutOfRange(f.name, cls[f.name]);
                            return (
                                <Grid size={{ xs: 12, sm: 4 }} key={f.name}>
                                    <Tooltip title={fieldRanges[f.name]?.tooltip || ""} arrow placement="right">
                                        {f.type === "select" ? (
                                            <TextField
                                                select
                                                name={f.name}
                                                label={f.label}
                                                value={cls[f.name]}
                                                onChange={onClsChange}
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
                                                value={cls[f.name]}
                                                onChange={onClsChange}
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

            <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                    <SectionTitle>Chẩn đoán hình ảnh & Khác</SectionTitle>
                    <Grid container spacing={2}>
                        {cdhaFields.map((f) => {
                            const isNormal = cls[f.name] === "Bình thường";
                            const handleToggle = () => {
                                if (readOnly) return;
                                onClsChange({ target: { name: f.name, value: isNormal ? "" : "Bình thường" } });
                            };
                            return (
                                <Grid size={{ xs: 12, sm: 6 }} key={f.name}>
                                    <TextField
                                        name={f.name}
                                        label={f.label}
                                        value={cls[f.name]}
                                        onChange={onClsChange}
                                        disabled={readOnly || isNormal}
                                        multiline
                                        minRows={2}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            size="small"
                                                            onClick={readOnly ? undefined : handleToggle}
                                                            color={isNormal ? "success" : "default"}
                                                            disabled={readOnly}
                                                        >
                                                            {isNormal ? <Undo fontSize="small" /> : <CheckCircleOutlined fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
});

export default CanLamSangTab;
