import { Button, Stack } from "@mui/material";
import DatePicker from "@/components/common/DatePicker.jsx";

export default function FilterModeToggle({ filterMode, onChange, selectedDate, onDateChange }) {
    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button
                variant="outlined"
                size="small"
                onClick={onChange}
                sx={{ textTransform: "none", minWidth: 100, fontSize: "18px", color: "text.primary" }}
            >
                {filterMode === "tat_ca" ? "Tất cả" : "Theo ngày" }
            </Button>
            {filterMode === "theo_ngay" && (
                <DatePicker value={selectedDate} onChange={onDateChange} />
            )}
        </Stack>
    );
}
