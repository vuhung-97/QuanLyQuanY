import { useMemo } from "react";
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

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

export default function TongQuanTab({ benhAn, onEdit }) {
    const nguoiLapBA =
        benhAn.ten_nguoi_lap_ba
            ? `${benhAn.ten_nguoi_lap_ba} (${benhAn.vai_tro_nguoi_lap_ba ?? "?"})`
            : null;

    const CHI_TIET_DISPLAY = [
        { label: "Nhiệt độ", key: "nhiet_do" },
        { label: "HA tối đa", key: "ha_tam_thu" },
        { label: "HA tối thiểu", key: "ha_tam_truong" },
        { label: "Nhịp tim", key: "nhip_tim" },
        { label: "Bệnh sử", key: "benh_su" },
        { label: "Tiền sử bản thân", key: "tien_su_ban_than" },
        { label: "Tiền sử gia đình", key: "tien_su_gia_dinh" },
        { label: "Tóm tắt bệnh án", key: "tom_tat_benh_an" },
        { label: "Chẩn đoán chính", key: "chan_doan_chinh" },
        { label: "Chẩn đoán kèm theo", key: "chan_doan_kem_theo" },
        { label: "Chẩn đoán phân biệt", key: "chan_doan_phan_biet" },
    ];

    const chiTiet = useMemo(() => {
        if (!benhAn.chi_tiet_benh_an) return null;
        try {
            return JSON.parse(benhAn.chi_tiet_benh_an);
        } catch {
            return null;
        }
    }, [benhAn.chi_tiet_benh_an]);

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
                        <Stack
                            direction="row"
                            sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
                        >
                            <Box>
                                <InfoItem label="Người lập BA:" value={nguoiLapBA} />
                            </Box>
                            {onEdit && (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={onEdit}
                                    sx={{ textTransform: "none", flexShrink: 0 }}
                                >
                                    Sửa bệnh án
                                </Button>
                            )}
                        </Stack>
                        <InfoItem label="Đối tượng:" value={benhAn.nghe_nghiep} />
                        <InfoItem
                            label="Ngày nhập viện:"
                            value={benhAn.ngay_nhap_vien
                                ? new Date(benhAn.ngay_nhap_vien).toLocaleDateString("vi-VN")
                                : "--"}
                        />
                        <InfoItem label="Lý do nhập viện:" value={benhAn.ly_do_nhap_vien} />
                        <InfoItem label="Chẩn đoán:" value={benhAn.chan_doan} />
                        <Divider sx={{ my: 0.5 }} />
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                            Chi tiết bệnh án
                        </Typography>
                        {chiTiet
                            ? CHI_TIET_DISPLAY.map((field) => (
                                  <InfoItem key={field.key} label={`${field.label}:`} value={chiTiet[field.key]} />
                              ))
                            : <InfoItem label="Chi tiết BA:" value={benhAn.chi_tiet_benh_an} />
                        }
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
