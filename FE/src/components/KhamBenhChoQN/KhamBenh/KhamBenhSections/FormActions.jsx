import { memo } from "react";
import { Button, DialogActions, Stack } from "@mui/material";

export default memo(function FormActions({
    saving,
    hasPrescription,
    onSave,
    onPrescription,
    onReferral,
    onAdmission,
    isReadOnly,
    onClose,
}) {
    if (isReadOnly) {
        return (
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} sx={{ textTransform: "none" }}>
                    Đóng
                </Button>
            </DialogActions>
        );
    }
    return (
        <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={onSave}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                >
                    Hoàn tất
                </Button>
                <Button
                    variant="contained"
                    onClick={onPrescription}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                >
                    {hasPrescription ? "Sửa đơn thuốc" : "Kê đơn thuốc"}
                </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={onReferral}
                    sx={{ textTransform: "none" }}
                >
                    Chuyển tuyến
                </Button>
                <Button
                    variant="outlined"
                    color="info"
                    onClick={onAdmission}
                    sx={{ textTransform: "none" }}
                >
                    Nhập bệnh xá
                </Button>
            </Stack>
        </DialogActions>
    );
});
