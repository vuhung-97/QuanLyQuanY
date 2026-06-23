import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useState } from "react";
import {
    Autocomplete, Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import useLapLichDialog from "@/hooks/useLapLichDialog";
import ChonNgayGio from "./ChonNgayGio.jsx";

const getUnitOptionLabel = (o) => `${o.ma_don_vi} - ${o.ten_don_vi}`;
const isUnitOptionEqual = (o, v) => o.ma_don_vi === v.ma_don_vi;
const renderUnitInput = (params) => <TextField {...params} label="Chọn đơn vị" />;

const DetailItem = memo(forwardRef(function DetailItem({
    initialData, unitOptions, onRemove, minDate, maxDate,
}, ref) {
    const [maDonVi, setMaDonVi] = useState(initialData?.ma_don_vi ?? "");
    const [thoiGianBatDau, setThoiGianBatDau] = useState(initialData?.thoi_gian_bat_dau ?? "");
    const [thoiGianKetThuc, setThoiGianKetThuc] = useState(initialData?.thoi_gian_ket_thuc ?? "");
    const [diaDiem, setDiaDiem] = useState(initialData?.dia_diem ?? "");

    useImperativeHandle(ref, () => ({
        getData: () => ({
            ma_don_vi: maDonVi,
            thoi_gian_bat_dau: thoiGianBatDau,
            thoi_gian_ket_thuc: thoiGianKetThuc,
            dia_diem: diaDiem,
        }),
    }), [maDonVi, thoiGianBatDau, thoiGianKetThuc, diaDiem]);

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
                    Đơn vị
                </Typography>
                <IconButton
                    size="small"
                    color="error"
                    onClick={onRemove}
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
                            (o) => o.ma_don_vi === maDonVi,
                        ) || null
                    }
                    onChange={(_, newVal) =>
                        setMaDonVi(newVal ? newVal.ma_don_vi : "")
                    }
                    renderInput={renderUnitInput}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <ChonNgayGio
                            label="Bắt đầu"
                            value={thoiGianBatDau}
                            onChange={setThoiGianBatDau}
                            minDate={minDate}
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <ChonNgayGio
                            label="Kết thúc"
                            value={thoiGianKetThuc}
                            onChange={setThoiGianKetThuc}
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
                    value={diaDiem}
                    onChange={(e) => setDiaDiem(e.target.value)}
                />
            </Stack>
        </Box>
    );
}));

const ROLE_LABELS = {
    tong_quan: "Tổng quan",
    lam_sang: "Lâm sàng",
    xet_nghiem: "Xét nghiệm",
    chan_doan_hinh_anh: "Chẩn đoán hình ảnh",
    ket_luan: "Kết luận",
};

export default function LapLichDialog({
    open,
    onClose,
    onSaved,
    schedule,
    chiTietList,
}) {
    const {
        thoiGianBatDau,
        setThoiGianBatDau,
        thoiGianKetThuc,
        setThoiGianKetThuc,
        rowKeys,
        rowRefs,
        saving,
        error,
        unitOptions,
        isEdit,
        addDetail,
        removeDetail,
        handleSubmit,
        users,
        vaiTroList,
        assignments,
        handleAssignmentChange,
    } = useLapLichDialog({ open, schedule, chiTietList, onSaved, onClose });

    const getInitialData = useCallback(
        (key) => {
            if (!chiTietList?.length) return null;
            const idx = rowKeys.findIndex((r) => r.key === key);
            return chiTietList[idx] || null;
        },
        [chiTietList, rowKeys],
    );

    // Sắp xếp user theo vai trò hệ thống
    const sortedUsers = useMemo(() => {
        const roleOrder = { ROLE_ADMIN: 0, ROLE_CNQY: 1, ROLE_BACSI: 2, ROLE_YSI: 3 };
        return [...users].sort((a, b) => {
            const ra = roleOrder[a.id_vai_tro] ?? 99;
            const rb = roleOrder[b.id_vai_tro] ?? 99;
            return ra - rb || a.ho_ten.localeCompare(b.ho_ten);
        });
    }, [users]);

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
                                <ChonNgayGio
                                    label="Thời gian bắt đầu"
                                    value={thoiGianBatDau}
                                    onChange={setThoiGianBatDau}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <ChonNgayGio
                                    label="Thời gian kết thúc"
                                    value={thoiGianKetThuc}
                                    onChange={setThoiGianKetThuc}
                                />
                            </Box>
                        </Stack>

                        <Typography variant="h2" sx={{ mt: 2 }}>
                            Phân công nhiệm vụ
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Họ tên</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Vai trò hệ thống</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Vai trò tạm thời</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedUsers.map((u, idx) => (
                                        <TableRow key={u.id}>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{u.ho_ten}</TableCell>
                                            <TableCell>{u.ten_vai_tro || u.id_vai_tro}</TableCell>
                                            <TableCell>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        value={assignments[u.id] ?? ""}
                                                        onChange={(e) =>
                                                            handleAssignmentChange(u.id, e.target.value)
                                                        }
                                                        displayEmpty
                                                        renderValue={(v) =>
                                                            v ? (ROLE_LABELS[v] || v) : ""
                                                        }
                                                    >
                                                        <MenuItem value="">
                                                            <em>-- Không --</em>
                                                        </MenuItem>
                                                        {vaiTroList.map((vt) => (
                                                            <MenuItem key={vt.ma_vai_tro} value={vt.ma_vai_tro}>
                                                                {vt.ten_vai_tro}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

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

                        {rowKeys.map(({ key }) => (
                            <DetailItem
                                key={key}
                                ref={(el) => {
                                    if (el) rowRefs.current.set(key, el);
                                    else rowRefs.current.delete(key);
                                }}
                                initialData={getInitialData(key)}
                                unitOptions={unitOptions}
                                onRemove={() => removeDetail(key)}
                                minDate={thoiGianBatDau || undefined}
                                maxDate={thoiGianKetThuc || undefined}
                            />
                        ))}

                        {rowKeys.length === 0 && (
                            <Typography
                                color="text.secondary"
                                sx={{ textAlign: "center", py: 2 }}
                            >
                                Chưa có đơn vị nào. Nhấn "Thêm đơn vị" để bắt đầu.
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
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
