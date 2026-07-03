import { Box, Stack, Typography } from "@mui/material";
import NhapKhoList from "@/components/KhoDuoc/NhapKho/NhapKhoList.jsx";

export default function NhapKhoPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Nhập kho
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Nhập kho thuốc và vật tư y tế từ phiếu dự trù đã duyệt.
                </Typography>
            </Box>
            <NhapKhoList />
        </Stack>
    );
}
