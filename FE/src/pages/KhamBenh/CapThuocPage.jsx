import { Stack, Typography } from "@mui/material";
import CapThuocList from "@/components/KhamBenh/CapThuoc/CapThuocList.jsx";

export default function CapThuocPage() {
    return (
        <Stack spacing={3}>
            <Typography variant="h1">Cấp thuốc</Typography>
            <CapThuocList />
        </Stack>
    );
}
