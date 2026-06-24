import { Stack, Typography } from "@mui/material";
import ChuyenTuyenList from "@/components/KhamBenhChoQN/ChuyenTuyen/ChuyenTuyenList.jsx";

export default function ChuyenTuyenPage() {
    return (
        <Stack spacing={3}>
            <Typography variant="h1">Chuyển tuyến</Typography>
            <ChuyenTuyenList />
        </Stack>
    );
}
