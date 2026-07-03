import { Box, Stack, Typography } from "@mui/material";
import DuTruList from "@/components/KhoDuoc/DuTru/DuTruList.jsx";

export default function DuTruPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Dự trù
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Quản lý phiếu dự trù thuốc và vật tư y tế.
                </Typography>
            </Box>
            <DuTruList />
        </Stack>
    );
}
