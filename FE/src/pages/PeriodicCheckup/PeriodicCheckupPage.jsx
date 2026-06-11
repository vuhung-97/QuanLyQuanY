import { Box, Stack, Typography } from "@mui/material";
import HealthCheckMain from "../../components/PeriodicCheckup/HealthCheckMain.jsx";

export default function PeriodicCheckupPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" sx={{ color: "text.primary" }}>
                    Khám sức khỏe định kỳ
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Tra cứu danh sách quân nhân, nhập kết quả khám và theo dõi tiến độ.
                </Typography>
            </Box>
            <HealthCheckMain />
        </Stack>
    );
}
