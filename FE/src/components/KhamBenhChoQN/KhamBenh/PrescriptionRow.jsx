import { forwardRef, memo, useImperativeHandle } from "react";
import {
    Autocomplete,
    Box,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
    THOI_DIEM_OPTIONS,
    CACH_SU_DUNG_OPTIONS,
} from "@/constants/khamBenhConstants.js";
import usePrescriptionRow from "@/hooks/usePrescriptionRow.js";

const PrescriptionRow = memo(
    forwardRef(function PrescriptionRow({ initialData, onRemove }, ref) {
        const {
            maThuoc,
            tenThuoc,
            donViTinh,
            soLuong,
            soLuongMax,
            sang,
            trua,
            toi,
            thoiDiemDung,
            cachSuDung,
            ghiChu,
            setThoiDiemDung,
            setCachSuDung,
            setGhiChu,
            handleSoLuongChange,
            handleSangChange,
            handleTruaChange,
            handleToiChange,
            getData,
            exceedWarning,
        } = usePrescriptionRow(initialData);

        useImperativeHandle(ref, () => ({ getData }), [getData]);

        return (
            <Stack
                spacing={1.5}
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
                    sx={{ alignItems: "center" }}
                >
                    <Box sx={{ flex: 2, minWidth: 0 }}>
                        <TextField
                            size="small"
                            label="Tên thuốc"
                            value={tenThuoc}
                            slotProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Box>
                    <TextField
                        size="small"
                        label={
                            soLuongMax !== Infinity
                                ? `SL (tồn: ${soLuongMax})`
                                : "Số lượng"
                        }
                        type="number"
                        value={soLuong}
                        onChange={handleSoLuongChange}
                        sx={{ width: 130 }}
                        slotProps={{
                            htmlInput: { min: 1, max: soLuongMax },
                        }}
                    />
                    {donViTinh && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ minWidth: 50, alignSelf: "center" }}
                        >
                            ({donViTinh})
                        </Typography>
                    )}
                    <IconButton size="small" color="error" onClick={onRemove}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                >
                    <TextField
                        size="small"
                        label="Sáng"
                        type="number"
                        value={sang}
                        onChange={handleSangChange}
                        sx={{ width: 80 }}
                        slotProps={{ min: 0 }}
                    />
                    <TextField
                        size="small"
                        label="Trưa"
                        type="number"
                        value={trua}
                        onChange={handleTruaChange}
                        sx={{ width: 80 }}
                        slotProps={{ min: 0 }}
                    />
                    <TextField
                        size="small"
                        label="Tối"
                        type="number"
                        value={toi}
                        onChange={handleToiChange}
                        sx={{ width: 80 }}
                        slotProps={{ min: 0 }}
                    />
                </Stack>
                {exceedWarning && (
                    <Typography color="error" variant="caption">
                        Tổng liều ({sang + trua + toi}) vượt quá số lượng thuốc
                        ({soLuong})
                    </Typography>
                )}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                >
                    <Autocomplete
                        size="small"
                        options={CACH_SU_DUNG_OPTIONS}
                        value={CACH_SU_DUNG_OPTIONS.find(
                            (o) => o.value === cachSuDung,
                        )}
                        onChange={(_, v) =>
                            setCachSuDung(v?.value || "uong")
                        }
                        getOptionLabel={(o) => o.label}
                        renderInput={(params) => (
                            <TextField {...params} label="Cách sử dụng" />
                        )}
                        sx={{ minWidth: 150 }}
                    />
                    <Autocomplete
                        size="small"
                        options={THOI_DIEM_OPTIONS}
                        value={THOI_DIEM_OPTIONS.find(
                            (o) => o.value === thoiDiemDung,
                        )}
                        onChange={(_, v) =>
                            setThoiDiemDung(v?.value || "sau_an")
                        }
                        getOptionLabel={(o) => o.label}
                        renderInput={(params) => (
                            <TextField {...params} label="Thời điểm dùng" />
                        )}
                        sx={{ minWidth: 200 }}
                    />
                    <TextField
                        size="small"
                        label="Ghi chú"
                        value={ghiChu}
                        onChange={(e) => setGhiChu(e.target.value)}
                        sx={{ flex: 1, minWidth: 200 }}
                    />
                </Stack>
            </Stack>
        );
    }),
);

export default PrescriptionRow;
