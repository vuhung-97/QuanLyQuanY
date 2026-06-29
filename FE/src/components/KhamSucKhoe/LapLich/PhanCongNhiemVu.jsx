import {
    Box,
    Card,
    CardContent,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { Assignment as AssignmentIcon } from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import usePhanCongNhiemVu from "@/hooks/usePhanCongNhiemVu.jsx";

const columns = [
    { key: "ten_nguoi_dung", label: "Họ và tên" },
    { key: "ten_vai_tro", label: "Vai trò" },
];

export default function PhanCongNhiemVu({ latestScheduleId }) {
    const { assignments, loading } = usePhanCongNhiemVu(latestScheduleId);

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ mb: 2.5, alignItems: "center" }}
                >
                    <Box>
                        <Typography variant="h2">
                            Phân công cuối cùng
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.25 }}
                        >
                            {assignments.length > 0
                                ? `${assignments.length} nhân sự được phân công`
                                : "Chưa có phân công cho lịch này"}
                        </Typography>
                    </Box>
                </Stack>
                <DataTable
                    columns={columns}
                    loading={loading}
                    emptyMessage="Chưa có phân công nhiệm vụ."
                    minWidth={400}
                >
                    {assignments.map((a) => (
                        <TableRow key={a.id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>
                                {a.chuc_vu
                                    ? `${a.chuc_vu} ${a.ten_nguoi_dung}`
                                    : a.ten_nguoi_dung ||
                                      a.id_nguoi_dung ||
                                      "--"}
                            </TableCell>
                            <TableCell>
                                {a.ten_vai_tro || a.ma_vai_tro || "--"}
                            </TableCell>
                        </TableRow>
                    ))}
                </DataTable>
            </CardContent>
        </Card>
    );
}
