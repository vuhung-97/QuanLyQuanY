import { Card, CardContent, Stack, TextField, Typography } from "@mui/material";

export default function BaoCaoThangDanhGia({ data }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Đánh giá chung
                </Typography>
                <TextField
                    multiline
                    minRows={3}
                    fullWidth
                    placeholder="CNQY nhận xét..."
                    variant="outlined"
                    size="small"
                />
                <Stack direction="row" spacing={4} sx={{ mt: 2, justifyContent: "flex-end" }}>
                    <Typography variant="body2" color="text.secondary">
                        Ngày lập: {data.ngay_lap}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Người lập: _________________
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Xác nhận: _________________
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}
