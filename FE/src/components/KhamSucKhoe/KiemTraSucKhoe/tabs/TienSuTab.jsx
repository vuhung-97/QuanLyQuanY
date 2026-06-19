import { forwardRef, memo, useCallback, useImperativeHandle, useState } from "react";
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

const TienSuTab = memo(forwardRef(function TienSuTab({ initialData, cardStyle, readOnly = false }, ref) {
    const [banThan, setBanThan] = useState(initialData?.ban_than ?? "");
    const [diUng, setDiUng] = useState(initialData?.di_ung ?? "");
    const [khac, setKhac] = useState(initialData?.khac ?? "");
    const [giaDinh, setGiaDinh] = useState(initialData?.gia_dinh ?? "");

    useImperativeHandle(ref, () => ({
        getData: () => ({ ban_than: banThan, di_ung: diUng, khac: khac, gia_dinh: giaDinh }),
    }), [banThan, diUng, khac, giaDinh]);

    const getValue = useCallback((name) => {
        switch (name) {
            case "ban_than": return banThan;
            case "di_ung": return diUng;
            case "khac": return khac;
            case "gia_dinh": return giaDinh;
            default: return "";
        }
    }, [banThan, diUng, khac, giaDinh]);

    const getSetter = useCallback((name) => {
        switch (name) {
            case "ban_than": return setBanThan;
            case "di_ung": return setDiUng;
            case "khac": return setKhac;
            case "gia_dinh": return setGiaDinh;
            default: return () => {};
        }
    }, []);

    const renderField = (f) => {
        const val = getValue(f.name);
        const setter = getSetter(f.name);
        const isNormal = val === "Không";
        const handleToggle = () => {
            if (readOnly) return;
            setter(isNormal ? "" : "Không");
        };
        return (
            <Grid size={f.grid} key={f.name}>
                <TextField
                    label={f.label}
                    value={val}
                    onChange={(e) => setter(e.target.value)}
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
}));

export default TienSuTab;
