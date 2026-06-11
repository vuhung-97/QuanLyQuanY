import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

export default function ScheduleDeleteDialog({
    open,
    deletingSchedule,
    deleteDetailInfo,
    onConfirm,
    onClose,
}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {deleteDetailInfo
                        ? `Bạn có chắc muốn xóa đơn vị ${deleteDetailInfo.ma_don_vi} khỏi lịch ${deletingSchedule?.ma_lich_kham}?`
                        : `Bạn có chắc muốn xóa lịch khám ${deletingSchedule?.ma_lich_kham}? Hành động này không thể hoàn tác.`}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                >
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
}
