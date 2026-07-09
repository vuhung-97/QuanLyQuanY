import { Stack, Typography } from "@mui/material";
import useBaoCaoThang from "@/hooks/useBaoCaoThang.js";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import BaoCaoToolbar from "./BaoCaoToolbar.jsx";
import BaoCaoThangCharts from "./BaoCaoThangCharts.jsx";
import BaoCaoThangSoSanh from "./BaoCaoThangSoSanh.jsx";
import BaoCaoThangDanhGia from "./BaoCaoThangDanhGia.jsx";
import LoadingAlert from "@/components/common/LoadingAlert.jsx";
import {
    MedicalServices as MedicalServicesIcon,
    Domain as DomainIcon,
    Healing as HealingIcon,
    Description as DescriptionIcon,
} from "@mui/icons-material";

export default function BaoCaoThangMain() {
    const { thang, nam, data, loading, error, fetchData, handleExport, setThang, setNam } = useBaoCaoThang();

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
                <>
                    <Typography variant="h4" fontWeight={700} sx={{ color: "text.primary" }}>
                        Báo cáo thống kê quân y tháng {data.thang}/{data.nam}
                    </Typography>

                    <StatCardGrid
                        items={[
                            { label: "Lượt khám", value: data.tong_quan.tong_luot_kham, icon: <MedicalServicesIcon />, color: "#00B4D8", bg: "rgba(0, 180, 216, 0.1)" },
                            { label: "Nội trú", value: data.tong_quan.tong_noi_tru, icon: <DomainIcon />, color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
                            { label: "Chuyển tuyến", value: data.tong_quan.tong_chuyen_tuyen, icon: <HealingIcon />, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
                            { label: "Đơn thuốc", value: data.tong_quan.tong_don_thuoc, icon: <DescriptionIcon />, color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
                        ]}
                    />

                    <BaoCaoThangCharts data={data} />
                    <BaoCaoThangSoSanh data={data} />
                    <BaoCaoThangDanhGia data={data} />
                </>
            )}
        </Stack>
    );
}
