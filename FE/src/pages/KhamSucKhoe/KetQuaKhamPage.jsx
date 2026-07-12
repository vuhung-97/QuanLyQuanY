import { Box, Stack, Typography } from "@mui/material";
import KetQuaKhamMain from "@/components/KhamSucKhoe/KetQuaKham/KetQuaKhamMain.jsx";

export default function KetQuaKhamPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Kết quả khám tổng hợp
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Thống kê và trực quan hóa kết quả khám sức khỏe định kỳ theo đợt.
                </Typography>
            </Box>
            <KetQuaKhamMain />
        </Stack>
    );
}
