import { Button, Stack } from "@mui/material";
import {
    Refresh as RefreshIcon,
    Print as PrintIcon,
} from "@mui/icons-material";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";

export default function BaoCaoToolbar({
    thang,
    nam,
    onThangChange,
    onNamChange,
    onPrint,
    onRefresh,
    loading = false,
    dataAvailable = false,
}) {
    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", flexWrap: "wrap" }}
        >
            <YearMonthFilter
                thang={thang}
                nam={nam}
                onThangChange={onThangChange}
                onNamChange={onNamChange}
                showThang={true}
            />
            <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                disabled={loading}
            >
                {loading ? "Đang tải..." : "Refresh"}
            </Button>
            <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={onPrint}
                disabled={!dataAvailable || loading}
            >
                In báo cáo
            </Button>
        </Stack>
    );
}
