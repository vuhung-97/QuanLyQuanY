import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import { formatDate } from "@/utils/date.js";

export default function KetQuaKhamFilter({
    nam,
    yearOptions,
    onNamChange,
    schedules,
    selectedSchedule,
    onChange,
    loading,
}) {
    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", flexWrap: "wrap" }}
        >
            <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="nam-label">Năm</InputLabel>
                <Select
                    labelId="nam-label"
                    value={nam ?? ""}
                    label="Năm"
                    onChange={(e) => onNamChange(e.target.value)}
                >
                    {yearOptions.map((y) => (
                        <MenuItem key={y} value={y}>
                            {y}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 300 }}>
                <InputLabel id="schedule-label">Chọn lịch khám</InputLabel>
                <Select
                    labelId="schedule-label"
                    value={selectedSchedule || ""}
                    label="Chọn lịch khám"
                    onChange={(e) => onChange(e.target.value)}
                    disabled={loading || schedules.length === 0}
                >
                    {schedules.map((s) => (
                        <MenuItem
                            key={s.ma_lich_kham}
                            value={s.ma_lich_kham}
                        >
                            {s.ma_lich_kham} ({formatDate(s.thoi_gian_bat_dau)} → {formatDate(s.thoi_gian_ket_thuc)})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    );
}
