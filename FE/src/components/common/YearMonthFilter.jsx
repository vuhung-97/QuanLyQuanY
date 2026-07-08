import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import { getNamOptions } from "@/utils/yearOptions.js";

const THANG_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
const NAM_OPTIONS = getNamOptions();

export default function YearMonthFilter({
    nam,
    onNamChange,
    thang,
    onThangChange,
    showThang = true,
}) {
    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="nam-label">Năm</InputLabel>
                <Select
                    labelId="nam-label"
                    value={nam ?? ""}
                    label="Năm"
                    onChange={(e) => onNamChange(e.target.value || null)}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    {NAM_OPTIONS.map((y) => (
                        <MenuItem key={y} value={y}>
                            {y}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {showThang && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="thang-label">Tháng</InputLabel>
                    <Select
                        labelId="thang-label"
                        value={thang ?? ""}
                        label="Tháng"
                        onChange={(e) => onThangChange(e.target.value || null)}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {THANG_OPTIONS.map((m) => (
                            <MenuItem key={m} value={m}>
                                Tháng {m}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Stack>
    );
}