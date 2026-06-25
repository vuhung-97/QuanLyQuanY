import { Box, Stack, Typography } from "@mui/material";
import DanhSachNoiTru from "@/components/NoiTru/DanhSachNoiTru.jsx";

export default function DanhSachNoiTruPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Danh sách nội trú
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Theo dõi, quản lý bệnh nhân đang điều trị nội trú.
                </Typography>
            </Box>
            <DanhSachNoiTru />
        </Stack>
    );
}
