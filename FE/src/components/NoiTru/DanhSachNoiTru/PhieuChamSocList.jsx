import { useMemo } from "react";
import { Button } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";

export default function PhieuChamSocList({ records, onEdit }) {
    const sorted = useMemo(() => {
        if (!records || records.length === 0) return [];
        return [...records].sort((a, b) => {
            const tA = a.thoi_gian ? new Date(a.thoi_gian) : 0;
            const tB = b.thoi_gian ? new Date(b.thoi_gian) : 0;
            return tB - tA;
        });
    }, [records]);

    const columns = useMemo(() => [
        { key: "stt", label: "STT", render: (_, idx) => idx + 1, sx: { width: 40 } },
        {
            key: "thoi_gian",
            label: "Ngày",
            render: (row) => {
                if (!row.thoi_gian) return "--";
                const d = new Date(row.thoi_gian);
                const ngay = d.toLocaleDateString("vi-VN");
                const gio = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                return (
                    <>
                        {ngay}<br />
                        {gio}
                    </>
                );
            },
            sx: { width: 150 },
        },
        { key: "so_giuong", label: "Giường", render: (row) => row.so_giuong || "--", sx: { width: 80 } },
        { key: "buong", label: "Phòng", render: (row) => row.buong || "--", sx: { width: 80 } },
        {
            key: "nguoi_thuc_hien",
            label: "Người TH",
            render: (row) => {
                const ten = row.ten_nguoi_thuc_hien;
                const vaiTro = row.vai_tro_nguoi_thuc_hien;
                return ten ? `${ten}${vaiTro ? ` (${vaiTro})` : ""}` : "--";
            },
            sx: { width: 140 },
        },
        {
            key: "theo_doi_dien_bien",
            label: "Diễn biến",
            render: (row) => row.theo_doi_dien_bien || "--",
            sx: { maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" },
        },
        {
            key: "thuc_hien_y_lenh",
            label: "Y lệnh",
            render: (row) => row.thuc_hien_y_lenh || "--",
            sx: { maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" },
        },
        {
            key: "thuoc",
            label: "Thuốc",
            render: (row) =>
                row.chi_tiet && row.chi_tiet.length > 0
                    ? `${row.chi_tiet.length} loại`
                    : "--",
            sx: { width: 120 },
        },
        {
            key: "sua",
            label: "Sửa",
            render: (row) => (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onEdit?.(row)}
                    sx={{ textTransform: "none", minWidth: 36 }}
                >
                    <EditIcon fontSize="small" />
                </Button>
            ),
            sx: { width: 60 },
        },
    ], [onEdit]);

    return (
        <DataTable
            columns={columns}
            rows={sorted}
            emptyMessage="Chưa có phiếu chăm sóc nào."
        />
    );
}
