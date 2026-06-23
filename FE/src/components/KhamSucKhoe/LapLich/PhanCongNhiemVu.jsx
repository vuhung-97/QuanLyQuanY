import { useEffect, useState } from "react";
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
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import DataTable from "@/components/common/DataTable.jsx";

const columns = [
    { key: "ten_nguoi_dung", label: "Họ và tên" },
    { key: "ten_vai_tro", label: "Vai trò" },
];

export default function PhanCongNhiemVu({ latestScheduleId }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!latestScheduleId) {
            setAssignments([]);
            return;
        }
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const res = await khamSucKhoeService.getAssignments(latestScheduleId);
                if (!ignore) {
                    setAssignments(Array.isArray(res.data) ? res.data : []);
                }
            } catch {
                if (!ignore) setAssignments([]);
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [latestScheduleId]);

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ mb: 2.5, alignItems: "center" }}
                >
                    <AssignmentIcon color="primary" />
                    <Box>
                        <Typography variant="h2">
                            Phân công nhiệm vụ
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
                                {a.chuc_vu ? `${a.chuc_vu} ${a.ten_nguoi_dung}` : (a.ten_nguoi_dung || a.id_nguoi_dung || "--")}
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
