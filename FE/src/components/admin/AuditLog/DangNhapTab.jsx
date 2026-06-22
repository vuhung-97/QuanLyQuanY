import { Chip, TableCell, TableRow } from "@mui/material";
import DataTable from "@/components/common/DataTable.jsx";
import { formatDateTime } from "@/utils/date.js";

export default function DangNhapTab({ rows, loading }) {
    return (
        <DataTable
            columns={[
                { key: "id", label: "ID" },
                { key: "ho_ten", label: "Họ tên" },
                { key: "id_nguoi_dung", label: "ID người dùng" },
                { key: "thoi_gian", label: "Thời gian" },
                { key: "trang_thai", label: "Trạng thái" },
                { key: "thiet_bi", label: "Thiết bị" },
            ]}
            loading={loading}
            emptyMessage="Chưa có nhật ký."
            minWidth={760}
        >
            {rows.map((row) => (
                <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>
                        {row.id}
                    </TableCell>
                    <TableCell>{row.ho_ten || "--"}</TableCell>
                    <TableCell>
                        {row.id_nguoi_dung || "--"}
                    </TableCell>
                    <TableCell>
                        {formatDateTime(row.thoi_gian)}
                    </TableCell>
                    <TableCell>
                        <Chip
                            size="small"
                            label={
                                row.trang_thai_thanh_cong
                                    ? "Thành công"
                                    : "Thất bại"
                            }
                            color={
                                row.trang_thai_thanh_cong
                                    ? "success"
                                    : "error"
                            }
                        />
                    </TableCell>
                    <TableCell>{row.thiet_bi || "--"}</TableCell>
                </TableRow>
            ))}
        </DataTable>
    );
}
