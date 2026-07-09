import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    Typography,
} from "@mui/material";
import { MedicalServices as MedicalServicesIcon } from "@mui/icons-material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import KhoThuocDialog from "./KhoThuocDialog.jsx";
import PrescriptionRow from "./PrescriptionRow.jsx";
import useDonThuocForm from "@/hooks/useDonThuocForm.js";

export default function DonThuocForm({ open, onClose, onSave, initialItems }) {
    const {
        rows,
        rowRefs,
        openKhoThuoc,
        setOpenKhoThuoc,
        saveError,
        handleKhoThuocConfirm,
        handleRemove,
        handleSave,
        getCache,
    } = useDonThuocForm({ open, onClose, onSave, initialItems });

    const validCount = rows.length;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitleWrapper
                wrap={false}
                sx={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "space-between",
                }}
            >
                Kê đơn thuốc
                <Button
                    startIcon={<MedicalServicesIcon />}
                    variant="outlined"
                    onClick={() => setOpenKhoThuoc(true)}
                    size="small"
                >
                    Kho thuốc
                </Button>
            </DialogTitleWrapper>
            <DialogContent dividers>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    {rows.map(({ key, initial }) => (
                        <PrescriptionRow
                            key={key}
                            ref={(el) => {
                                if (el) rowRefs.current.set(key, el);
                                else rowRefs.current.delete(key);
                            }}
                            initialData={initial}
                            onRemove={() => handleRemove(key)}
                        />
                    ))}
                    {rows.length === 0 && (
                        <Typography
                            color="text.secondary"
                            sx={{ textAlign: "center", py: 4 }}
                        >
                            Đơn thuốc trống
                        </Typography>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={validCount === 0}
                >
                    Lưu đơn thuốc
                </Button>
            </DialogActions>
            {saveError && (
                <Typography
                    color="error"
                    variant="caption"
                    sx={{ px: 3, pb: 1, whiteSpace: "pre-line" }}
                >
                    {saveError}
                </Typography>
            )}

            <KhoThuocDialog
                open={openKhoThuoc}
                onClose={() => setOpenKhoThuoc(false)}
                onConfirm={handleKhoThuocConfirm}
                cachedItems={getCache()}
            />
        </Dialog>
    );
}
