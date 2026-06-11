import { memo, useEffect, useState } from "react";
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
import api from "../../services/api.js";

function getTrangThai(phieu) {
    if (!phieu.ket_luan) return "Đang khám";
    try {
        const parsed = JSON.parse(phieu.ket_luan);
        if (typeof parsed === "object" && parsed !== null) {
            const hasData = Object.values(parsed).some(v => v && v !== "Loại 1");
            if (!hasData) return "Đang khám";
        }
    } catch {}
    return "Đã khám";
}

function getPhanLoai(phieu) {
    if (!phieu.ket_luan) return "";
    try {
        const parsed = JSON.parse(phieu.ket_luan);
        return parsed.phan_loai_suc_khoe || "";
    } catch {
        return "";
    }
}

const PhieuHistoryDialog = memo(({ open, onClose, quanNhan, onViewPhieu }) => {
    const [phieuList, setPhieuList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !quanNhan) return;
        setLoading(true);
        api.get(`/phieu_kham_suc_khoe/by-ma-quan-nhan/${quanNhan.ma_quan_nhan}`)
            .then(res => setPhieuList(Array.isArray(res.data) ? res.data : []))
            .catch(() => setPhieuList([]))
            .finally(() => setLoading(false));
    }, [open, quanNhan]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle component="div" sx={{ fontWeight: "bold", color: "#0B3B60" }}>
                Lịch sử khám sức khỏe — {quanNhan?.ho_ten} ({quanNhan?.ma_quan_nhan})
            </DialogTitle>
            <DialogContent>
                {loading && (
                    <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                        Đang tải...
                    </Typography>
                )}
                {!loading && phieuList.length === 0 && (
                    <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                        Chưa có phiếu khám nào.
                    </Typography>
                )}
                <List disablePadding>
                    {phieuList.map((phieu) => {
                        const tt = getTrangThai(phieu);
                        const pl = getPhanLoai(phieu);
                        return (
                            <ListItemButton
                                key={phieu.ma_phieu_kham}
                                onClick={() => onViewPhieu(phieu)}
                                sx={{ borderRadius: 2, mb: 1, border: "1px solid", borderColor: "divider" }}
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
                                    color={tt === "Đã khám" ? "success" : "warning"}
                                    sx={{ fontWeight: 600, ml: 1 }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </DialogContent>
        </Dialog>
    );
});

export default PhieuHistoryDialog;
