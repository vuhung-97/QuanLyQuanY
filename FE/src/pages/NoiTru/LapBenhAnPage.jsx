import { Box, Stack, Typography } from "@mui/material";
import LapBenhAnList from "@/components/NoiTru/LapBenhAn/LapBenhAnList.jsx";

export default function LapBenhAnPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Lập bệnh án nội trú
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Tiếp nhận quân nhân từ chỉ định nhập viện, lập bệnh án.
                </Typography>
            </Box>
            <LapBenhAnList />
        </Stack>
    );
}
