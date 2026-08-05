import {
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { AccessTime as AccessTimeIcon } from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import { formatDateTime } from "@/utils/date.js";

function TimeRow({ label, start, end }) {
    const now = new Date();
    const startTime = start ? new Date(start) : null;
    const endTime = end ? new Date(end) : null;
    const isActive = startTime && endTime && now >= startTime && now <= endTime;

    return (
        <TableRow
            hover
            sx={isActive ? { bgcolor: "rgba(245, 158, 11, 0.14)" } : undefined}
        >
            <TableCell>
                <Typography variant="body2" fontWeight={600}>
                    {label}
                </Typography>
            </TableCell>
            <TableCell>
                {start || end ? (
                    <Chip
                        size="small"
                        color={isActive ? "warning" : "default"}
                        variant={isActive ? "filled" : "outlined"}
                        label={`${start ? formatDateTime(start) : "--"} - ${end ? formatDateTime(end) : "--"}`}
                        sx={{ fontWeight: 600 }}
                    />
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Chưa có
                    </Typography>
                )}
            </TableCell>
        </TableRow>
    );
}

const columns = [
    { key: "ten", label: "Nội dung" },
    { key: "thoi_gian", label: "Thời gian" },
];

export default function ThoiGianKham({ schedule, latestStatus = "" }) {
    if (!schedule) {
        return null;
    }

    const isDangThucHien = latestStatus === "Đang thực hiện";

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                    >
                        <Box>
                            <Typography variant="h2">
                                Thông tin ngày giờ khám
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
                <DataTable
                    columns={columns}
                    minWidth={420}
                    emptyMessage="Chưa có thông tin ngày giờ khám."
                >
                    <TimeRow
                        label="Lấy máu"
                        start={schedule.thoi_gian_lay_mau_bat_dau}
                        end={schedule.thoi_gian_lay_mau_ket_thuc}
                    />
                    <TimeRow
                        label="Khám"
                        start={schedule.thoi_gian_bat_dau}
                        end={schedule.thoi_gian_ket_thuc}
                    />
                    <TimeRow
                        label="Lấy máu dự trù"
                        start={schedule.thoi_gian_du_tru_lay_mau_bat_dau}
                        end={schedule.thoi_gian_du_tru_lay_mau_ket_thuc}
                    />
                    <TimeRow
                        label="Khám dự trù"
                        start={schedule.thoi_gian_du_tru_kham_bat_dau}
                        end={schedule.thoi_gian_du_tru_kham_ket_thuc}
                    />
                </DataTable>
            </CardContent>
        </Card>
    );
}
