import { Card, CardContent, Typography } from "@mui/material";
import DataTable from "@/components/common/DataTable.jsx";
import { THUOC_NHAP_COLUMNS } from "@/constants/bao_cao.js";

export default function BaoCaoThuocDaNhap({ data, thang }) {
    if (!data || data.length === 0) return null;

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                    {thang
                        ? `Thuốc và VTYT đã nhập trong tháng ${thang}`
                        : "Thuốc và VTYT đã nhập trong năm"
                    }
                </Typography>
                <DataTable
                    columns={THUOC_NHAP_COLUMNS}
                    rows={data}
                    minWidth={500}
                    sx={{ maxHeight: 400, overflow: "auto" }}
                    emptyMessage="Không có dữ liệu thuốc đã nhập."
                />
            </CardContent>
        </Card>
    );
}
