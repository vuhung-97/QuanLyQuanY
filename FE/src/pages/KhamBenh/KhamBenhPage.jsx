import { Box, Stack, Typography } from "@mui/material";
import DanhSachKhamBenh from "../../components/KhamBenh/DanhSachKhamBenh.jsx";

export default function KhamBenhPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Khám, chữa bệnh cho quân nhân
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Tiếp nhận, khám bệnh, kê đơn thuốc, chuyển tuyến và quản lý nội trú.
                </Typography>
            </Box>
            <DanhSachKhamBenh />
        </Stack>
    );
}
