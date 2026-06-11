import { Chip, TableCell, TableRow, Typography } from "@mui/material";
import { formatDateTime } from "./periodicUtils";

export default function UnitOverviewRow({ row, unitScheduleMap }) {
    const unitSchedules = unitScheduleMap[row.ma_don_vi] || [];
    const hasSchedule = unitSchedules.length > 0;
    const nearest = hasSchedule
        ? unitSchedules.reduce((a, b) => {
              const da = a.thoi_gian_bat_dau
                  ? new Date(a.thoi_gian_bat_dau)
                  : 0;
              const db = b.thoi_gian_bat_dau
                  ? new Date(b.thoi_gian_bat_dau)
                  : 0;
              return db > da ? b : a;
          })
        : null;

    return (
        <TableRow key={row.ma_don_vi} hover>
            <TableCell sx={{ fontWeight: 700, color: "primary.main", pl: 3 }}>
                {row.ma_don_vi}
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>
                {row.ten_don_vi}
            </TableCell>
            <TableCell>{row.tong_quan_so ?? "--"}</TableCell>
            <TableCell>
                {hasSchedule ? (
                    <Chip
                        size="small"
                        label={`${formatDateTime(nearest.thoi_gian_bat_dau)} - ${formatDateTime(nearest.thoi_gian_ket_thuc)}`}
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
