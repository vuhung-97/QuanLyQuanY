import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    InputAdornment,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { CheckCircleOutlined, Undo } from "@mui/icons-material";

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

const fields = [
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
    { name: "khac", label: "Ghi chú tiền sử khác", grid: { xs: 12, sm: 6 } },
];

const fieldsGiaDinh = [
    { name: "gia_dinh", label: "Gia đình (Bệnh di truyền, bệnh tim mạch, tâm thần...)", multiline: true, minRows: 3, grid: 12 },
];

const TienSuTab = React.memo(({ ts, onTsChange, cardStyle }) => {
    const [normalFields, setNormalFields] = useState(new Set());

    const toggleNormal = (name) => {
        const isNormal = normalFields.has(name);
        if (isNormal) {
            onTsChange({ target: { name, value: "" } });
            setNormalFields((prev) => {
                const next = new Set(prev);
                next.delete(name);
                return next;
            });
        } else {
            onTsChange({ target: { name, value: "Không" } });
            setNormalFields((prev) => {
                const next = new Set(prev);
                next.add(name);
                return next;
            });
        }
    };

    const renderField = (f) => {
        const isNormal = normalFields.has(f.name);
        return (
            <Grid size={f.grid} key={f.name}>
                <TextField
                    name={f.name}
                    label={f.label}
                    value={ts[f.name]}
                    onChange={onTsChange}
                    disabled={isNormal}
                    multiline={f.multiline}
                    minRows={f.minRows}
                    fullWidth
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => toggleNormal(f.name)}
                                        color={isNormal ? "success" : "default"}
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
    };

    return (
        <>
            <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                    <SectionTitle>Tiền sử bản thân</SectionTitle>
                    <Grid container spacing={2}>
                        {fields.map(renderField)}
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                    <SectionTitle>Tiền sử gia đình</SectionTitle>
                    <Grid container spacing={2}>
                        {fieldsGiaDinh.map(renderField)}
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
});

export default TienSuTab;
