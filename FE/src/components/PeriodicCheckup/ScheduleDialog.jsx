import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useScheduleDialog from "../../hooks/useScheduleDialog";
import DateTimeInput from "./DateTimeInput.jsx";
import DetailItem from "./ScheduleDetailItem.jsx";

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
