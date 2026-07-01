import {
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { getPhanLoai } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";
import useLichSuKham from "@/hooks/useLichSuKham.jsx";

export default function LichSuKhamDialog({
    open,
    onClose,
    quanNhan,
    onViewPhieu,
}) {
    const { phieuList, loading } = useLichSuKham(open, quanNhan);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                component="div"
                sx={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}
            >
                Lịch sử khám sức khỏe — {quanNhan?.ho_ten} (
                {quanNhan?.ma_quan_nhan})
            </DialogTitle>
            <DialogContent dividers>
                {loading && (
                    <Typography
                        color="text.secondary"
                        sx={{ py: 2, textAlign: "center" }}
                    >
                        Đang tải...
                    </Typography>
                )}
                {!loading && phieuList.length === 0 && (
                    <Typography
                        color="text.secondary"
                        sx={{ py: 2, textAlign: "center" }}
                    >
                        Chưa có phiếu khám nào.
                    </Typography>
                )}
                <List disablePadding>
                    {phieuList.map((phieu) => {
                        const tt =
                            phieu?.trang_thai === "da_kham"
                                ? "Đã khám"
                                : phieu?.trang_thai === "dang_kham"
                                  ? "Đang khám"
                                  : "Chưa khám";
                        const pl = getPhanLoai(phieu);
                        return (
                            <ListItemButton
                                key={phieu.ma_phieu_kham}
                                onClick={() => onViewPhieu(phieu)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography fontWeight="600">
                                            Phiếu {phieu.ma_phieu_kham}
                                            {phieu.nam && ` — Năm ${phieu.nam}`}
                                        </Typography>
                                    }
                                    secondary={pl && `Phân loại: ${pl}`}
                                />
                                <Chip
                                    size="small"
                                    label={tt}
                                    color={
                                        tt === "Đã khám" ? "success" : "warning"
                                    }
                                    sx={{ fontWeight: 600, ml: 1 }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </DialogContent>
        </Dialog>
    );
}
