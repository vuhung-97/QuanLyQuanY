import { memo, useMemo } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { formatDate, tinhTuoi } from "@/utils/date.js";

const FIELD_DEFS = {
    ho_ten: {
        label: "Họ và tên",
        get: (d) => d?.ho_ten || d?.ma_quan_nhan || "--",
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
};

function InfoRow({ label, value }) {
    return (
        <Box>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 800 }}
            >
                {label}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
                {value}
            </Typography>
        </Box>
    );
}

const PatientInfoCard = memo(function PatientInfoCard({ data, fields }) {
    const items = useMemo(() => {
        if (fields) {
            return fields
                .filter((f) => FIELD_DEFS[f])
                .map((f) => ({
                    key: f,
                    label: FIELD_DEFS[f].label,
                    value: FIELD_DEFS[f].get(data),
                }));
        }
        return Object.entries(FIELD_DEFS)
            .filter(([, def]) => {
                const v = def.get(data);
                return v !== "--" && v != null;
            })
            .map(([key, def]) => ({
                key,
                label: def.label,
                value: def.get(data),
            }));
    }, [data, fields]);

    return (
        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#F8FAFC" }}>
            <CardContent>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ "& > *": { flex: 1, minWidth: 0 } }}
                >
                    {items.map((item) => (
                        <InfoRow
                            key={item.key}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
});

export default PatientInfoCard;
