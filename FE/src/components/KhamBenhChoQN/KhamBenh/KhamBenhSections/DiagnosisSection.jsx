import { memo, useCallback } from "react";
import {
    Autocomplete,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import FormTextField from "@/components/common/FormTextField.jsx";
import ChanDoanAutocomplete from "./ChanDoanAutocomplete.jsx";

export default memo(function DiagnosisSection({
    updateField,
    getFieldDefault,
    chanDoan,
    onChanDoanChange,
    onSelectDisease,
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
        <Grid size={12}>
            <Typography variant="h4" sx={{ mb: 1.5, color: "text.primary" }}>
                Chẩn đoán & Phương hướng điều trị
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <ChanDoanAutocomplete
                        chanDoan={chanDoan}
                        onChanDoanChange={onChanDoanChange}
                        onSelectDisease={onSelectDisease}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Autocomplete
                        options={nhomBenhList || []}
                        value={selectedNhomBenh}
                        getOptionLabel={getNhomBenhLabel}
                        onChange={handleNhomBenhChange}
                        disabled={readOnly}
                        renderInput={renderNhomBenhInput}
                    />
                </Grid>
                <Grid size={12}>
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
                </Grid>
            </Grid>
        </Grid>
    );
});
