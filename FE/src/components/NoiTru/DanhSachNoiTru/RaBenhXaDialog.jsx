import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import { noiTruService } from "@/services/noiTruService.js";
import { formatDate } from "@/utils/date.js";
import {
    PRINT_STYLES,
    PRINT_DIALOG_CONTENT_SX,
    triggerPrint,
    toFileDate,
} from "@/utils/printUtils.js";
import RaBenhXaPrint from "./RaBenhXaPrint.jsx";

function parseTongKet(value) {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

export default function RaBenhXaDialog({ open, benhAnId, onClose }) {
    const [benhAn, setBenhAn] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !benhAnId) return;
        setLoading(true);
        noiTruService
            .getBenhAnChiTiet(benhAnId)
            .then((res) => setBenhAn(res.data || res))
            .catch(() => setBenhAn(null))
            .finally(() => setLoading(false));
    }, [open, benhAnId]);

    const tongKet = parseTongKet(benhAn?.tong_ket_benh_an);

    const printData = {
        hoTen: benhAn?.ho_ten || "",
        capBac: benhAn?.cap_bac || "",
        tenDonVi: benhAn?.ten_don_vi || "",
        soTheBhyt: benhAn?.so_the_bhyt || "",
        ngayVao: benhAn?.ngay_nhap_vien
            ? formatDate(benhAn.ngay_nhap_vien)
            : "",
        ngayRa: tongKet?.ngay_ra ? formatDate(tongKet.ngay_ra) : "",
        chanDoan: benhAn?.chan_doan || "",
        phuongPhapDieuTri: tongKet?.huong_dieu_tri || "",
    };

    return (
        <>
            <style>{PRINT_STYLES}</style>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitleWrapper
                    sx={{ "@media print": { display: "none" } }}
                >
                    In giấy ra bệnh xá
                </DialogTitleWrapper>
                <DialogContent
                    dividers
                    sx={{
                        pt: 0,
                        ...PRINT_DIALOG_CONTENT_SX,
                    }}
                >
                    {loading ? (
                        <Typography
                            color="text.secondary"
                            sx={{ py: 4, textAlign: "center" }}
                        >
                            Đang tải...
                        </Typography>
                    ) : !benhAn ? (
                        <Typography
                            color="text.secondary"
                            sx={{ py: 4, textAlign: "center" }}
                        >
                            Không tìm thấy thông tin.
                        </Typography>
                    ) : (
                        <RaBenhXaPrint data={printData} preview />
                    )}
                </DialogContent>
                <Box sx={{ "@media print": { display: "none" }, p: 2 }}>
                    <DialogActions sx={{ p: 0 }}>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button
                            variant="outlined"
                            onClick={() =>
                                triggerPrint(
                                    `Giay_ra_benh_xa_${printData.hoTen || ""}_${toFileDate(tongKet?.ngay_ra)}`,
                                )
                            }
                            disabled={!benhAn}
                        >
                            In giấy
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}
