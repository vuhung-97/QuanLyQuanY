import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Typography,
    Stack,
    Chip,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import { baoCaoService } from "@/services/baoCaoService.js";

const columns = [
    { key: "stt", label: "STT", sx: { width: 60, textAlign: "center" } },
    { key: "ma_quan_nhan", label: "Mã QN", sx: { width: 110 } },
    { key: "ho_ten", label: "Họ tên", sx: { minWidth: 180, fontWeight: 600 } },
    { key: "cap_bac_chuc_vu", label: "Cấp bậc / Chức vụ", sx: { minWidth: 160 } },
    { key: "so_luot_nhap_benh_xa", label: "Lượt nhập bệnh xá", sx: { width: 140, textAlign: "center" } },
    { key: "so_luot_chuyen_tuyen", label: "Lượt chuyển tuyến", sx: { width: 140, textAlign: "center" } },
    { key: "so_luot_om", label: "Tổng lượt ốm", sx: { width: 130, textAlign: "center" } },
];

export default function ChiTietQuanNhanOmDialog({ open, onClose, unitInfo, thang, nam }) {
    const [loading, setLoading] = useState(false);
    const [detailData, setDetailData] = useState(null);

    useEffect(() => {
        if (!open || !unitInfo?.ma_don_vi) return;
        setLoading(true);
        setDetailData(null);
        baoCaoService
            .getChiTietQuanSoKhoeDonVi(unitInfo.ma_don_vi, thang, nam)
            .then((res) => setDetailData(res.data))
            .catch(() => setDetailData(null))
            .finally(() => setLoading(false));
    }, [open, unitInfo, thang, nam]);

    const rows = (detailData?.danh_sach || []).map((item, idx) => ({
        ...item,
        stt: idx + 1,
        cap_bac_chuc_vu: `${item.cap_bac} - ${item.chuc_vu}`,
        so_luot_nhap_benh_xa: (
            <Chip
                label={item.so_luot_nhap_benh_xa}
                size="small"
                color={item.so_luot_nhap_benh_xa > 0 ? "error" : "default"}
                variant={item.so_luot_nhap_benh_xa > 0 ? "filled" : "outlined"}
            />
        ),
        so_luot_chuyen_tuyen: (
            <Chip
                label={item.so_luot_chuyen_tuyen}
                size="small"
                color={item.so_luot_chuyen_tuyen > 0 ? "warning" : "default"}
                variant={item.so_luot_chuyen_tuyen > 0 ? "filled" : "outlined"}
            />
        ),
        so_luot_om: (
            <Typography variant="body2" fontWeight={700} color="primary.main">
                {item.so_luot_om}
            </Typography>
        ),
    }));

    const rawName = unitInfo?.raw_ten_don_vi || unitInfo?.ten_don_vi;
    const unitName = detailData?.ten_don_vi || (typeof rawName === "string" ? rawName : "");

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitleWrapper wrap={false}>
                Chi tiết quân nhân ốm / điều trị - {unitName} (Tháng {thang}/{nam})
            </DialogTitleWrapper>
            <DialogContent dividers sx={{ minHeight: 320 }}>
                {loading ? (
                    <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
                        Đang tải danh sách quân nhân...
                    </Typography>
                ) : rows.length === 0 ? (
                    <Stack spacing={1} sx={{ py: 6, alignItems: "center" }}>
                        <Typography variant="h4" color="text.secondary">
                            Không có quân nhân ốm / chuyển tuyến
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Đơn vị {unitName} không ghi nhận lượt nhập bệnh xá hoặc chuyển tuyến nào trong tháng {thang}/{nam}.
                        </Typography>
                    </Stack>
                ) : (
                    <DataTable
                        columns={columns}
                        rows={rows}
                        emptyMessage="Không có dữ liệu quân nhân."
                        sx={{ maxHeight: 450, overflow: "auto" }}
                    />
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}
