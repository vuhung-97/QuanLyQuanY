import { FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

export default function KetQuaKhamFilter({
    nam, yearOptions, onNamChange,
    schedules, selectedSchedule, onChange, loading,
}) {
    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="nam-label">Năm</InputLabel>
                <Select
                    labelId="nam-label"
                    value={nam ?? ""}
                    label="Năm"
                    onChange={(e) => onNamChange(e.target.value)}
                >
                    {yearOptions.map((y) => (
                        <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 300 }}>
                <InputLabel id="schedule-label">Chọn đợt khám</InputLabel>
                <Select
                    labelId="schedule-label"
                    value={selectedSchedule || ""}
                    label="Chọn đợt khám"
                    onChange={(e) => onChange(e.target.value)}
                    disabled={loading || schedules.length === 0}
                >
                    {schedules.map((s) => {
                        const start = s.thoi_gian_bat_dau?.split("T")[0] || "";
                        const end = s.thoi_gian_ket_thuc?.split("T")[0] || "";
                        return (
                            <MenuItem key={s.ma_lich_kham} value={s.ma_lich_kham}>
                                {s.ma_lich_kham} — {start} → {end}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Stack>
    );
}
