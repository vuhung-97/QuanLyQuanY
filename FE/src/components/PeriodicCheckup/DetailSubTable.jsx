import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { formatDateTime } from "./periodicUtils";

export default function DetailSubTable({
    details,
    donViLookup,
    schedule,
    onEditDetail,
    onDeleteDetail,
}) {
    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    {["Đơn vị", "Thời gian", "Địa điểm", "Thao tác"].map(
                        (l) => (
                            <TableCell key={l} sx={{ fontWeight: 700 }}>
                                {l}
                            </TableCell>
                        ),
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {details.map((ct) => (
                    <TableRow key={ct.ma_don_vi}>
                        <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                                {ct.ma_don_vi}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {donViLookup.get(ct.ma_don_vi) || ""}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            {formatDateTime(ct.thoi_gian_bat_dau)} -{" "}
                            {formatDateTime(ct.thoi_gian_ket_thuc)}
                        </TableCell>
                        <TableCell>{ct.dia_diem || "--"}</TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Sửa">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            onEditDetail(schedule, ct)
                                        }
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            onDeleteDetail(schedule, ct)
                                        }
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
