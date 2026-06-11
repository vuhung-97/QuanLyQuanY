import { Button, Card, CardContent, MenuItem, Stack, TextField } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

export default function SoldierFilterBar({
    years,
    selectedYear,
    onYearChange,
    filteredSchedules,
    selectedSchedule,
    onScheduleChange,
    units,
    selectedUnit,
    onUnitChange,
    exportEnabled,
    onExport,
}) {
    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
                    sx={{ alignItems: { sm: "center" } }}>
                    <TextField select size="small" label="Chọn năm"
                        value={selectedYear}
                        onChange={(e) => onYearChange(e.target.value)}
                        sx={{ minWidth: 120 }}>
                        <MenuItem value="">-- Tất cả --</MenuItem>
                        {years.map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </TextField>
                    <TextField select size="small" label="Chọn lịch khám"
                        value={selectedSchedule}
                        onChange={(e) => onScheduleChange(e.target.value)}
                        sx={{ minWidth: 250 }}>
                        <MenuItem value="">-- Chọn lịch --</MenuItem>
                        {filteredSchedules.map((s) => (
                            <MenuItem key={s.ma_lich_kham} value={s.ma_lich_kham}>
                                {s.ma_lich_kham} ({s.thoi_gian_bat_dau || ""} - {s.thoi_gian_ket_thuc || ""})
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField select size="small" label="Chọn đơn vị"
                        value={selectedUnit}
                        onChange={(e) => onUnitChange(e.target.value)}
                        sx={{ minWidth: 250 }}
                        disabled={!selectedSchedule}>
                        <MenuItem value="">-- Chọn đơn vị --</MenuItem>
                        {units.map((u) => (
                            <MenuItem key={u.ma_don_vi} value={u.ma_don_vi}>
                                {u.ten_don_vi} ({u.tong_quan_so} QN)
                            </MenuItem>
                        ))}
                    </TextField>
                    {exportEnabled && (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={onExport}
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Xuất Excel
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
