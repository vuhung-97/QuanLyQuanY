import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
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
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.jsx";
import useLapLichDialog from "@/hooks/useLapLichDialog";
import DataTable from "@/components/common/DataTable.jsx";
import ChonNgayGio from "./ChonNgayGio.jsx";
import { ROLE_LABELS, roleOrder } from "@/constants/khamSucKhoeConstants.js";

function DiaDiemCell({ maDonVi, value, onChange, disabled }) {
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
            disabled={disabled}
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
    unitOptions,
    readOnly = false,
}) {
    const {
        thoiGianBatDau,
        setThoiGianBatDau,
        thoiGianKetThuc,
        setThoiGianKetThuc,
        thoiGianLayMauBatDau,
        setThoiGianLayMauBatDau,
        thoiGianLayMauKetThuc,
        setThoiGianLayMauKetThuc,
        thoiGianDuTruLayMauBatDau,
        setThoiGianDuTruLayMauBatDau,
        thoiGianDuTruLayMauKetThuc,
        setThoiGianDuTruLayMauKetThuc,
        thoiGianDuTruKhamBatDau,
        setThoiGianDuTruKhamBatDau,
        thoiGianDuTruKhamKetThuc,
        setThoiGianDuTruKhamKetThuc,
        saving,
        snackbar,
        handleCloseSnackbar,
        isEdit,
        handleSubmit,
        users,
        vaiTroList,
        assignments,
        handleAssignmentChange,
        detailData,
        handleDetailChange,
        selectedUnits,
        handleToggleUnit,
        confirmOpen,
        confirmMessage,
        handleConfirmSave,
        handleCloseConfirm,
        timeErrors,
        detailErrors,
        handleAutoDistribute,
    } = useLapLichDialog({
        open,
        schedule,
        chiTietList,
        onSaved,
        onClose,
        unitOptions,
    });

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
                            disabled={readOnly}
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

    const checked = (maDonVi) => !!selectedUnits[maDonVi];

    const lichKhamColumns = useMemo(
        () => [
            {
                key: "chon",
                label: "Chọn",
                sx: { width: "3%" },
                render: (r) => (
                    <Checkbox
                        checked={checked(r.ma_don_vi)}
                        onChange={() => handleToggleUnit(r.ma_don_vi)}
                        disabled={readOnly}
                    />
                ),
            },
            {
                key: "ten_don_vi",
                label: "Tên đơn vị",
                sx: { fontWeight: 600, width: "8%" },
            },
            { key: "tong_quan_so", label: "Quân số", sx: { width: "4%" } },
            {
                key: "thoi_gian_chinh",
                label: "Thời gian chính",
                sx: { width: "36%" },
                render: (r) => {
                    if (!checked(r.ma_don_vi)) return null;
                    const d = detailData[r.ma_don_vi] || {};
                    const errs = detailErrors[r.ma_don_vi] || {};
                    return (
                        <Stack spacing={1} sx={{ py: 1 }}>
                            <ChonNgayGio
                                label="Lấy máu - bắt đầu"
                                value={d.thoi_gian_lay_mau_bat_dau || ""}
                                onChange={(v) =>
                                    handleDetailChange(
                                        r.ma_don_vi,
                                        "thoi_gian_lay_mau_bat_dau",
                                        v,
                                    )
                                }
                                disabled={readOnly}
                                defaultTime="06:00"
                                error={Boolean(errs.thoi_gian_lay_mau_bat_dau)}
                                errorMessage={errs.thoi_gian_lay_mau_bat_dau}
                            />
                            <ChonNgayGio
                                label="Lấy máu - kết thúc"
                                value={d.thoi_gian_lay_mau_ket_thuc || ""}
                                onChange={(v) =>
                                    handleDetailChange(
                                        r.ma_don_vi,
                                        "thoi_gian_lay_mau_ket_thuc",
                                        v,
                                    )
                                }
                                disabled={readOnly}
                                defaultTime="17:00"
                                error={Boolean(errs.thoi_gian_lay_mau_ket_thuc)}
                                errorMessage={errs.thoi_gian_lay_mau_ket_thuc}
                            />
                            <ChonNgayGio
                                label="Khám - bắt đầu"
                                value={d.thoi_gian_bat_dau || ""}
                                onChange={(v) =>
                                    handleDetailChange(
                                        r.ma_don_vi,
                                        "thoi_gian_bat_dau",
                                        v,
                                    )
                                }
                                disabled={readOnly}
                                defaultTime="06:00"
                                error={Boolean(errs.thoi_gian_bat_dau)}
                                errorMessage={errs.thoi_gian_bat_dau}
                            />
                            <ChonNgayGio
                                label="Khám - kết thúc"
                                value={d.thoi_gian_ket_thuc || ""}
                                onChange={(v) =>
                                    handleDetailChange(
                                        r.ma_don_vi,
                                        "thoi_gian_ket_thuc",
                                        v,
                                    )
                                }
                                disabled={readOnly}
                                defaultTime="17:00"
                                error={Boolean(errs.thoi_gian_ket_thuc)}
                                errorMessage={errs.thoi_gian_ket_thuc}
                            />
                        </Stack>
                    );
                },
            },
            {
                key: "thoi_gian_du_tru",
                label: "Thời gian dự trù",
                sx: { width: "36%" },
                render: (r) => {
                    if (!checked(r.ma_don_vi)) return null;
                    const d = detailData[r.ma_don_vi] || {};
                    const errs = detailErrors[r.ma_don_vi] || {};
                    return (
                        <Stack spacing={1} sx={{ py: 1 }}>
                            <ChonNgayGio
                                label="Dự trù lấy máu - bắt đầu"
                                value={d.thoi_gian_du_tru_lay_mau_bat_dau || ""}
                                onChange={(v) =>
                                    handleDetailChange(
                                        r.ma_don_vi,
                                        "thoi_gian_du_tru_lay_mau_bat_dau",
                                        v,
                                    )
                                }
                                disabled={readOnly}
                                defaultTime="06:00"
                                error={Boolean(
                                    errs.thoi_gian_du_tru_lay_mau_bat_dau,
                                )}
                                errorMessage={
                                    errs.thoi_gian_du_tru_lay_mau_bat_dau
                                }
                            />
                            <ChonNgayGio
                                label="Dự trù lấy máu - kết thúc"
                                value={
                                    d.thoi_gian_du_tru_lay_mau_ket_thuc || ""
                                }
                                onChange={(v) =>
                                    handleDetailChange(
                                        r.ma_don_vi,
                                        "thoi_gian_du_tru_lay_mau_ket_thuc",
                                        v,
                                    )
                                }
                                disabled={readOnly}
                                defaultTime="17:00"
                                error={Boolean(
                                    errs.thoi_gian_du_tru_lay_mau_ket_thuc,
                                )}
                                errorMessage={
                                    errs.thoi_gian_du_tru_lay_mau_ket_thuc
                                }
                            />
                            <ChonNgayGio
                                label="Dự trù khám - bắt đầu"
                                value={d.thoi_gian_du_tru_kham_bat_dau || ""}
                                onChange={(v) =>
                                    handleDetailChange(
                                        r.ma_don_vi,
                                        "thoi_gian_du_tru_kham_bat_dau",
                                        v,
                                    )
                                }
                                disabled={readOnly}
                                defaultTime="06:00"
                                error={Boolean(
                                    errs.thoi_gian_du_tru_kham_bat_dau,
                                )}
                                errorMessage={
                                    errs.thoi_gian_du_tru_kham_bat_dau
                                }
                            />
                            <ChonNgayGio
                                label="Dự trù khám - kết thúc"
                                value={d.thoi_gian_du_tru_kham_ket_thuc || ""}
                                onChange={(v) =>
                                    handleDetailChange(
                                        r.ma_don_vi,
                                        "thoi_gian_du_tru_kham_ket_thuc",
                                        v,
                                    )
                                }
                                disabled={readOnly}
                                defaultTime="17:00"
                                error={Boolean(
                                    errs.thoi_gian_du_tru_kham_ket_thuc,
                                )}
                                errorMessage={
                                    errs.thoi_gian_du_tru_kham_ket_thuc
                                }
                            />
                        </Stack>
                    );
                },
            },
            {
                key: "dia_diem",
                label: "Địa điểm",
                sx: { width: "13%" },
                render: (r) => {
                    if (!checked(r.ma_don_vi)) return null;
                    const d = detailData[r.ma_don_vi] || {};
                    return (
                        <DiaDiemCell
                            maDonVi={r.ma_don_vi}
                            value={d.dia_diem || ""}
                            onChange={handleDetailChange}
                            disabled={readOnly}
                        />
                    );
                },
            },
        ],
        [
            detailData,
            handleDetailChange,
            selectedUnits,
            handleToggleUnit,
            readOnly,
        ],
    );

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth={false}
                sx={{
                    "& .MuiDialog-paper": {
                        width: "80vw",
                        maxWidth: "80vw",
                        height: "90vh",
                        m: "auto",
                    },
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                    }}
                >
                    <DialogTitleWrapper wrap={false}>
                        {readOnly
                            ? "Xem lịch khám sức khỏe định kỳ"
                            : isEdit
                              ? "Sửa lịch khám sức khỏe định kỳ"
                              : "Tạo lịch khám sức khỏe định kỳ"}
                    </DialogTitleWrapper>
                    <DialogContent dividers sx={{ overflow: "auto" }}>
                        <Stack spacing={1.5} sx={{ pt: 1 }}>
                            <Typography variant="h4">
                                Thông tin chung
                            </Typography>

                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, mt: 1 }}
                            >
                                Thời gian chính
                            </Typography>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                            >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <ChonNgayGio
                                        label="Thời gian lấy máu - bắt đầu"
                                        value={thoiGianLayMauBatDau}
                                        onChange={setThoiGianLayMauBatDau}
                                        disabled={readOnly}
                                        defaultTime="06:00"
                                        error={Boolean(
                                            timeErrors.thoi_gian_lay_mau_bat_dau,
                                        )}
                                        errorMessage={
                                            timeErrors.thoi_gian_lay_mau_bat_dau
                                        }
                                    />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <ChonNgayGio
                                        label="Thời gian lấy máu - kết thúc"
                                        value={thoiGianLayMauKetThuc}
                                        onChange={setThoiGianLayMauKetThuc}
                                        disabled={readOnly}
                                        defaultTime="17:00"
                                        error={Boolean(
                                            timeErrors.thoi_gian_lay_mau_ket_thuc,
                                        )}
                                        errorMessage={
                                            timeErrors.thoi_gian_lay_mau_ket_thuc
                                        }
                                    />
                                </Box>
                            </Stack>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                sx={{ mt: 1 }}
                            >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <ChonNgayGio
                                        label="Thời gian khám - bắt đầu"
                                        value={thoiGianBatDau}
                                        onChange={setThoiGianBatDau}
                                        disabled={readOnly}
                                        defaultTime="06:00"
                                        error={Boolean(
                                            timeErrors.thoi_gian_bat_dau,
                                        )}
                                        errorMessage={
                                            timeErrors.thoi_gian_bat_dau
                                        }
                                    />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <ChonNgayGio
                                        label="Thời gian khám - kết thúc"
                                        value={thoiGianKetThuc}
                                        onChange={setThoiGianKetThuc}
                                        disabled={readOnly}
                                        defaultTime="17:00"
                                        error={Boolean(
                                            timeErrors.thoi_gian_ket_thuc,
                                        )}
                                        errorMessage={
                                            timeErrors.thoi_gian_ket_thuc
                                        }
                                    />
                                </Box>
                            </Stack>

                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, mt: 2 }}
                            >
                                Thời gian dự trù
                            </Typography>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                            >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <ChonNgayGio
                                        label="Dự trù lấy máu - bắt đầu"
                                        value={thoiGianDuTruLayMauBatDau}
                                        onChange={setThoiGianDuTruLayMauBatDau}
                                        disabled={readOnly}
                                        defaultTime="06:00"
                                        error={Boolean(
                                            timeErrors.thoi_gian_du_tru_lay_mau_bat_dau,
                                        )}
                                        errorMessage={
                                            timeErrors.thoi_gian_du_tru_lay_mau_bat_dau
                                        }
                                    />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <ChonNgayGio
                                        label="Dự trù lấy máu - kết thúc"
                                        value={thoiGianDuTruLayMauKetThuc}
                                        onChange={setThoiGianDuTruLayMauKetThuc}
                                        disabled={readOnly}
                                        defaultTime="17:00"
                                        error={Boolean(
                                            timeErrors.thoi_gian_du_tru_lay_mau_ket_thuc,
                                        )}
                                        errorMessage={
                                            timeErrors.thoi_gian_du_tru_lay_mau_ket_thuc
                                        }
                                    />
                                </Box>
                            </Stack>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                sx={{ mt: 1 }}
                            >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <ChonNgayGio
                                        label="Dự trù khám sức khỏe - bắt đầu"
                                        value={thoiGianDuTruKhamBatDau}
                                        onChange={setThoiGianDuTruKhamBatDau}
                                        disabled={readOnly}
                                        defaultTime="06:00"
                                        error={Boolean(
                                            timeErrors.thoi_gian_du_tru_kham_bat_dau,
                                        )}
                                        errorMessage={
                                            timeErrors.thoi_gian_du_tru_kham_bat_dau
                                        }
                                    />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <ChonNgayGio
                                        label="Dự trù khám sức khỏe - kết thúc"
                                        value={thoiGianDuTruKhamKetThuc}
                                        onChange={setThoiGianDuTruKhamKetThuc}
                                        disabled={readOnly}
                                        defaultTime="17:00"
                                        error={Boolean(
                                            timeErrors.thoi_gian_du_tru_kham_ket_thuc,
                                        )}
                                        errorMessage={
                                            timeErrors.thoi_gian_du_tru_kham_ket_thuc
                                        }
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

                            <Stack
                                direction="row"
                                sx={{
                                    mt: 2,
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="h4">
                                    Lịch khám theo đơn vị
                                </Typography>
                                {!readOnly && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleAutoDistribute}
                                        disabled={
                                            Object.keys(selectedUnits).filter(
                                                (k) => selectedUnits[k],
                                            ).length === 0
                                        }
                                    >
                                        Tự động phân chia
                                    </Button>
                                )}
                            </Stack>
                            <DataTable
                                columns={lichKhamColumns}
                                rows={unitOptions}
                                getRowKey={(r) => r.ma_don_vi}
                                minWidth={1400}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={onClose}>
                            {readOnly ? "Đóng" : "Hủy"}
                        </Button>
                        {!readOnly && (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                            >
                                {saving
                                    ? "Đang lưu..."
                                    : isEdit
                                      ? "Cập nhật"
                                      : "Lưu lịch khám"}
                            </Button>
                        )}
                    </DialogActions>
                </Box>
            </Dialog>

            <ConfirmDialog
                open={confirmOpen}
                title="Lịch chưa đầy đủ"
                message={confirmMessage}
                confirmLabel="Vẫn lưu"
                confirmColor="warning"
                onConfirm={handleConfirmSave}
                onClose={handleCloseConfirm}
            />

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </>
    );
}
