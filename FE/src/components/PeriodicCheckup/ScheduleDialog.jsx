import { memo, useCallback, useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../../services/api.js";

function DateTimeInput({ label, value, onChange, minDate, helperText }) {
    const dv = value ? dayjs(value) : null;
    const minDv = minDate ? dayjs(minDate.split("T")[0]) : null;

    return (
        <Box>
            <Typography
                variant="caption"
                sx={{
                    mb: 0.25,
                    display: "block",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                }}
            >
                {label}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
                <DatePicker
                    value={dv}
                    onChange={(nv) => {
                        if (!nv) {
                            onChange("");
                            return;
                        }
                        const time = value?.split("T")[1] || "00:00";
                        onChange(`${nv.format("YYYY-MM-DD")}T${time}`);
                    }}
                    minDate={minDv}
                    format="DD/MM/YYYY"
                    reduceAnimations
                    slotProps={{
                        textField: {
                            size: "small",
                            sx: {
                                minWidth: 0,
                                "& .MuiInputBase-root": {
                                    fontSize: "0.8rem",
                                    py: 0.5,
                                    px: 0.75,
                                },
                                "& .MuiInputAdornment-root": { ml: 0, mr: 0.25 },
                                "& .MuiSvgIcon-root": { fontSize: "1rem" },
                            },
                        },
                    }}
                    sx={{ flex: 1, minWidth: 0 }}
                />
                <TimePicker
                    value={dv}
                    onChange={(nv) => {
                        if (!nv) {
                            onChange("");
                            return;
                        }
                        const date =
                            value?.split("T")[0] ||
                            dayjs().format("YYYY-MM-DD");
                        onChange(`${date}T${nv.format("HH:mm")}`);
                    }}
                    format="HH:mm"
                    ampm={false}
                    reduceAnimations
                    slotProps={{
                        textField: {
                            size: "small",
                            sx: {
                                minWidth: 0,
                                "& .MuiInputBase-root": {
                                    fontSize: "0.8rem",
                                    py: 0.5,
                                    px: 0.75,
                                },
                                "& .MuiInputAdornment-root": { ml: 0, mr: 0.25 },
                                "& .MuiSvgIcon-root": { fontSize: "1rem" },
                            },
                        },
                    }}
                    sx={{ flex: 1, minWidth: 0 }}
                />
            </Stack>
            {helperText && (
                <Typography variant="caption" color="text.secondary">
                    {helperText}
                </Typography>
            )}
        </Box>
    );
}

const DetailItem = memo(function DetailItem({
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

const emptyDetail = {
    ma_don_vi: "",
    thoi_gian_bat_dau: "",
    thoi_gian_ket_thuc: "",
    dia_diem: "",
};

export default function ScheduleDialog({
    open,
    onClose,
    onSaved,
    schedule,
    chiTietList,
}) {
    const isEdit = Boolean(schedule);
    const [master, setMaster] = useState({
        thoi_gian_bat_dau: "",
        thoi_gian_ket_thuc: "",
    });
    const [details, setDetails] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [unitOptions, setUnitOptions] = useState([]);

    useEffect(() => {
        if (open) {
            api.get("/thong-ke/don-vi", { params: { limit: 100 } })
                .then((res) =>
                    setUnitOptions(Array.isArray(res.data) ? res.data : []),
                )
                .catch(() => {});
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            if (schedule) {
                setMaster({
                    thoi_gian_bat_dau: schedule.thoi_gian_bat_dau || "",
                    thoi_gian_ket_thuc: schedule.thoi_gian_ket_thuc || "",
                });
                setDetails(
                    (chiTietList || []).map((ct) => ({
                        ma_don_vi: ct.ma_don_vi || "",
                        thoi_gian_bat_dau: ct.thoi_gian_bat_dau || "",
                        thoi_gian_ket_thuc: ct.thoi_gian_ket_thuc || "",
                        dia_diem: ct.dia_diem || "",
                    })),
                );
            } else {
                setMaster({ thoi_gian_bat_dau: "", thoi_gian_ket_thuc: "" });
                setDetails([]);
            }
            setError("");
        }
    }, [open, schedule, chiTietList]);

    const handleDetailChange = useCallback((index, field, value) => {
        setDetails((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    }, []);

    const addDetail = useCallback(() => {
        setDetails((prev) => [...prev, { ...emptyDetail }]);
    }, []);

    const removeDetail = useCallback((index) => {
        setDetails((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (details.length === 0) {
            setError("Vui lòng thêm ít nhất một đơn vị.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            if (isEdit) {
                await api.patch(
                    `/lich_kham_sk_nam/${schedule.ma_lich_kham}`,
                    master,
                );
                const existing = chiTietList || [];
                const existingKeys = new Set(
                    existing.map((ct) => ct.ma_don_vi),
                );
                const newKeys = new Set(details.map((d) => d.ma_don_vi));

                for (const d of details) {
                    if (existingKeys.has(d.ma_don_vi)) {
                        await api.patch(
                            `/lich_kham_sk_nam/${schedule.ma_lich_kham}/chi-tiet/${d.ma_don_vi}`,
                            {
                                thoi_gian_bat_dau: d.thoi_gian_bat_dau || null,
                                thoi_gian_ket_thuc:
                                    d.thoi_gian_ket_thuc || null,
                                dia_diem: d.dia_diem || null,
                            },
                        );
                    } else {
                        await api.post(
                            `/lich_kham_sk_nam/${schedule.ma_lich_kham}/chi-tiet`,
                            d,
                        );
                    }
                }
                for (const ct of existing) {
                    if (!newKeys.has(ct.ma_don_vi)) {
                        await api.delete(
                            `/lich_kham_sk_nam/${schedule.ma_lich_kham}/chi-tiet/${ct.ma_don_vi}`,
                        );
                    }
                }
            } else {
                const res = await api.post("/lich_kham_sk_nam", master);
                const ma_lich_kham = res.data?.ma_lich_kham;
                console.log("Master created:", res.data);
                if (!ma_lich_kham) {
                    setError("Không nhận được mã lịch khám từ server.");
                    setSaving(false);
                    return;
                }
                for (const d of details) {
                    console.log(
                        `Creating detail at /lich_kham_sk_nam/${ma_lich_kham}/chi-tiet:`,
                        d,
                    );
                    await api.post(
                        `/lich_kham_sk_nam/${ma_lich_kham}/chi-tiet`,
                        d,
                    );
                }
            }
            onSaved();
            onClose();
        } catch (err) {
            console.error(
                "Submit error:",
                err.response?.status,
                err.response?.data,
                err.message,
            );
            setError(
                err.response?.data?.detail ||
                    `Lỗi ${err.response?.status}: ${err.message}` ||
                    "Không thể lưu lịch khám.",
            );
        } finally {
            setSaving(false);
        }
    };

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
                        <Typography
                            color="error"
                            variant="body2"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Typography>
                    )}
                    <Stack spacing={1.5} sx={{ pt: 1 }}>
                        <Typography variant="h2">Thông tin chung</Typography>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <DateTimeInput
                                    label="Thời gian bắt đầu"
                                    value={master.thoi_gian_bat_dau}
                                    onChange={(v) =>
                                        setMaster((p) => ({
                                            ...p,
                                            thoi_gian_bat_dau: v,
                                        }))
                                    }
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <DateTimeInput
                                    label="Thời gian kết thúc"
                                    value={master.thoi_gian_ket_thuc}
                                    onChange={(v) =>
                                        setMaster((p) => ({
                                            ...p,
                                            thoi_gian_ket_thuc: v,
                                        }))
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
                            <Button
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={addDetail}
                            >
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
                                Chưa có đơn vị nào. Nhấn "Thêm đơn vị" để bắt
                                đầu.
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
