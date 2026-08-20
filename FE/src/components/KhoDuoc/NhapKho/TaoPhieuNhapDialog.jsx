import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    Inventory as InventoryIcon,
    Person as PersonIcon,
    Print as PrintIcon,
    Save as SaveIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { clearThuocCache } from "@/hooks/useThuocList.jsx";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper.jsx";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import DatePicker from "@/components/common/DatePicker.jsx";
import KhoThuocDialog from "@/components/KhamBenhChoQN/KhamBenh/KhoThuocDialog.jsx";
import KhoDialog from "@/components/KhoDuoc/Kho/KhoDialog.jsx";
import NhapKhoPrint from "./NhapKhoPrint.jsx";
import NhapKhoItemTable from "./NhapKhoItemTable.jsx";
import { getCurrentUser } from "@/services/api.js";
import { khoDuocService } from "@/services/khoDuocService.js";
import { NHAP_KHO_TITLES } from "@/constants/khoConstant.js";
import {
    PRINT_STYLES,
    PRINT_DIALOG_CONTENT_SX,
    triggerPrint,
    toFileDate,
} from "@/utils/printUtils.js";
import useNhapKhoItems from "@/hooks/useNhapKhoItems.js";

const NhapKhoHeader = memo(function NhapKhoHeader({
    isView,
    isEdit,
    nguoiNhap,
    currentUser,
    ngayNhap,
    onNgayNhapChange,
    ghiChu,
    onGhiChuCommit,
}) {
    const ghiChuFocused = useRef(false);
    const [ghiChuDraft, setGhiChuDraft] = useState(ghiChu ?? "");

    useEffect(() => {
        if (!ghiChuFocused.current) setGhiChuDraft(ghiChu ?? "");
    }, [ghiChu]);

    return (
        <Stack
            direction="row"
            spacing={4}
            sx={{ flexWrap: "wrap", alignItems: "center" }}
        >
            <Stack spacing={0.5}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Người nhập
                </Typography>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                >
                    <PersonIcon fontSize="small" />
                    <Typography variant="body2">
                        {isView || isEdit
                            ? nguoiNhap || "—"
                            : currentUser
                              ? `${currentUser.ho_ten} (${currentUser.role})`
                              : "—"}
                    </Typography>
                </Stack>
            </Stack>
            <Stack spacing={0.5}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Ngày nhập
                </Typography>
                {isView ? (
                    <Typography variant="body2">
                        {ngayNhap.format("DD/MM/YYYY")}
                    </Typography>
                ) : (
                    <DatePicker
                        value={ngayNhap}
                        onChange={onNgayNhapChange}
                        size="small"
                    />
                )}
            </Stack>
            {!isView && (
                <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Ghi chú
                    </Typography>
                    <TextField
                        size="small"
                        fullWidth
                        value={ghiChuDraft}
                        onFocus={() => (ghiChuFocused.current = true)}
                        onBlur={() => {
                            ghiChuFocused.current = false;
                            onGhiChuCommit(ghiChuDraft);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                        }}
                        onChange={(e) => setGhiChuDraft(e.target.value)}
                        placeholder="Ghi chú (không bắt buộc)"
                    />
                </Stack>
            )}
            {isView && ghiChu && (
                <Stack spacing={0.5}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Ghi chú
                    </Typography>
                    <Typography variant="body2">
                        {ghiChu}
                    </Typography>
                </Stack>
            )}
        </Stack>
    );
});

export default function TaoPhieuNhapDialog({
    open,
    onClose,
    onSaved,
    mode = "create",
    phieuId = null,
    maPhieuDuTru: initialMaPhieuDuTru = null,
}) {
    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isCreate = mode === "create";

    const [ngayNhap, setNgayNhap] = useState(dayjs());
    const [nguoiNhap, setNguoiNhap] = useState("");
    const [ghiChu, setGhiChu] = useState("");
    const [maPhieuNhap, setMaPhieuNhap] = useState("");
    const [maPhieuDuTru, setMaPhieuDuTru] = useState(initialMaPhieuDuTru);
    const [openKhoThuoc, setOpenKhoThuoc] = useState(false);
    const [openTaoThuoc, setOpenTaoThuoc] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const {
        items,
        setItems,
        addItemsFromKho,
        addThuocMoi,
        updateItem,
        removeItem,
        buildItemsPayload,
        validateItems,
    } = useNhapKhoItems();

    const currentUser = useMemo(() => getCurrentUser(), []);

    useEffect(() => {
        if (!open) return;
        setSaving(false);
        setMaPhieuDuTru(initialMaPhieuDuTru);

        if (isView || isEdit) {
            const targetId = phieuId || initialMaPhieuDuTru;
            if (!targetId) return;
            setLoading(true);
            khoDuocService
                .getPhieuNhapDetail(targetId)
                .then(async (res) => {
                    const data = res.data || {};
                    setMaPhieuNhap(data.ma_phieu_nhap || "");
                    const pdtId = data.ma_phieu_du_tru || null;
                    setMaPhieuDuTru(pdtId);
                    setNguoiNhap(data.nguoi_nhap_ho_ten || "");
                    setGhiChu(data.ghi_chu || "");
                    setNgayNhap(
                        data.ngay_nhap ? dayjs(data.ngay_nhap) : dayjs(),
                    );

                    let duTruMap = {};
                    if (pdtId) {
                        try {
                            const dtRes = await khoDuocService.getChiTietByPhieuDuTru(pdtId);
                            const dtData = Array.isArray(dtRes.data)
                                ? dtRes.data
                                : dtRes.data?.items || dtRes.data?.data || [];
                            dtData.forEach((ct) => {
                                duTruMap[ct.ma_thuoc_vtyt] = ct.so_luong;
                            });
                        } catch {
                            // ignore errors loading du tru map
                        }
                    }

                    const loadedItems = (data.chi_tiets || []).map((ct) => ({
                        ma_thuoc_vtyt: ct.ma_thuoc_vtyt,
                        ten_thuoc_vtyt: ct.ten_thuoc_vtyt || "",
                        don_vi_tinh: ct.don_vi_tinh || "",
                        soLuongDuTru: duTruMap[ct.ma_thuoc_vtyt] ?? null,
                        soLuong: ct.so_luong,
                        donGia:
                            ct.don_gia != null ? String(ct.don_gia) : "",
                        soLo: ct.so_lo || "",
                        hanSuDung: ct.han_su_dung
                            ? dayjs(ct.han_su_dung)
                            : null,
                    }));
                    setItems(loadedItems);
                })
                .catch(() => {
                    setSnackbar({
                        open: true,
                        message: "Không thể tải thông tin nhập kho.",
                        severity: "error",
                    });
                })
                .finally(() => setLoading(false));
        } else if (isCreate && initialMaPhieuDuTru) {
            setLoading(true);
            setMaPhieuNhap("");
            setNgayNhap(dayjs());
            setGhiChu("");
            setNguoiNhap("");
            khoDuocService
                .getChiTietByPhieuDuTru(initialMaPhieuDuTru)
                .then((ctRes) => {
                    const ctData = Array.isArray(ctRes.data)
                        ? ctRes.data
                        : ctRes.data?.items || ctRes.data?.data || [];
                    setItems(
                        ctData.map((ct) => ({
                            ma_thuoc_vtyt: ct.ma_thuoc_vtyt,
                            ten_thuoc_vtyt: ct.ten_thuoc_vtyt || "",
                            don_vi_tinh: ct.don_vi_tinh || "",
                            soLuongDuTru: ct.so_luong,
                            soLuong: ct.so_luong,
                            donGia: "",
                            soLo: "",
                            hanSuDung: null,
                        })),
                    );
                })
                .catch(() => {
                    setSnackbar({
                        open: true,
                        message: "Không thể tải chi tiết phiếu dự trù.",
                        severity: "error",
                    });
                })
                .finally(() => setLoading(false));
        } else {
            setMaPhieuNhap("");
            setNgayNhap(dayjs());
            setGhiChu("");
            setNguoiNhap("");
            setItems([]);
            setLoading(false);
        }
    }, [open, mode, phieuId, initialMaPhieuDuTru, isView, isEdit, isCreate, setItems]);

    const handleConfirm = async () => {
        const validationMessage = validateItems();
        if (validationMessage) {
            setSnackbar({
                open: true,
                message: validationMessage,
                severity: "warning",
            });
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ngay_nhap: ngayNhap.format("YYYY-MM-DD"),
                ghi_chu: ghiChu.trim() || null,
                items: buildItemsPayload(),
            };
            if (isEdit) {
                await khoDuocService.capNhatPhieuNhap(
                    maPhieuNhap || phieuId,
                    payload,
                );
            } else {
                await khoDuocService.taoPhieuNhap({
                    ...payload,
                    ma_phieu_du_tru: maPhieuDuTru || null,
                });
            }
            clearThuocCache();
            setSnackbar({
                open: true,
                message: isEdit
                    ? "Cập nhật phiếu nhập thành công."
                    : "Tạo phiếu nhập thành công.",
                severity: "success",
            });
            onSaved?.();
            onClose();
        } catch (err) {
            setSnackbar({
                open: true,
                message:
                    err.response?.data?.detail ||
                    (isEdit
                        ? "Cập nhật phiếu nhập thất bại."
                        : "Tạo phiếu nhập thất bại."),
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    const printData = useMemo(() => {
        if (!isView) return null;
        return {
            maPhieuNhap,
            maPhieuDuTru,
            ngayNhap,
            nguoiNhap,
            items: items.map((ct) => ({
                ten_thuoc_vtyt: ct.ten_thuoc_vtyt,
                don_vi_tinh: ct.don_vi_tinh,
                so_luong: ct.soLuong,
                so_lo: ct.soLo || "",
                han_su_dung: ct.hanSuDung || null,
                don_gia: Number(ct.donGia) || 0,
                thanh_tien: (Number(ct.soLuong) || 0) * (Number(ct.donGia) || 0),
            })),
        };
    }, [isView, maPhieuNhap, maPhieuDuTru, ngayNhap, nguoiNhap, items]);

    const titleText = isView
        ? NHAP_KHO_TITLES.view
        : isEdit
          ? NHAP_KHO_TITLES.edit
          : maPhieuDuTru
            ? NHAP_KHO_TITLES.createWithDuTru
            : NHAP_KHO_TITLES.create;

    const hasDuTruCol = Boolean(maPhieuDuTru);

    const actionButtons = isView ? (
        <>
            <Button onClick={onClose}>Đóng</Button>
            <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() =>
                    triggerPrint(
                        `Phieu_nhap_kho_${maPhieuNhap || phieuId || ""}_${toFileDate(ngayNhap)}`,
                    )
                }
            >
                In phiếu
            </Button>
        </>
    ) : (
        <>
            <Button onClick={onClose} disabled={saving}>
                {isEdit ? "Hủy" : "Hủy"}
            </Button>
            <Button
                onClick={handleConfirm}
                variant="contained"
                startIcon={isEdit ? <SaveIcon /> : <AddIcon />}
                disabled={saving || loading || items.length === 0}
            >
                {saving
                    ? "Đang xử lý..."
                    : isEdit
                      ? "Lưu thay đổi"
                      : "Tạo phiếu nhập"}
            </Button>
        </>
    );

    return (
        <>
            <style>{PRINT_STYLES}</style>
            <Dialog
                open={open}
                onClose={saving ? undefined : onClose}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitleWrapper
                    sx={{ "@media print": { display: "none" } }}
                >
                    {titleText}
                </DialogTitleWrapper>
                <DialogContent
                    dividers
                    sx={{
                        height: 520,
                        overflow: "auto",
                        ...PRINT_DIALOG_CONTENT_SX,
                    }}
                >
                    {loading ? (
                        <Typography
                            color="text.secondary"
                            sx={{ py: 2, textAlign: "center" }}
                        >
                            Đang tải...
                        </Typography>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    "@media print": {
                                        display: "none !important",
                                    },
                                }}
                            >
                                <Stack spacing={2} sx={{ pt: 1 }}>
                                    <NhapKhoHeader
                                        isView={isView}
                                        isEdit={isEdit}
                                        nguoiNhap={nguoiNhap}
                                        currentUser={currentUser}
                                        ngayNhap={ngayNhap}
                                        onNgayNhapChange={setNgayNhap}
                                        ghiChu={ghiChu}
                                        onGhiChuCommit={setGhiChu}
                                    />

                                    {!isView && (
                                        <Stack direction="row" spacing={1.5}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<InventoryIcon />}
                                                onClick={() =>
                                                    setOpenKhoThuoc(true)
                                                }
                                            >
                                                Chọn từ kho
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={() =>
                                                    setOpenTaoThuoc(true)
                                                }
                                            >
                                                Tạo thuốc mới
                                            </Button>
                                        </Stack>
                                    )}

                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Danh sách thuốc / VTYT nhập
                                    </Typography>

                                    <NhapKhoItemTable
                                        items={items}
                                        isView={isView}
                                        hasDuTruCol={hasDuTruCol}
                                        onUpdateItem={updateItem}
                                        onRemoveItem={removeItem}
                                    />
                                </Stack>
                            </Box>
                            {isView && printData && (
                                <Box
                                    sx={{
                                        mt: 3,
                                        "@media print": {
                                            display: "contents !important",
                                        },
                                    }}
                                >
                                    <NhapKhoPrint data={printData} />
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions
                    sx={{ p: 2, pb: 2.5, "@media print": { display: "none" } }}
                >
                    {actionButtons}
                </DialogActions>
            </Dialog>

            {!isView && (
                <>
                    <KhoThuocDialog
                        open={openKhoThuoc}
                        onClose={() => setOpenKhoThuoc(false)}
                        onConfirm={addItemsFromKho}
                        importMode
                    />

                    <KhoDialog
                        open={openTaoThuoc}
                        mode="create"
                        onClose={() => setOpenTaoThuoc(false)}
                        onSaved={addThuocMoi}
                    />
                </>
            )}

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