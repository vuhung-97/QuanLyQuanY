import { memo, useCallback } from "react";
import {
    Autocomplete,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import FormTextField from "@/components/common/FormTextField.jsx";

export default memo(function DiagnosisSection({
    updateField,
    getFieldDefault,
    maNhomBenh,
    nhomBenhList,
    onMaNhomBenhChange,
    readOnly,
}) {
    const selectedNhomBenh =
        nhomBenhList?.find((n) => n.ma_nhom === maNhomBenh) || null;

    const handleNhomBenhChange = useCallback(
        (_, v) => {
            onMaNhomBenhChange(v ? v.ma_nhom : "");
        },
        [onMaNhomBenhChange],
    );

    const getNhomBenhLabel = useCallback((o) => o.ten_nhom, []);

    const renderNhomBenhInput = useCallback(
        (params) => (
            <TextField {...params} label="Nhóm bệnh" fullWidth size="medium" />
        ),
        [],
    );

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
                <FormTextField
                    name="chan_doan"
                    initialValue={getFieldDefault("chan_doan")}
                    onUpdateRef={updateField}
                    label="Chẩn đoán bệnh"
                    multiline
                    minRows={2}
                    fullWidth
                    disabled={readOnly}
                />
                <Autocomplete
                    options={nhomBenhList || []}
                    value={selectedNhomBenh}
                    getOptionLabel={getNhomBenhLabel}
                    onChange={handleNhomBenhChange}
                    disabled={readOnly}
                    renderInput={renderNhomBenhInput}
                />
                <FormTextField
                    name="phuong_phap_dieu_tri"
                    initialValue={getFieldDefault("phuong_phap_dieu_tri")}
                    onUpdateRef={updateField}
                    label="Phương pháp điều trị"
                    multiline
                    minRows={3}
                    fullWidth
                    disabled={readOnly}
                />
            </Stack>
        </Grid>
    );
});
