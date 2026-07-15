import { Chip, Stack, TableCell, TableRow } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import { formatDateTime } from "@/utils/date.js";

export default function ThaoTacTab({ rows, loading, onViewDetail }) {
    return (
        <DataTable
            columns={[
                { key: "id", label: "ID" },
                { key: "ho_ten", label: "Họ tên" },
                { key: "id_nguoi_dung", label: "ID người dùng" },
                { key: "thoi_gian", label: "Thời gian" },
                { key: "hanh_dong", label: "Hành động" },
                { key: "bang", label: "Bảng" },
                { key: "ip", label: "IP" },
                { key: "chi_tiet", label: "Chi tiết" },
            ]}
            loading={loading}
            emptyMessage="Chưa có nhật ký."
            minWidth={880}
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
                            label={row.hanh_dong || "--"}
                            color={
                                row.hanh_dong === "CREATE"
                                    ? "success"
                                    : row.hanh_dong === "UPDATE"
                                      ? "info"
                                      : row.hanh_dong === "DELETE"
                                        ? "error"
                                        : "default"
                            }
                        />
                    </TableCell>
                    <TableCell>{row.ten_bang || "--"}</TableCell>
                    <TableCell>{row.dia_chi_ip || "--"}</TableCell>
                    <TableCell>
                        <Stack direction="row" spacing={0.5}>
                            <ActionIcon
                                title="Xem chi tiết"
                                icon={<VisibilityIcon />}
                                color="info"
                                onClick={() => onViewDetail(row)}
                            />
                        </Stack>
                    </TableCell>
                </TableRow>
            ))}
        </DataTable>
    );
}
