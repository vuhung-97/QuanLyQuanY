import { memo, useMemo } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { formatDate, tinhTuoi } from "@/utils/date.js";

const TRANG_THAI_LABEL = {
    đang_điều_trị: "Đang điều trị",
    đã_ra_viện: "Đã ra viện",
};

const FIELD_DEFS = {
    ho_ten: {
        label: "Họ và tên",
        get: (d) => d?.ho_ten || d?.ma_quan_nhan || "--",
    },
    ma_quan_nhan: {
        label: "Mã QN",
        get: (d) => d?.ma_quan_nhan || "--",
    },
    ngay_sinh: {
        label: "Ngày sinh",
        get: (d) => d?.ngay_sinh || "--",
    },
    gioi_tinh: {
        label: "Giới tính",
        get: (d) =>
            d?.gioi_tinh === true
                ? "Nam"
                : d?.gioi_tinh === false
                  ? "Nữ"
                  : "--",
    },
    nghe_nghiep: {
        label: "Nghề nghiệp",
        get: (d) => d?.nghe_nghiep || "--",
    },
    so_dien_thoai: {
        label: "Số ĐT",
        get: (d) => d?.so_dien_thoai || "--",
    },
    so_the_bhyt: {
        label: "BHYT",
        get: (d) => d?.so_the_bhyt || "--",
    },
    ten_don_vi: {
        label: "Đơn vị",
        get: (d) => d?.ten_don_vi || "--",
    },
    cap_bac: {
        label: "Cấp bậc",
        get: (d) => d?.cap_bac || "--",
    },
    chuc_vu: {
        label: "Chức vụ",
        get: (d) => d?.chuc_vu || "--",
    },
    ngay_kham: {
        label: "Ngày khám",
        get: (d) => formatDate(d?.ngay_kham) || "--",
    },
    ma_kham_benh: {
        label: "Mã KB",
        get: (d) => d?.ma_kham_benh || "--",
    },
    tuoi: {
        label: "Tuổi",
        get: (d) => {
            if (d?.tuoi != null) return d.tuoi;
            if (d?.ngay_sinh) return tinhTuoi(d.ngay_sinh);
            return "--";
        },
    },
    bac_si: {
        label: "Bác sĩ khám",
        get: (d) => {
            const ten = d?.ten_nguoi_kham;
            if (!ten) return "--";
            const vaiTro = d?.vai_tro_nguoi_kham || "?";
            return `${ten} (${vaiTro})`;
        },
    },
    ma_benh_an: { label: "Mã BA", get: (d) => d?.ma_benh_an || "--" },
    ngay_nhap_vien: {
        label: "Ngày nhập viện",
        get: (d) => formatDate(d?.ngay_nhap_vien) || "--",
    },
    trang_thai: {
        label: "Trạng thái",
        get: (d) => TRANG_THAI_LABEL[d?.trang_thai] || d?.trang_thai || "--",
    },
    ten_buong: { label: "Buồng", get: (d) => d?.ten_buong || "--" },
    ten_giuong: { label: "Giường", get: (d) => d?.ten_giuong || "--" },
    ma_lay_mau: {
        label: "Mã lấy máu",
        get: (d) => d?.ma_lay_mau || "--",
    },
    ngay_nhap_ngu: {
        label: "Ngày nhập ngũ",
        get: (d) => d?.ngay_nhap_ngu || "--",
    },
};

function InfoRow({ label, value }) {
    return (
        <Box>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>
                {value}
            </Typography>
        </Box>
    );
}

const PatientInfoCard = memo(function PatientInfoCard({
    data,
    fields,
    columnsPerRow,
}) {
    const rows = useMemo(() => {
        let items;
        if (fields) {
            items = fields
                .filter((f) => FIELD_DEFS[f])
                .map((f) => ({
                    key: f,
                    label: FIELD_DEFS[f].label,
                    value: FIELD_DEFS[f].get(data),
                }));
        } else {
            items = Object.entries(FIELD_DEFS)
                .filter(([, def]) => {
                    const v = def.get(data);
                    return v !== "--" && v != null;
                })
                .map(([key, def]) => ({
                    key,
                    label: def.label,
                    value: def.get(data),
                }));
        }

        if (columnsPerRow > 0 && items.length > columnsPerRow) {
            const result = [];
            for (let i = 0; i < items.length; i += columnsPerRow) {
                result.push(items.slice(i, i + columnsPerRow));
            }
            return result;
        }
        return [items];
    }, [data, fields, columnsPerRow]);

    return (
        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#F8FAFC" }}>
            <CardContent>
                <Stack spacing={1.5}>
                    {rows.map((rowItems, ri) => (
                        <Stack
                            key={ri}
                            direction="row"
                            spacing={2}
                            sx={{ "& > *": { flex: 1, minWidth: 0 } }}
                        >
                            {rowItems.map((item) => (
                                <InfoRow
                                    key={item.key}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </Stack>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
});

export default PatientInfoCard;
