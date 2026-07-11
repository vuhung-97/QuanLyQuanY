import { Button, Stack } from "@mui/material";
import {
    FileDownload as FileDownloadIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";

export default function BaoCaoToolbar({
    thang,
    nam,
    onThangChange,
    onNamChange,
    onExport,
    onRefresh,
    loading = false,
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
                startIcon={<FileDownloadIcon />}
                onClick={onExport}
                disabled={loading}
            >
                Xuất Excel
            </Button>
        </Stack>
    );
}
