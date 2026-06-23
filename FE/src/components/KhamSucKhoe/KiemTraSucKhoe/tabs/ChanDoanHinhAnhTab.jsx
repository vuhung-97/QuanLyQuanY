import { forwardRef, memo, useImperativeHandle, useState } from "react";
import {
    Card, CardContent, Grid, IconButton, InputAdornment,
    TextField, Typography,
} from "@mui/material";
import { CheckCircleOutlined, Undo } from "@mui/icons-material";

function SectionTitle({ children }) {
    return (
        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            {children}
        </Typography>
    );
}

const cdhaFields = [
    { name: "dien_tim", label: "Điện tim (ECG)" },
    { name: "x_quang",  label: "X-Quang tim phổi" },
    { name: "sieu_am",  label: "Siêu âm ổ bụng" },
    { name: "khac",     label: "Cận lâm sàng khác" },
];

const ChanDoanHinhAnhTab = memo(forwardRef(function ChanDoanHinhAnhTab({ initialData, cardStyle, readOnly = false }, ref) {
    const [cdha, setCdha] = useState({ ...initialData });

    useImperativeHandle(ref, () => ({
        getData: () => ({ ...cdha }),
    }), [cdha]);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <SectionTitle>Chẩn đoán hình ảnh & Khác</SectionTitle>
                <Grid container spacing={2}>
                    {cdhaFields.map((f) => {
                        const isNormal = cdha[f.name] === "Bình thường";
                        const handleToggle = () => {
                            if (readOnly) return;
                            const newVal = isNormal ? "" : "Bình thường";
                            setCdha((prev) => ({ ...prev, [f.name]: newVal }));
                        };
                        return (
                            <Grid size={{ xs: 12, sm: 6 }} key={f.name}>
                                <TextField
                                    label={f.label}
                                    value={cdha[f.name]}
                                    onChange={(e) => setCdha((prev) => ({ ...prev, [f.name]: e.target.value }))}
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
    );
}));

export default ChanDoanHinhAnhTab;
