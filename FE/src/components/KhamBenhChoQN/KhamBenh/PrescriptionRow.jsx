import {
    forwardRef,
    memo,
    useCallback,
    useImperativeHandle,
    useState,
} from "react";
import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import FormTextField from "@/components/common/FormTextField.jsx";
import {
    THOI_DIEM_OPTIONS,
    CACH_SU_DUNG_OPTIONS,
} from "@/constants/khamBenhConstants.js";
import usePrescriptionRow from "@/hooks/usePrescriptionRow.js";

const getOptionLabel = (o) => o.label;

const SangTruaCachDungFields = memo(function SangTruaCachDungFields({
    sang,
    trua,
    toi,
    cachSuDung,
    thoiDiemDung,
    onSangChange,
    onTruaChange,
    onToiChange,
    onCachSuDungChange,
    onThoiDiemDungChange,
}) {
    const renderCachSuDung = useCallback(
        (params) => <TextField {...params} label="Cách sử dụng" />,
        [],
    );
    const renderThoiDiemDung = useCallback(
        (params) => <TextField {...params} label="Thời điểm dùng" />,
        [],
    );

    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <TextField
                    size="small"
                    label="Sáng"
                    type="number"
                    value={sang}
                    onChange={onSangChange}
                    sx={{ width: 100 }}
                    slotProps={{ min: 0 }}
                />
                <TextField
                    size="small"
                    label="Trưa"
                    type="number"
                    value={trua}
                    onChange={onTruaChange}
                    sx={{ width: 100 }}
                    slotProps={{ min: 0 }}
                />
                <TextField
                    size="small"
                    label="Tối"
                    type="number"
                    value={toi}
                    onChange={onToiChange}
                    sx={{ width: 100 }}
                    slotProps={{ min: 0 }}
                />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Autocomplete
                    size="small"
                    options={CACH_SU_DUNG_OPTIONS}
                    value={CACH_SU_DUNG_OPTIONS.find(
                        (o) => o.value === cachSuDung,
                    )}
                    onChange={onCachSuDungChange}
                    getOptionLabel={getOptionLabel}
                    renderInput={renderCachSuDung}
                    sx={{ width: 180 }}
                    fullWidth
                />
                <Autocomplete
                    size="small"
                    options={THOI_DIEM_OPTIONS}
                    value={THOI_DIEM_OPTIONS.find(
                        (o) => o.value === thoiDiemDung,
                    )}
                    onChange={onThoiDiemDungChange}
                    getOptionLabel={getOptionLabel}
                    renderInput={renderThoiDiemDung}
                    sx={{ width: 200 }}
                    fullWidth
                />
            </Stack>
        </Stack>
    );
});

const GhiChuField = memo(function GhiChuField({
    ghiChu: initialGhiChu,
    onGhiChuChange,
}) {
    const [initialValue] = useState(initialGhiChu);
    return (
        <FormTextField
            name="ghi_chu"
            initialValue={initialValue}
            onUpdateRef={onGhiChuChange}
            size="small"
            label="Ghi chú"
            sx={{ flex: 1, minWidth: 200 }}
        />
    );
});

const PrescriptionRow = memo(
    forwardRef(function PrescriptionRow(
        { rowKey, initialData, onRemove },
        ref,
    ) {
        const {
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

        const handleRemoveClick = useCallback(
            () => onRemove(rowKey),
            [onRemove, rowKey],
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
                        slotProps={{ htmlInput: { min: 1, max: soLuongMax } }}
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
                    <ActionIcon
                        title="Xoá"
                        icon={<DeleteIcon />}
                        color="error"
                        onClick={handleRemoveClick}
                    />
                </Stack>

                <SangTruaCachDungFields
                    sang={sang}
                    trua={trua}
                    toi={toi}
                    cachSuDung={cachSuDung}
                    thoiDiemDung={thoiDiemDung}
                    onSangChange={handleSangChange}
                    onTruaChange={handleTruaChange}
                    onToiChange={handleToiChange}
                    onCachSuDungChange={handleCachSuDungChange}
                    onThoiDiemDungChange={handleThoiDiemDungChange}
                />

                {exceedWarning && (
                    <Typography color="error" variant="caption">
                        Tổng liều ({sang + trua + toi}) vượt quá số lượng thuốc
                        ({soLuong})
                    </Typography>
                )}

                <GhiChuField
                    ghiChu={ghiChu}
                    onGhiChuChange={handleGhiChuChange}
                />
            </Stack>
        );
    }),
);

export default PrescriptionRow;
