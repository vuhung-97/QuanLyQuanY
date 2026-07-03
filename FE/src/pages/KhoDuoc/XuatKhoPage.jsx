import { Box, Stack, Typography } from "@mui/material";
import XuatKhoList from "@/components/KhoDuoc/XuatKho/XuatKhoList.jsx";

export default function XuatKhoPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Xuất kho
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Xuất kho thuốc và vật tư y tế cho các đơn vị.
                </Typography>
            </Box>
            <XuatKhoList />
        </Stack>
    );
}
