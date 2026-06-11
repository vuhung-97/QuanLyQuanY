import { memo } from "react";
import {
    Autocomplete,
    Box,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import DateTimeInput from "./DateTimeInput.jsx";

const ScheduleDetailItem = memo(function ScheduleDetailItem({
    index,
    data,
    unitOptions,
    onChange,
    onRemove,
    minDate,
    maxDate,
}) {
    return (
        <Box
            sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    mb: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="body2" fontWeight={600}>
                    Đơn vị {index + 1}
                </Typography>
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemove(index)}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Stack>
            <Stack spacing={1.5}>
                <Autocomplete
                    size="small"
                    options={unitOptions}
                    getOptionLabel={(o) => `${o.ma_don_vi} - ${o.ten_don_vi}`}
                    isOptionEqualToValue={(o, v) => o.ma_don_vi === v.ma_don_vi}
                    value={
                        unitOptions.find(
                            (o) => o.ma_don_vi === data.ma_don_vi,
                        ) || null
                    }
                    onChange={(_, newVal) =>
                        onChange(
                            index,
                            "ma_don_vi",
                            newVal ? newVal.ma_don_vi : "",
                        )
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Chọn đơn vị" />
                    )}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <DateTimeInput
                            label="Bắt đầu"
                            value={data.thoi_gian_bat_dau}
                            onChange={(v) =>
                                onChange(index, "thoi_gian_bat_dau", v)
                            }
                            minDate={minDate}
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <DateTimeInput
                            label="Kết thúc"
                            value={data.thoi_gian_ket_thuc}
                            onChange={(v) =>
                                onChange(index, "thoi_gian_ket_thuc", v)
                            }
                            minDate={minDate}
                        />
                    </Box>
                </Stack>
                {minDate && maxDate && (
                    <Typography variant="caption" color="text.secondary">
                        Khoảng cho phép: {minDate?.split("T")[0]} →{" "}
                        {maxDate?.split("T")[0]}
                    </Typography>
                )}
                <TextField
                    size="small"
                    label="Địa điểm"
                    value={data.dia_diem}
                    onChange={(e) =>
                        onChange(index, "dia_diem", e.target.value)
                    }
                />
            </Stack>
        </Box>
    );
});

export default ScheduleDetailItem;
