import { Button, Stack } from "@mui/material";
import DatePicker from "@/components/common/DatePicker.jsx";

export default function FilterModeToggle({
    isLeft,
    onChange,
    selectedDate,
    onDateChange,
    labelLeft = "Tất cả",
    labelRight = "Theo ngày",
    showDatePicker = true,
}) {
    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button
                variant="outlined"
                size="small"
                onClick={onChange}
                sx={{
                    textTransform: "none",
                    minWidth: 100,
                    fontSize: "18px",
                    color: "text.primary",
                }}
            >
                {isLeft ? labelLeft : labelRight}
            </Button>
            {showDatePicker && !isLeft && selectedDate && (
                <DatePicker value={selectedDate} onChange={onDateChange} />
            )}
        </Stack>
    );
}