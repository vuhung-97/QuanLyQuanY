import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Stack,
    TextField,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";

export default function ThresholdDialog({
    open,
    onClose,
    initialValues,
    onSave,
}) {
    const [thuoc, setThuoc] = useState(100);
    const [vatTu, setVatTu] = useState(30);
    const [sapHetHanNgay, setSapHetHanNgay] = useState(90);

    useEffect(() => {
        if (open && initialValues) {
            setThuoc(initialValues.thuoc ?? 100);
            setVatTu(initialValues.vat_tu ?? 30);
            setSapHetHanNgay(initialValues.sapHetHanNgay ?? 90);
        }
    }, [open, initialValues]);

    const handleSave = () => {
        const t = Math.max(1, thuoc);
        const v = Math.max(1, vatTu);
        const d = Math.max(1, sapHetHanNgay);
        onSave({ thuoc: t, vat_tu: v, sapHetHanNgay: d });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitleWrapper>Cài đặt giới hạn tồn kho</DialogTitleWrapper>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Thiết lập ngưỡng tồn kho tối thiểu để hệ thống cảnh báo khi
                    số lượng tồn dưới mức này.
                </DialogContentText>
                <Stack spacing={2.5}>
                    <TextField
                        label="Ngưỡng tồn kho tối thiểu — Thuốc"
                        type="number"
                        fullWidth
                        value={thuoc}
                        onChange={(e) => setThuoc(Number(e.target.value))}
                        slotProps={{ htmlInput: { min: 1 } }}
                    />
                    <TextField
                        label="Ngưỡng tồn kho tối thiểu — VTYT"
                        type="number"
                        fullWidth
                        value={vatTu}
                        onChange={(e) => setVatTu(Number(e.target.value))}
                        slotProps={{ htmlInput: { min: 1 } }}
                    />
                    <TextField
                        label="Ngưỡng cảnh báo hết hạn (ngày)"
                        type="number"
                        fullWidth
                        value={sapHetHanNgay}
                        onChange={(e) => setSapHetHanNgay(Number(e.target.value))}
                        slotProps={{ htmlInput: { min: 1 } }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Huỷ
                </Button>
                <Button variant="contained" onClick={handleSave}>
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}
