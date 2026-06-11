import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

const itemSx = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 56,
};

export default function HealthCheckFormInfoCard({ quanNhan, ngayNhapNgu, cardStyle, unitLookup = new Map() }) {
    // 1. Định nghĩa mảng dữ liệu để render tự động
    const infoFields = [
        {
            label: "Họ và tên",
            value: `${quanNhan?.ho_ten || "—"} (${quanNhan?.ma_quan_nhan || "N/A"})`,
        },
        {
            label: "Đơn vị",
            value: unitLookup.get(quanNhan?.ma_don_vi) || quanNhan?.ma_don_vi || "—",
        },
        {
            label: "Cấp bậc / Chức vụ",
            value: `${quanNhan?.cap_bac || "—"} / ${quanNhan?.chuc_vu || "—"}`,
        },
        {
            label: "Ngày sinh",
            value: quanNhan?.ngay_sinh || quanNhan?.nam_sinh || "—",
        },
        {
            label: "Ngày nhập ngũ",
            value: ngayNhapNgu || "—",
        },
    ];

    return (
        <Card sx={{ ...cardStyle, mb: 3 }}>
            <CardContent sx={{ py: 2, px: 3, "&:last-child": { pb: 2 } }}>
                <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                    {infoFields.map((field, index) => (
                        <Grid
                            size={{ xs: 12, sm: 6, md: 2.4 }}
                            key={index}
                            sx={itemSx}
                        >
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {field.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight="600"
                                    color={
                                        index === 0 ? "primary" : "text.primary"
                                    }
                                >
                                    {field.value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}
