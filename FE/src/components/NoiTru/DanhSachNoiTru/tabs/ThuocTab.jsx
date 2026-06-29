import DataTable from "@/components/common/DataTable.jsx";

const columns = [
    { key: "stt", label: "STT", render: (_, idx) => idx + 1 },
    { key: "ten_thuoc_vtyt", label: "Tên thuốc" },
    { key: "so_luong", label: "SL" },
    { key: "don_vi_tinh", label: "ĐVT", render: (row) => row.don_vi_tinh || "--" },
];

export default function ThuocTab({ aggregatedThuoc }) {
    return (
        <DataTable
            columns={columns}
            rows={aggregatedThuoc}
            emptyMessage="Chưa có thuốc nào."
        />
    );
}
