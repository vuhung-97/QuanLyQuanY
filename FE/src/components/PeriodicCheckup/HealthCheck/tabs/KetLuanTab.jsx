import React from "react";
import {
    Card,
    CardContent,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
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

const PHAN_LOAI_SUC_KHOE = [
    { value: "Loại 1", label: "Loại 1 (Rất khỏe)" },
    { value: "Loại 2", label: "Loại 2 (Khỏe)" },
    { value: "Loại 3", label: "Loại 3 (Trung bình)" },
    { value: "Loại 4", label: "Loại 4 (Yếu)" },
    { value: "Loại 5", label: "Loại 5 (Rất yếu)" },
];

const fields = [
    {
        name: "benh_tat_theo_doi",
        label: "Bệnh tật cần theo dõi dự phòng",
        multiline: true,
        minRows: 3,
    },
    {
        name: "chi_dan_khac",
        label: "Chỉ dẫn cần thiết khác",
        multiline: true,
        minRows: 3,
        helperText:
            "Chỉ dẫn chế độ ăn uống, sinh hoạt, tập luyện hoặc đề nghị chuyển viện điều trị.",
    },
];

const KetLuanTab = React.memo(({ kl, onKlChange, cardStyle, readOnly = false }) => {
    return (
        <Card sx={cardStyle}>
            <CardContent sx={{ p: 3 }}>
                <SectionTitle>Đánh giá & Phân loại sức khỏe chung</SectionTitle>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Phân loại sức khỏe chung</InputLabel>
                            <Select
                                name="phan_loai_suc_khoe"
                                value={kl.phan_loai_suc_khoe}
                                onChange={onKlChange}
                                label="Phân loại sức khỏe chung"
                                disabled={readOnly}
                            >
                                {PHAN_LOAI_SUC_KHOE.map((o) => (
                                    <MenuItem key={o.value} value={o.value}>
                                        {o.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <TextField
                            name="ly_do"
                            label="Lý do phân loại / Đánh giá chung"
                            value={kl.ly_do}
                            onChange={onKlChange}
                            multiline
                            minRows={4}
                            fullWidth
                            size="small"
                            disabled={readOnly}
                        />
                    </Grid>
                    {fields.map((f) => {
                        const isNormal = kl[f.name] === "Không";
                        const handleToggle = () => {
                            if (readOnly) return;
                            onKlChange({ target: { name: f.name, value: isNormal ? "" : "Không" } });
                        };
                        return (
                            <Grid size={12} key={f.name}>
                                <TextField
                                    name={f.name}
                                    label={f.label}
                                    value={kl[f.name]}
                                    onChange={onKlChange}
                                    disabled={readOnly || isNormal}
                                    multiline={f.multiline}
                                    minRows={f.minRows}
                                    fullWidth
                                    helperText={f.helperText}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={readOnly ? undefined : handleToggle}
                                                        color={
                                                            isNormal
                                                                ? "success"
                                                                : "default"
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
                        );
                    })}
                </Grid>
            </CardContent>
        </Card>
    );
});

export default KetLuanTab;
