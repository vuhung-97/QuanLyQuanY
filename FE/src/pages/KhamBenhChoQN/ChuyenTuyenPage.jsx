import { Stack, Typography, Box } from "@mui/material";
import ChuyenTuyenList from "@/components/KhamBenhChoQN/ChuyenTuyen/ChuyenTuyenList.jsx";

export default function ChuyenTuyenPage() {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1">Chuyển tuyến</Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    Quản lý chuyển tuyến sau điều trị.
                </Typography>
            </Box>
            <ChuyenTuyenList />
        </Stack>
    );
}
