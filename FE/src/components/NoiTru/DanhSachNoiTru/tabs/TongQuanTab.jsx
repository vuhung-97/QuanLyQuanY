import { useMemo } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import InfoItem from "@/components/NoiTru/common/InfoItem.jsx";
import SectionTitle from "@/components/NoiTru/common/SectionTitle.jsx";
import { formatDate } from "@/utils/date.js";

const CARD_SX = {
    borderRadius: 2,
    boxShadow: "0 2px 4px -1px rgba(0,0,0,0.04)",
    border: "1px solid",
    borderColor: "divider",
};

const VITAL_FIELDS = [
    { label: "Nhiệt độ", key: "nhiet_do", valueSuffix: "°C" },
    { label: "HA tối đa", key: "ha_tam_thu", valueSuffix: "mmHg" },
    { label: "HA tối thiểu", key: "ha_tam_truong", valueSuffix: "mmHg" },
    { label: "Nhịp tim", key: "nhip_tim", valueSuffix: "lần/phút" },
];

const TEXT_FIELDS = [
    { label: "Bệnh sử", key: "benh_su" },
    { label: "Tiền sử bản thân", key: "tien_su_ban_than" },
    { label: "Tiền sử gia đình", key: "tien_su_gia_dinh" },
    { label: "Tóm tắt bệnh án", key: "tom_tat_benh_an" },
];

const DIAG_FIELDS = [
    { label: "Chẩn đoán chính", key: "chan_doan_chinh" },
    { label: "Chẩn đoán kèm theo", key: "chan_doan_kem_theo" },
    { label: "Chẩn đoán phân biệt", key: "chan_doan_phan_biet" },
];

export default function TongQuanTab({ benhAn, onEdit }) {
    const nguoiLapBA = benhAn.ten_nguoi_lap_ba
        ? `${benhAn.ten_nguoi_lap_ba} (${benhAn.vai_tro_nguoi_lap_ba ?? "?"})`
        : null;

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
            {/* Card 1 — Thông tin chung */}
            <Stack
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                }}
            >
                <Box>
                    <InfoItem label="Người lập BA:" value={nguoiLapBA} />
                </Box>
                {onEdit && benhAn.trang_thai !== "đã_ra_viện" && (
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
            <Card variant="outlined" sx={CARD_SX}>
                <CardContent>
                    <SectionTitle>Thông tin chung</SectionTitle>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <InfoItem
                                label="Đối tượng:"
                                value={benhAn.nghe_nghiep}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <InfoItem
                                label="Ngày nhập viện:"
                                value={formatDate(benhAn.ngay_nhap_vien)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <InfoItem
                                label="Lý do nhập viện:"
                                value={benhAn.ly_do_nhap_vien}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <InfoItem
                                label="Chẩn đoán:"
                                value={benhAn.chan_doan}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <InfoItem
                                label="Ngày ra viện:"
                                value={
                                    tongKet?.ngay_ra
                                        ? formatDate(tongKet.ngay_ra)
                                        : "--"
                                }
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Card 2 — Chi tiết bệnh án */}
            <Card variant="outlined" sx={CARD_SX}>
                <CardContent>
                    <SectionTitle>Chi tiết bệnh án</SectionTitle>
                    {chiTiet ? (
                        <Stack spacing={2.5}>
                            <Grid container spacing={2}>
                                {VITAL_FIELDS.map((f) => (
                                    <Grid size={{ xs: 6, sm: 3 }} key={f.key}>
                                        <InfoItem
                                            label={`${f.label}:`}
                                            value={
                                                chiTiet[f.key] +
                                                (f.valueSuffix
                                                    ? ` ${f.valueSuffix}`
                                                    : "")
                                            }
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Divider />
                            <Grid container spacing={2}>
                                {TEXT_FIELDS.map((f) => (
                                    <Grid size={12} key={f.key}>
                                        <InfoItem
                                            label={`${f.label}:`}
                                            value={chiTiet[f.key]}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Divider />
                            <Grid container spacing={2}>
                                {DIAG_FIELDS.map((f) => (
                                    <Grid size={{ xs: 12, sm: 4 }} key={f.key}>
                                        <InfoItem
                                            label={`${f.label}:`}
                                            value={chiTiet[f.key]}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    ) : (
                        <InfoItem
                            label="Chi tiết BA:"
                            value={benhAn.chi_tiet_benh_an}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Card 3 — Tổng kết bệnh án */}
            <Card variant="outlined" sx={CARD_SX}>
                <CardContent>
                    <SectionTitle>Tổng kết bệnh án</SectionTitle>
                    {tongKet ? (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <InfoItem
                                    label="Kết quả điều trị:"
                                    value={tongKet.ket_qua_dieu_tri}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <InfoItem
                                    label="Chẩn đoán lúc ra viện:"
                                    value={tongKet.chan_doan_ra_vien}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <InfoItem
                                    label="Tình trạng NB khi ra viện:"
                                    value={tongKet.tinh_trang_nb}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <InfoItem
                                    label="Hướng điều trị và chế độ tiếp theo:"
                                    value={tongKet.huong_dieu_tri}
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <InfoItem
                            label="Tổng kết BA:"
                            value={benhAn.tong_ket_benh_an}
                        />
                    )}
                </CardContent>
            </Card>
        </Stack>
    );
}
