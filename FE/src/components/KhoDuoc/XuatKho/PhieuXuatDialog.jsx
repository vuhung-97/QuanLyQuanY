import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    Box,
} from "@mui/material";
import { Print as PrintIcon, Send as SendIcon } from "@mui/icons-material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import ChonQuanNhanDialog from "@/components/common/ChonQuanNhanDialog.jsx";
import KhoThuocDialog from "@/components/KhamBenhChoQN/KhamBenh/KhoThuocDialog.jsx";
import { useCallback } from "react";
import usePhieuXuat from "@/hooks/usePhieuXuat.js";
import PhieuXuatForm from "./PhieuXuatForm.jsx";
import ChiTietXuatTable from "./ChiTietXuatTable.jsx";
import PhieuXuatPrint from "./PhieuXuatPrint.jsx";

export default function PhieuXuatDialog({
    open,
    onClose,
    onSaved,
    phieuId = null,
    mode = "create",
}) {
    const {
        donViNhan,
        setDonViNhan,
        maQuanNhanNhan,
        hoTenNguoiNhan,
        ngayXuat,
        setNgayXuat,
        lyDoXuat,
        setLyDoXuat,
        ghiChu,
        setGhiChu,
        donViFlat,
        selectedItems,
        creatorName,
        trangThai,
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
        handleSave,
        handleXuatKho,
    } = usePhieuXuat({ open, phieuId, mode, onClose, onSaved });

    const handleOpenKhoThuoc = useCallback(() => setOpenKhoThuoc(true), []);

    return (
        <>
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
                        "@media print": { border: "none !important" },
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
                            onRemoveQN={() => {
                                setMaQuanNhanNhan(null);
                                setHoTenNguoiNhan("");
                            }}
                            creatorName={creatorName}
                            currentUser={currentUser}
                            ngayXuat={ngayXuat}
                            onNgayXuatChange={setNgayXuat}
                            lyDoXuat={lyDoXuat}
                            onLyDoXuatChange={setLyDoXuat}
                            ghiChu={ghiChu}
                            onGhiChuChange={setGhiChu}
                        />
                        <Stack spacing={2.5} sx={{ mt: 2.5 }}>
                            <ChiTietXuatTable
                                items={selectedItems}
                                isView={isView}
                                onAdd={handleOpenKhoThuoc}
                                onRemove={removeItem}
                            />
                        </Stack>
                    </Box>
                    {isView && (
                        <PhieuXuatPrint
                            data={{
                                maPhieu: phieuId,
                                ngayThangNam: ngayXuat,
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
                                                onClick={() => window.print()}
                                                disabled={saving}
                                            >
                                                In phiếu
                                            </Button>
                                        </>
                                    )}
                                {trangThai === "da_xuat" && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<PrintIcon />}
                                        onClick={() => window.print()}
                                        disabled={saving}
                                    >
                                        In phiếu
                                    </Button>
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
