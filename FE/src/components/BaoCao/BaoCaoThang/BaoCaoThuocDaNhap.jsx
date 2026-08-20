import { useMemo } from "react";
import {
    Card,
    CardContent,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import DataTable from "@/components/common/DataTable.jsx";
import { THUOC_NHAP_COLUMNS } from "@/constants/bao_cao.js";

const formatNum = (v) =>
    v != null ? Number(v).toLocaleString("vi-VN") : "--";

export default function BaoCaoThuocDaNhap({ data, thang }) {
    const tongChi = useMemo(
        () =>
            (data || []).reduce(
                (sum, item) => sum + (item.thanh_tien || 0),
                0,
            ),
        [data],
    );

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
                    minWidth={700}
                    sx={{ maxHeight: 400, overflow: "auto" }}
                    emptyMessage="Không có dữ liệu thuốc đã nhập."
                >
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                        <TableCell
                            colSpan={4}
                            sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                            TỔNG CHI
                        </TableCell>
                        <TableCell align="right" />
                        <TableCell
                            align="right"
                            sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                            {formatNum(tongChi)}
                        </TableCell>
                    </TableRow>
                    {data.map((row, idx) => (
                        <TableRow key={idx} hover>
                            <TableCell>{row.ten_thuoc}</TableCell>
                            <TableCell>{row.don_vi_tinh}</TableCell>
                            <TableCell>{row.phan_loai}</TableCell>
                            <TableCell align="right">{row.so_luong}</TableCell>
                            <TableCell align="right">
                                {formatNum(row.don_gia)}
                            </TableCell>
                            <TableCell align="right">
                                {formatNum(row.thanh_tien)}
                            </TableCell>
                        </TableRow>
                    ))}
                </DataTable>
            </CardContent>
        </Card>
    );
}