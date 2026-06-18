import { memo, useCallback } from "react";
import {
    Autocomplete, Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, Stack, TextField, Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import useScheduleDialog from "../../../hooks/useScheduleDialog";
import DateTimeInput from "./DateTimeInput.jsx";

const getUnitOptionLabel = (o) => `${o.ma_don_vi} - ${o.ten_don_vi}`;
const isUnitOptionEqual = (o, v) => o.ma_don_vi === v.ma_don_vi;
const renderUnitInput = (params) => <TextField {...params} label="Chọn đơn vị" />;

const LocationField = memo(function LocationField({ value, onChange }) {
    return (
        <TextField
            size="small"
            label="Địa điểm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
});

const DetailItem = memo(function DetailItem({
    index, data, unitOptions, onChange, onRemove, minDate, maxDate,
}) {
    const handleLocationChange = useCallback(
        (val) => onChange(index, "dia_diem", val),
        [index, onChange],
    );

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
                    getOptionLabel={getUnitOptionLabel}
                    isOptionEqualToValue={isUnitOptionEqual}
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
                    renderInput={renderUnitInput}
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
                <LocationField
                    value={data.dia_diem}
                    onChange={handleLocationChange}
                />
            </Stack>
        </Box>
    );
});

export default function ScheduleDialog({
    open,
    onClose,
    onSaved,
    schedule,
    chiTietList,
}) {
    const {
        master,
        details,
        saving,
        error,
        unitOptions,
        isEdit,
        handleMasterChange,
        handleDetailChange,
        addDetail,
        removeDetail,
        handleSubmit,
    } = useScheduleDialog({ open, schedule, chiTietList, onSaved, onClose });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle variant="h1" sx={{ textAlign: "center" }}>
                    {isEdit
                        ? "Sửa lịch khám sức khỏe định kỳ"
                        : "Tạo lịch khám sức khỏe định kỳ"}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Stack spacing={1.5} sx={{ pt: 1 }}>
                        <Typography variant="h2">Thông tin chung</Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <DateTimeInput
                                    label="Thời gian bắt đầu"
                                    value={master.thoi_gian_bat_dau}
                                    onChange={(v) =>
                                        handleMasterChange("thoi_gian_bat_dau", v)
                                    }
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <DateTimeInput
                                    label="Thời gian kết thúc"
                                    value={master.thoi_gian_ket_thuc}
                                    onChange={(v) =>
                                        handleMasterChange("thoi_gian_ket_thuc", v)
                                    }
                                />
                            </Box>
                        </Stack>

                        <Stack
                            direction="row"
                            sx={{
                                mt: 1,
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h2">
                                Lịch khám theo đơn vị
                            </Typography>
                            <Button size="small" startIcon={<AddIcon />} onClick={addDetail}>
                                Thêm đơn vị
                            </Button>
                        </Stack>

                        {details.map((d, idx) => (
                            <DetailItem
                                key={`${idx}-${d.ma_don_vi || "new"}`}
                                index={idx}
                                data={d}
                                unitOptions={unitOptions}
                                onChange={handleDetailChange}
                                onRemove={removeDetail}
                                minDate={master.thoi_gian_bat_dau || undefined}
                                maxDate={master.thoi_gian_ket_thuc || undefined}
                            />
                        ))}

                        {details.length === 0 && (
                            <Typography
                                color="text.secondary"
                                sx={{ textAlign: "center", py: 2 }}
                            >
                                Chưa có đơn vị nào. Nhấn "Thêm đơn vị" để bắt đầu.
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="submit" variant="contained" disabled={saving}>
                        {saving
                            ? "Đang lưu..."
                            : isEdit
                              ? "Cập nhật"
                              : "Lưu lịch khám"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
