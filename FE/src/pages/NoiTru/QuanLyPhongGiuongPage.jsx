import { Box, Stack, Typography } from "@mui/material";
import QuanLyPhongGiuong from "@/components/NoiTru/QuanLyPhongGiuong/QuanLyPhongGiuong.jsx";

export default function QuanLyPhongGiuongPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Quản lý phòng/giường
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Quản lý buồng bệnh và giường bệnh trong nội trú.
                </Typography>
            </Box>
            <QuanLyPhongGiuong />
        </Stack>
    );
}
