import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import DataTable from "@/components/common/DataTable.jsx";
import { formatDateTime } from "@/utils/date.js";

const columns = [
    { key: "ma_don_vi", label: "Mã đơn vị" },
    { key: "ten_don_vi", label: "Tên đơn vị" },
    { key: "quan_so", label: "Quân số" },
    { key: "lich_da_lap", label: "Lịch đã lập" },
];

export default function TongQuanDonVi({
    chiTietMap,
    unitStats = [],
    latestScheduleId,
    latestStatus = "",
    schedule = null,
}) {
    const scheduleDetails = chiTietMap?.[latestScheduleId] || [];
    const unitCodes = useMemo(
        () => new Set(scheduleDetails.map((d) => d.ma_don_vi)),
        [scheduleDetails],
    );

    const scheduleUnits = useMemo(
        () => (unitStats ?? []).filter((u) => unitCodes.has(u.ma_don_vi)),
        [unitStats, unitCodes],
    );

    const activePhase = useMemo(() => {
        const getLayMauTime = (detail) => ({
            start: detail?.thoi_gian_lay_mau_bat_dau || schedule?.thoi_gian_lay_mau_bat_dau,
            end: detail?.thoi_gian_lay_mau_ket_thuc || schedule?.thoi_gian_lay_mau_ket_thuc,
        });

        const getKhamTime = (detail) => ({
            start: detail?.thoi_gian_bat_dau || schedule?.thoi_gian_bat_dau,
            end: detail?.thoi_gian_ket_thuc || schedule?.thoi_gian_ket_thuc,
        });

        const getDuTruLayMauTime = (detail) => ({
            start: detail?.thoi_gian_du_tru_lay_mau_bat_dau || schedule?.thoi_gian_du_tru_lay_mau_bat_dau,
            end: detail?.thoi_gian_du_tru_lay_mau_ket_thuc || schedule?.thoi_gian_du_tru_lay_mau_ket_thuc,
        });

        const getDuTruKhamTime = (detail) => ({
            start: detail?.thoi_gian_du_tru_kham_bat_dau || schedule?.thoi_gian_du_tru_kham_bat_dau,
            end: detail?.thoi_gian_du_tru_kham_ket_thuc || schedule?.thoi_gian_du_tru_kham_ket_thuc,
        });

        if (!schedule) {
            return {
                title: "Lịch lấy máu cho đơn vị",
                getTime: getLayMauTime,
            };
        }

        const now = new Date().getTime();

        const isTimeMatch = (s, e) => {
            if (!s || !e) return false;
            const startTime = new Date(s).getTime();
            const endTime = new Date(e).getTime();
            return now >= startTime && now <= endTime;
        };

        if (isTimeMatch(schedule.thoi_gian_lay_mau_bat_dau, schedule.thoi_gian_lay_mau_ket_thuc)) {
            return { title: "Lịch lấy máu cho đơn vị", getTime: getLayMauTime };
        }

        if (isTimeMatch(schedule.thoi_gian_bat_dau, schedule.thoi_gian_ket_thuc)) {
            return { title: "Lịch khám sức khỏe cho đơn vị", getTime: getKhamTime };
        }

        if (isTimeMatch(schedule.thoi_gian_du_tru_lay_mau_bat_dau, schedule.thoi_gian_du_tru_lay_mau_ket_thuc)) {
            return { title: "Lịch lấy máu dự trù cho đơn vị", getTime: getDuTruLayMauTime };
        }

        if (isTimeMatch(schedule.thoi_gian_du_tru_kham_bat_dau, schedule.thoi_gian_du_tru_kham_ket_thuc)) {
            return { title: "Lịch khám sức khỏe dự trù cho đơn vị", getTime: getDuTruKhamTime };
        }

        // Mặc định hiển thị đợt lấy máu
        return { title: "Lịch lấy máu cho đơn vị", getTime: getLayMauTime };
    }, [schedule]);

    const totalQuanSo = useMemo(
        () => scheduleUnits.reduce((sum, u) => sum + (u.tong_quan_so || 0), 0),
        [scheduleUnits],
    );

    const loading = Boolean(latestScheduleId) && unitStats.length === 0;

    const navigate = useNavigate();
    const canClick =
        latestStatus === "Đang thực hiện" && Boolean(latestScheduleId);

    const goToKhamSucKhoe = (maDonVi) =>
        navigate(
            `/kham-dinh-ky/kham-suc-khoe?schedule=${encodeURIComponent(
                latestScheduleId,
            )}&unit=${encodeURIComponent(maDonVi)}`,
        );

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{
                        mb: 2.5,
                        justifyContent: "space-between",
                        alignItems: { md: "center" },
                    }}
                >
                    <Box>
                        <Typography variant="h2">
                            {activePhase.title}
                        </Typography>
                    </Box>
                </Stack>
                <DataTable
                    columns={columns}
                    loading={loading}
                    emptyMessage="Không có đơn vị nào."
                    minWidth={650}
                >
                    {scheduleUnits.map((row) => {
                        const detail = scheduleDetails.find(
                            (d) => d.ma_don_vi === row.ma_don_vi,
                        );
                        const timeRange = activePhase.getTime(detail);
                        const now = new Date();
                        const startTime = timeRange.start
                            ? new Date(timeRange.start)
                            : null;
                        const endTime = timeRange.end
                            ? new Date(timeRange.end)
                            : null;
                        const isActive =
                            startTime &&
                            endTime &&
                            now >= startTime &&
                            now <= endTime;
                        return (
                            <TableRow
                                key={row.ma_don_vi}
                                hover
                                onClick={
                                    canClick
                                        ? () => goToKhamSucKhoe(row.ma_don_vi)
                                        : undefined
                                }
                                sx={{
                                    ...(canClick ? { cursor: "pointer" } : {}),
                                    ...(isActive
                                        ? {
                                              bgcolor:
                                                  "rgba(245, 158, 11, 0.14)",
                                          }
                                        : {}),
                                }}
                            >
                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: "primary.main",
                                        pl: 3,
                                    }}
                                >
                                    {row.ma_don_vi}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    {row.ten_don_vi}
                                </TableCell>
                                <TableCell>
                                    {row.tong_quan_so ?? "--"}
                                </TableCell>
                                <TableCell>
                                    {timeRange.start || timeRange.end ? (
                                        <Chip
                                            size="small"
                                            color={
                                                isActive ? "warning" : "default"
                                            }
                                            label={`${timeRange.start ? formatDateTime(timeRange.start) : "--"} - ${timeRange.end ? formatDateTime(timeRange.end) : "--"}`}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Chưa có
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </DataTable>
            </CardContent>
        </Card>
    );
}
