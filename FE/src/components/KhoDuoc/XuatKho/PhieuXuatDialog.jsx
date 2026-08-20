import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    Box,
} from "@mui/material";
import { Print as PrintIcon, Replay as ReplayIcon, Send as SendIcon } from "@mui/icons-material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import ChonQuanNhanDialog from "@/components/common/ChonQuanNhanDialog.jsx";
import KhoThuocDialog from "@/components/KhamBenhChoQN/KhamBenh/KhoThuocDialog.jsx";
import { useCallback, useMemo } from "react";
import usePhieuXuat from "@/hooks/usePhieuXuat.js";
import { PRINT_STYLES, PRINT_DIALOG_CONTENT_SX, triggerPrint, toFileDate } from "@/utils/printUtils.js";
import PhieuXuatForm from "./PhieuXuatForm.jsx";
import ChiTietXuatTable from "./ChiTietXuatTable.jsx";
import PhieuXuatPrint from "./PhieuXuatPrint.jsx";

export default function PhieuXuatDialog({
    open,
    onClose,
    onSaved,
    phieuId = null,
    mode = "create",
    onXuatBuCreated,
}) {
    const {
        donViNhan,
        setDonViNhan,
        maQuanNhanNhan,
        hoTenNguoiNhan,
        ngayXuat,
        setNgayXuat,
        lyDoXuat,
        ghiChu,
        updateField,
        donViFlat,
        selectedItems,
        creatorName,
        trangThai,
        ngayXuatThuc,
        tenDonViNhan,
        capBac,
        chucVu,
        qnTenDonVi,
        saving,
        snackbar,
        setSnackbar,
        isView,
        currentUser,
        isCreatorOrAuthorized,
        openChonQN,
        setOpenChonQN,
        openKhoThuoc,
        setOpenKhoThuoc,
        handleAddFromKhoThuoc,
        handleChonQuanNhan,
        removeItem,
        handleUpdateQuantity,
        handleUpdateThucXuat,
        handleSave,
        handleXuatKho,
        handleXuatBu,
    } = usePhieuXuat({ open, phieuId, mode, onClose, onSaved, onXuatBuCreated });

    const handleOpenKhoThuoc = useCallback(() => setOpenKhoThuoc(true), []);

    const canXuatBu = useMemo(
        () =>
            trangThai === "da_xuat" &&
            selectedItems.some(
                (it) => (it.so_luong_thuc_xuat ?? it.so_luong) < it.so_luong,
            ),
        [trangThai, selectedItems],
    );

    return (
        <>
            <style>{PRINT_STYLES}</style>
            <Dialog
                open={open}
                onClose={saving ? undefined : onClose}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: {
                            "@media print": { maxWidth: "100% !important" },
                        },
                    },
                }}
            >
                <DialogTitleWrapper
                    sx={{ "@media print": { display: "none" } }}
                >
                    {mode === "create"
                        ? "Tạo phiếu xuất kho"
                        : mode === "edit"
                          ? "Sửa phiếu xuất kho"
                          : "Chi tiết phiếu xuất kho"}
                </DialogTitleWrapper>
                <DialogContent
                    dividers
                    sx={{
                        pt: 1,
                        px: 3,
                        ...PRINT_DIALOG_CONTENT_SX,
                    }}
                >
                    <Box sx={{ "@media print": { display: "none" } }}>
                        <PhieuXuatForm
                            donViFlat={donViFlat}
                            donViNhan={donViNhan}
                            onDonViNhanChange={setDonViNhan}
                            isView={isView}
                            hoTenNguoiNhan={hoTenNguoiNhan}
                            maQuanNhanNhan={maQuanNhanNhan}
                            onChonQN={() => setOpenChonQN(true)}
                            creatorName={creatorName}
                            currentUser={currentUser}
                            ngayXuat={ngayXuat}
                            ngayXuatThuc={ngayXuatThuc}
                            onNgayXuatChange={setNgayXuat}
                            initialLyDoXuat={lyDoXuat}
                            initialGhiChu={ghiChu}
                            updateField={updateField}
                            nguoiNhanEditable={
                                !isView ||
                                (isView && trangThai === "da_duyet")
                            }
                        />
                        <Stack spacing={2.5} sx={{ mt: 2.5 }}>
                            <ChiTietXuatTable
                                items={selectedItems}
                                isView={isView}
                                onAdd={handleOpenKhoThuoc}
                                onRemove={removeItem}
                                onQuantityChange={handleUpdateQuantity}
                                thucXuatEditable={isView && trangThai === "da_duyet"}
                                onThucXuatChange={handleUpdateThucXuat}
                            />
                        </Stack>
                    </Box>
                    {isView && (
                        <PhieuXuatPrint
                            data={{
                                maPhieu: phieuId,
                                ngayThangNam: ngayXuat,
                                ngayXuatThuc,
                                hoTenNguoiNhan,
                                capBac,
                                chucVu,
                                qnTenDonVi,
                                tenDonViNhan,
                                lyDoXuat,
                                ghiChu,
                                items: selectedItems,
                            }}
                        />
                    )}
                </DialogContent>
                <Box sx={{ "@media print": { display: "none" } }}>
                    <DialogActions sx={{ p: 2 }}>
                        {isView ? (
                            <>
                                <Button onClick={onClose} disabled={saving}>
                                    Đóng
                                </Button>
                                {trangThai === "da_duyet" &&
                                    isCreatorOrAuthorized && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<SendIcon />}
                                                onClick={handleXuatKho}
                                                disabled={saving}
                                            >
                                                {saving
                                                    ? "Đang xuất..."
                                                    : "Xuất kho"}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<PrintIcon />}
                                                onClick={() =>
                                                    triggerPrint(
                                                        `Phieu_xuat_kho_${phieuId || ""}_${toFileDate(ngayXuat)}`,
                                                    )
                                                }
                                                disabled={saving}
                                            >
                                                In phiếu
                                            </Button>
                                        </>
                                    )}
                                {trangThai === "da_xuat" && (
                                    <>
                                        {canXuatBu && (
                                            <Button
                                                variant="outlined"
                                                color="info"
                                                startIcon={<ReplayIcon />}
                                                onClick={handleXuatBu}
                                                disabled={saving}
                                            >
                                                {saving
                                                    ? "Đang xử lý..."
                                                    : "Xuất bù"}
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            startIcon={<PrintIcon />}
                                            onClick={() =>
                                                triggerPrint(
                                                    `Phieu_xuat_kho_${phieuId || ""}_${toFileDate(ngayXuat)}`,
                                                )
                                            }
                                            disabled={saving}
                                        >
                                            In phiếu
                                        </Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Button onClick={onClose} disabled={saving}>
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    variant="contained"
                                    disabled={
                                        saving || selectedItems.length === 0
                                    }
                                >
                                    {saving
                                        ? "Đang xử lý..."
                                        : mode === "edit"
                                          ? "Cập nhật"
                                          : "Tạo phiếu"}
                                </Button>
                            </>
                        )}
                    </DialogActions>
                </Box>
            </Dialog>

            <ChonQuanNhanDialog
                open={openChonQN}
                title="Chọn người nhận"
                onClose={() => setOpenChonQN(false)}
                onSelected={handleChonQuanNhan}
            />

            <KhoThuocDialog
                open={openKhoThuoc}
                onClose={() => setOpenKhoThuoc(false)}
                onConfirm={handleAddFromKhoThuoc}
            />

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() =>
                    setSnackbar((prev) => ({ ...prev, open: false }))
                }
            />
        </>
    );
}
