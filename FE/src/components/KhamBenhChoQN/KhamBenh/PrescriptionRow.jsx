import { forwardRef, memo, useCallback, useImperativeHandle } from "react";
import {
    Autocomplete,
    Box,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import FormTextField from "@/components/common/FormTextField.jsx";
import {
    THOI_DIEM_OPTIONS,
    CACH_SU_DUNG_OPTIONS,
} from "@/constants/khamBenhConstants.js";
import usePrescriptionRow from "@/hooks/usePrescriptionRow.js";

const getOptionLabel = (o) => o.label;

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
            handleGhiChuChange,
            handleCachSuDungChange,
            handleThoiDiemDungChange,
            handleSoLuongChange,
            handleSangChange,
            handleTruaChange,
            handleToiChange,
            getData,
            exceedWarning,
        } = usePrescriptionRow(initialData);

        useImperativeHandle(ref, () => ({ getData }), [getData]);

        const renderCachSuDung = useCallback(
            (params) => <TextField {...params} label="Cách sử dụng" />,
            [],
        );
        const renderThoiDiemDung = useCallback(
            (params) => <TextField {...params} label="Thời điểm dùng" />,
            [],
        );

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
                    <ActionIcon title="Xoá" icon={<DeleteIcon />} color="error" onClick={onRemove} />
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
                        onChange={handleCachSuDungChange}
                        getOptionLabel={getOptionLabel}
                        renderInput={renderCachSuDung}
                        sx={{ minWidth: 150 }}
                    />
                    <Autocomplete
                        size="small"
                        options={THOI_DIEM_OPTIONS}
                        value={THOI_DIEM_OPTIONS.find(
                            (o) => o.value === thoiDiemDung,
                        )}
                        onChange={handleThoiDiemDungChange}
                        getOptionLabel={getOptionLabel}
                        renderInput={renderThoiDiemDung}
                        sx={{ minWidth: 200 }}
                    />
                    <FormTextField
                        name="ghi_chu"
                        initialValue={ghiChu}
                        onUpdateRef={handleGhiChuChange}
                        size="small"
                        label="Ghi chú"
                        sx={{ flex: 1, minWidth: 200 }}
                    />
                </Stack>
            </Stack>
        );
    }),
);

export default PrescriptionRow;
