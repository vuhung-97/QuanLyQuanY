import React from "react";
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

const TienSuTab = React.memo(({ ts, onTsChange, cardStyle, readOnly = false }) => {
    const renderField = (f) => {
        const isNormal = ts[f.name] === "Không";
        const handleToggle = () => {
            onTsChange({ target: { name: f.name, value: isNormal ? "" : "Không" } });
        };
        return (
            <Grid size={f.grid} key={f.name}>
                <TextField
                    name={f.name}
                    label={f.label}
                    value={ts[f.name]}
                    onChange={onTsChange}
                    disabled={readOnly || isNormal}
                    multiline={f.multiline}
                    minRows={f.minRows}
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
