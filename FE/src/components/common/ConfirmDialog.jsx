import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

export default function ConfirmDialog({
    open,
    title = "Xác nhận xóa",
    message,
    confirmLabel = "Xóa",
    confirmColor = "error",
    confirmIcon,
    loading = false,
    onConfirm,
    onClose,
}) {
    return (
        <Dialog open={open} onClose={loading ? undefined : onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ whiteSpace: "pre-line" }}>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Hủy
                </Button>
                <Button
                    onClick={onConfirm}
                    color={confirmColor}
                    variant="contained"
                    startIcon={confirmIcon}
                    disabled={loading}
                >
                    {loading ? "Đang xử lý..." : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
