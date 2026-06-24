import { Stack, Typography, Box } from "@mui/material";
import CapThuocList from "@/components/KhamBenhChoQN/CapThuoc/CapThuocList.jsx";

export default function CapThuocPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1">Cấp thuốc</Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Cấp phát thuốc chữa bệnh.
                </Typography>
            </Box>
            <CapThuocList />
        </Stack>
    );
}
