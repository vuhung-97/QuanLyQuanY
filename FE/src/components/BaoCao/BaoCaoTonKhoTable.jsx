import DataTable from "@/components/common/DataTable.jsx";
import { TON_KHO_COLUMNS } from "@/constants/bao_cao.js";

export default function BaoCaoTonKhoTable({ rows }) {
    const tableColumns = TON_KHO_COLUMNS.map((col) => ({
        key: col.field,
        label: col.headerName,
        align: col.align || "left",
        sx: col.width ? { width: col.width, minWidth: col.width } : { flex: col.flex },
        render: col.type === "number"
            ? (row) => (row[col.field] ?? 0).toLocaleString("vi-VN")
            : undefined,
    }));

    return (
        <DataTable
            columns={tableColumns}
            rows={rows}
            minWidth={900}
        />
    );
}
