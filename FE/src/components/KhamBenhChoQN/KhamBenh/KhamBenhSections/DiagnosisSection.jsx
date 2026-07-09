import { memo } from "react";
import {
    Autocomplete,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

export default memo(function DiagnosisSection({
    chanDoan,
    onChanDoanChange,
    phuongPhap,
    onPhuongPhapChange,
    maNhomBenh,
    nhomBenhList,
    onMaNhomBenhChange,
    readOnly,
}) {
    const selectedNhomBenh =
        nhomBenhList?.find((n) => n.ma_nhom === maNhomBenh) || null;

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
                <Autocomplete
                    options={nhomBenhList || []}
                    value={selectedNhomBenh}
                    getOptionLabel={(o) => o.ten_nhom}
                    onChange={(_, v) => onMaNhomBenhChange(v ? v.ma_nhom : "")}
                    disabled={readOnly}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Nhóm bệnh"
                            fullWidth
                            size="medium"
                        />
                    )}
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
