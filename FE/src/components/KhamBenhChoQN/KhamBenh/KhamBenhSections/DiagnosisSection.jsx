import { memo } from "react";
import { Grid, Stack, TextField, Typography } from "@mui/material";

export default memo(function DiagnosisSection({
    chanDoan,
    onChanDoanChange,
    phuongPhap,
    onPhuongPhapChange,
    readOnly,
}) {
    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" sx={{ mb: 1.5, color: "text.primary" }}>
                Chẩn đoán & Phương hướng điều trị
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Kết quả chẩn đoán AI"
                    fullWidth
                    disabled
                    placeholder="Kết quả chẩn đoán AI (đang phát triển)"
                />
                <TextField
                    label="Chẩn đoán bệnh"
                    multiline
                    minRows={2}
                    fullWidth
                    value={chanDoan}
                    onChange={(e) => onChanDoanChange(e.target.value)}
                    disabled={readOnly}
                />
                <TextField
                    label="Phương pháp điều trị"
                    multiline
                    minRows={3}
                    fullWidth
                    value={phuongPhap}
                    onChange={(e) => onPhuongPhapChange(e.target.value)}
                    disabled={readOnly}
                />
            </Stack>
        </Grid>
    );
});
