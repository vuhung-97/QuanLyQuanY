import { Box, Stack, Typography } from "@mui/material";
import KhoList from "@/components/KhoDuoc/Kho/KhoList.jsx";

export default function KhoPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Kho
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Quản lý danh mục thuốc và vật tư y tế.
                </Typography>
            </Box>
            <KhoList />
        </Stack>
    );
}
