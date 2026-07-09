import { Card, CardContent, Stack, Typography } from "@mui/material";
import useBaoCaoTonKho from "@/hooks/useBaoCaoTonKho.js";
import BaoCaoToolbar from "./BaoCaoToolbar.jsx";
import BaoCaoTonKhoTable from "./BaoCaoTonKhoTable.jsx";
import BaoCaoTonKhoSummary from "./BaoCaoTonKhoSummary.jsx";
import LoadingAlert from "@/components/common/LoadingAlert.jsx";

export default function BaoCaoTonKhoMain() {
    const { thang, nam, data, loading, error, fetchData, handleExport, setThang, setNam } = useBaoCaoTonKho();

    return (
        <Stack spacing={3}>
            <BaoCaoToolbar
                thang={thang}
                nam={nam}
                onThangChange={setThang}
                onNamChange={setNam}
                onExport={handleExport}
                onRefresh={fetchData}
                loading={loading}
            />

            <LoadingAlert loading={loading} error={error} empty={!data} emptyMessage="Chọn tháng/năm và nhấn 'Tạo báo cáo' để xem dữ liệu." />

            {data && (
                <Card>
                    <CardContent>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: "text.primary" }}>
                            Báo cáo tồn kho thuốc - VT Y tế tháng {data.thang}/{data.nam}
                        </Typography>
                        <BaoCaoTonKhoTable rows={data.danh_sach} />
                        <BaoCaoTonKhoSummary data={data} />
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
}
