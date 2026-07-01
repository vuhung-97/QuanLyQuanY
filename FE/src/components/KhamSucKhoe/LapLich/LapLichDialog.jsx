import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    MenuItem,
    Select,
    Stack,
    Divider,
    TextField,
    Typography,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import useLapLichDialog from "@/hooks/useLapLichDialog";
import DataTable from "@/components/common/DataTable.jsx";
import ChonNgayGio from "./ChonNgayGio.jsx";
import { ROLE_LABELS, roleOrder } from "@/constants/khamSucKhoeConstants.js";

function DiaDiemCell({ maDonVi, value, onChange }) {
    const [local, setLocal] = useState(value || "");
    useEffect(() => {
        setLocal(value || "");
    }, [value]);
    return (
        <TextField
            size="small"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onBlur={() => onChange(maDonVi, "dia_diem", local)}
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: "0.8rem" } }}
        />
    );
}

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
        saving,
        error,
        unitOptions,
        isEdit,
        handleSubmit,
        users,
        vaiTroList,
        assignments,
        handleAssignmentChange,
        detailData,
        handleDetailChange,
    } = useLapLichDialog({ open, schedule, chiTietList, onSaved, onClose });

    const sortedUsers = useMemo(
        () =>
            [...users].sort((a, b) => {
                const ra = roleOrder[a.id_vai_tro] ?? 99;
                const rb = roleOrder[b.id_vai_tro] ?? 99;
                return ra - rb || a.ho_ten.localeCompare(b.ho_ten);
            }),
        [users],
    );

    const phanCongColumns = useMemo(
        () => [
            {
                key: "stt",
                label: "STT",
                sx: { width: "5%" },
                render: (_, idx) => idx + 1,
            },
            { key: "ho_ten", label: "Họ tên", sx: { width: "35%" } },
            {
                key: "vai_tro",
                label: "Vai trò hệ thống",
                sx: { width: "25%" },
                render: (r) => r.ten_vai_tro || r.id_vai_tro,
            },
            {
                key: "phan_cong",
                label: "Vai trò tạm thời",
                sx: { width: "35%" },
                render: (r) => (
                    <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
                        <Select
                            value={assignments[r.id] ?? ""}
                            onChange={(e) =>
                                handleAssignmentChange(r.id, e.target.value)
                            }
                            displayEmpty
                            renderValue={(v) => (v ? ROLE_LABELS[v] || v : "")}
                        >
                            <MenuItem value="">
                                <em>-- Không --</em>
                            </MenuItem>
                            {vaiTroList.map((vt) => (
                                <MenuItem
                                    key={vt.ma_vai_tro}
                                    value={vt.ma_vai_tro}
                                >
                                    {vt.ten_vai_tro}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ),
            },
        ],
        [assignments, vaiTroList, handleAssignmentChange],
    );

    const lichKhamColumns = useMemo(
        () => [
            {
                key: "ten_don_vi",
                label: "Tên đơn vị",
                sx: { fontWeight: 600, width: "15%" },
            },
            { key: "tong_quan_so", label: "Quân số", sx: { width: "10%" } },
            {
                key: "bat_dau",
                label: "Thời gian bắt đầu",
                sx: { width: "20%" },
                render: (r) => {
                    const d = detailData[r.ma_don_vi] || {};
                    return (
                        <ChonNgayGio
                            column
                            value={d.thoi_gian_bat_dau || ""}
                            onChange={(v) =>
                                handleDetailChange(
                                    r.ma_don_vi,
                                    "thoi_gian_bat_dau",
                                    v,
                                )
                            }
                        />
                    );
                },
            },
            {
                key: "ket_thuc",
                label: "Thời gian kết thúc",
                sx: { width: "20%" },
                render: (r) => {
                    const d = detailData[r.ma_don_vi] || {};
                    return (
                        <ChonNgayGio
                            column
                            value={d.thoi_gian_ket_thuc || ""}
                            onChange={(v) =>
                                handleDetailChange(
                                    r.ma_don_vi,
                                    "thoi_gian_ket_thuc",
                                    v,
                                )
                            }
                        />
                    );
                },
            },
            {
                key: "dia_diem",
                label: "Địa điểm",
                sx: { width: "35%" },
                render: (r) => {
                    const d = detailData[r.ma_don_vi] || {};
                    return (
                        <DiaDiemCell
                            maDonVi={r.ma_don_vi}
                            value={d.dia_diem || ""}
                            onChange={handleDetailChange}
                        />
                    );
                },
            },
        ],
        [detailData, handleDetailChange],
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={false}
            sx={{ width: "70vw", height: "90vh", m: "auto" }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitleWrapper wrap={false}>
                    {isEdit
                        ? "Sửa lịch khám sức khỏe định kỳ"
                        : "Tạo lịch khám sức khỏe định kỳ"}
                </DialogTitleWrapper>
                <DialogContent dividers sx={{ overflow: "auto" }}>
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
                        <Typography variant="h4">Thông tin chung</Typography>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                        >
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

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h4" sx={{ mt: 2 }}>
                            Phân công nhiệm vụ
                        </Typography>
                        <DataTable
                            columns={phanCongColumns}
                            rows={sortedUsers}
                            getRowKey={(r) => r.id}
                            minWidth={undefined}
                        />

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h4" sx={{ mt: 2 }}>
                            Lịch khám theo đơn vị
                        </Typography>
                        <DataTable
                            columns={lichKhamColumns}
                            rows={unitOptions}
                            getRowKey={(r) => r.ma_don_vi}
                            minWidth={undefined}
                        />
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
