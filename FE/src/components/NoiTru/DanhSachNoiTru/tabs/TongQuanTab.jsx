import { useMemo } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";

function InfoItem({ label, value }) {
    return (
        <Box>
            <Box variant="caption" sx={{ fontSize: 12, color: "text.secondary" }}>
                {label}
            </Box>
            <Box variant="body1" sx={{ fontWeight: 500 }}>
                {value || "--"}
            </Box>
        </Box>
    );
}

export default function TongQuanTab({ benhAn }) {
    const nguoiLapBA =
        benhAn.ten_nguoi_lap_ba
            ? `${benhAn.ten_nguoi_lap_ba} (${benhAn.vai_tro_nguoi_lap_ba ?? "?"})`
            : null;

    const tongKet = useMemo(() => {
        if (!benhAn.tong_ket_benh_an) return null;
        try {
            return JSON.parse(benhAn.tong_ket_benh_an);
        } catch {
            return null;
        }
    }, [benhAn.tong_ket_benh_an]);

    return (
        <Stack spacing={2}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                    <Stack spacing={1.5}>
                        <InfoItem label="Người lập BA:" value={nguoiLapBA} />
                        <InfoItem label="Đối tượng:" value={benhAn.nghe_nghiep} />
                        <InfoItem
                            label="Ngày nhập viện:"
                            value={benhAn.ngay_nhap_vien
                                ? new Date(benhAn.ngay_nhap_vien).toLocaleDateString("vi-VN")
                                : "--"}
                        />
                        <InfoItem label="Lý do nhập viện:" value={benhAn.ly_do_nhap_vien} />
                        <InfoItem label="Chẩn đoán:" value={benhAn.chan_doan} />
                        <InfoItem label="Chi tiết BA:" value={benhAn.chi_tiet_benh_an} />
                        {tongKet ? (
                            <>
                                <InfoItem label="Kết quả điều trị:" value={tongKet.ket_qua_dieu_tri} />
                                <InfoItem label="Chẩn đoán lúc ra viện:" value={tongKet.chan_doan_ra_vien} />
                                <InfoItem label="Tình trạng NB khi ra viện:" value={tongKet.tinh_trang_nb} />
                                <InfoItem label="Hướng điều trị và chế độ tiếp theo:" value={tongKet.huong_dieu_tri} />
                            </>
                        ) : (
                            <InfoItem label="Tổng kết BA:" value={benhAn.tong_ket_benh_an} />
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}
