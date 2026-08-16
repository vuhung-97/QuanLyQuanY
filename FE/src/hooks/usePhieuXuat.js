import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { khoDuocService } from "@/services/khoDuocService.js";
import { khamBenhService } from "@/services/khamBenhService.js";
import { getCurrentUser } from "@/services/api.js";
import { buildTree, flattenTree } from "@/utils/treeUtils.js";
import { clearThuocCache } from "./useThuocList.jsx";

export default function usePhieuXuat({ open, phieuId, mode, onClose, onSaved, onXuatBuCreated }) {
    const [donViNhan, setDonViNhan] = useState("");
    const [maQuanNhanNhan, setMaQuanNhanNhan] = useState(null);
    const [hoTenNguoiNhan, setHoTenNguoiNhan] = useState("");
    const [ngayXuat, setNgayXuat] = useState(dayjs());
    const [ngayXuatThuc, setNgayXuatThuc] = useState(null);
    const [lyDoXuat, setLyDoXuat] = useState("");
    const [ghiChu, setGhiChu] = useState("");
    const lyDoXuatRef = useRef("");
    const ghiChuRef = useRef("");
    const updateField = useCallback((name, value) => {
        if (name === "lyDoXuat") lyDoXuatRef.current = value;
        else if (name === "ghiChu") ghiChuRef.current = value;
    }, []);
    const [donViFlat, setDonViFlat] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [creatorName, setCreatorName] = useState("");
    const [trangThai, setTrangThai] = useState("");
    const [nguoiXuatId, setNguoiXuatId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [openChonQN, setOpenChonQN] = useState(false);
    const [openKhoThuoc, setOpenKhoThuoc] = useState(false);
    const [tenDonViNhan, setTenDonViNhan] = useState("");
    const [capBac, setCapBac] = useState("");
    const [chucVu, setChucVu] = useState("");
    const [qnMaDonVi, setQnMaDonVi] = useState("");

    const isView = mode === "view";

    const currentUser = useMemo(() => getCurrentUser(), []);

    const isCreatorOrAuthorized = useMemo(() => {
        if (!currentUser) return false;
        const role = currentUser.role;
        return currentUser.id === nguoiXuatId || role === "ROLE_ADMIN" || role === "ROLE_CNQY";
    }, [currentUser, nguoiXuatId]);

    useEffect(() => {
        if (!open) return;

        const loadDonVi = () =>
            khoDuocService.listDonVi({ limit: 500 })
                .then((res) => {
                    const data = res.data || [];
                    const units = Array.isArray(data) ? data : data.items || data.data || [];
                    const tree = buildTree(units);
                    setDonViFlat(flattenTree(tree));
                })
                .catch(() => {});

        if (!phieuId || mode === "create") {
            setDonViNhan("");
            setMaQuanNhanNhan(null);
            setHoTenNguoiNhan("");
            setNgayXuat(dayjs());
            setNgayXuatThuc(null);
            lyDoXuatRef.current = "";
            ghiChuRef.current = "";
            setLyDoXuat("");
            setGhiChu("");
            setSelectedItems([]);
            setCreatorName("");
            setTrangThai("");
            loadDonVi();
            return;
        }

        loadDonVi();
        (async () => {
            try {
                const res = await khoDuocService.getPhieuXuatKho(phieuId);
                const p = res.data;
                setDonViNhan(p.ma_don_vi_nhan || "");
                setMaQuanNhanNhan(p.ma_quan_nhan_nhan || null);
                setHoTenNguoiNhan(p.ho_ten_nguoi_nhan || "");
                setNgayXuat(p.ngay_thang_nam ? dayjs(p.ngay_thang_nam) : dayjs());
                setNgayXuatThuc(p.ngay_xuat ? dayjs(p.ngay_xuat) : null);
                lyDoXuatRef.current = p.ly_do_xuat || "";
                ghiChuRef.current = p.ghi_chu || "";
                setLyDoXuat(p.ly_do_xuat || "");
                setGhiChu(p.ghi_chu || "");
                setCreatorName(p.nguoi_xuat_ho_ten || p.nguoi_xuat || "");
                setNguoiXuatId(p.nguoi_xuat || null);
                setTrangThai(p.trang_thai || "");

                const ctRes = await khoDuocService.getChiTietByPhieuXuat(phieuId);
                const ctData = ctRes.data || [];
                const items = Array.isArray(ctData) ? ctData : ctData.items || ctData.data || [];
                setSelectedItems(
                    items.map((it) => ({
                        ...it,
                        so_luong_thuc_xuat: it.so_luong_thuc_xuat ?? it.so_luong,
                    })),
                );
            } catch {
                setSnackbar({ open: true, message: "Không thể tải phiếu xuất.", severity: "error" });
            }
        })();
    }, [open, phieuId, mode]);

    useEffect(() => {
        const dv = donViFlat.find((d) => d.ma_don_vi === donViNhan);
        setTenDonViNhan(dv?.ten_don_vi || "");
    }, [donViFlat, donViNhan]);

    useEffect(() => {
        if (!maQuanNhanNhan) { setCapBac(""); setChucVu(""); setQnMaDonVi(""); return; }
        let ignore = false;
        (async () => {
            try {
                const res = await khamBenhService.getQuanNhan(maQuanNhanNhan);
                if (!ignore) {
                    setCapBac(res.data?.cap_bac || "");
                    setChucVu(res.data?.chuc_vu || "");
                    setQnMaDonVi(res.data?.ma_don_vi || "");
                }
            } catch { if (!ignore) { setCapBac(""); setChucVu(""); setQnMaDonVi(""); } }
        })();
        return () => { ignore = true; };
    }, [maQuanNhanNhan]);

    const qnTenDonVi = useMemo(() => {
        const dv = donViFlat.find((d) => d.ma_don_vi === qnMaDonVi);
        return dv?.ten_don_vi || "";
    }, [donViFlat, qnMaDonVi]);

    const handleAddFromKhoThuoc = (items) => {
        setSelectedItems((prev) => {
            const map = new Map();
            for (const item of prev) map.set(item.ma_thuoc_vtyt, item);
            for (const item of items) {
                const existing = map.get(item.ma_thuoc_vtyt);
                if (existing) {
                    map.set(item.ma_thuoc_vtyt, { ...existing, so_luong: existing.so_luong + item.so_luong });
                } else {
                    map.set(item.ma_thuoc_vtyt, item);
                }
            }
            return Array.from(map.values());
        });
    };

    const handleChonQuanNhan = (qn) => {
        setMaQuanNhanNhan(qn.ma_quan_nhan);
        setHoTenNguoiNhan(qn.ho_ten);
        setOpenChonQN(false);
    };

    const removeItem = useCallback(
        (maThuoc) =>
            setSelectedItems((prev) =>
                prev.filter((item) => item.ma_thuoc_vtyt !== maThuoc),
            ),
        [],
    );

    const handleUpdateQuantity = useCallback((maThuoc, newQty) => {
        setSelectedItems((prev) =>
            prev.map((item) => {
                if (item.ma_thuoc_vtyt !== maThuoc) return item;
                const max = item.so_luong_max ?? Infinity;
                const qty = Math.max(1, Math.min(max, parseInt(newQty, 10) || 1));
                return { ...item, so_luong: qty };
            }),
        );
    }, []);

    const handleUpdateThucXuat = useCallback((maThuoc, value) => {
        setSelectedItems((prev) =>
            prev.map((item) => {
                if (item.ma_thuoc_vtyt !== maThuoc) return item;
                const max = Math.min(
                    item.so_luong,
                    item.so_luong_max ?? item.so_luong,
                );
                const qty = Math.max(0, Math.min(max, parseInt(value, 10) || 0));
                return { ...item, so_luong_thuc_xuat: qty };
            }),
        );
    }, []);

    const handleSave = async () => {
        if (selectedItems.length === 0) return;
        setSaving(true);
        try {
            const payload = getCurrentUser();
            const nguoiLap = payload?.id || null;

            if (phieuId && mode === "edit") {
                await khoDuocService.updatePhieuXuatKho(phieuId, {
                    ma_don_vi_nhan: donViNhan || null,
                    ma_quan_nhan_nhan: maQuanNhanNhan,
                    ho_ten_nguoi_nhan: hoTenNguoiNhan || null,
                    ngay_thang_nam: ngayXuat.toISOString(),
                    ly_do_xuat: lyDoXuatRef.current || null,
                    ghi_chu: ghiChuRef.current || null,
                });
                const ctRes = await khoDuocService.getChiTietByPhieuXuat(phieuId);
                const ctData = ctRes.data || [];
                const oldItems = Array.isArray(ctData) ? ctData : ctData.items || ctData.data || [];
                for (const old of oldItems) {
                    await khoDuocService.deleteChiTietXuatKho(`${phieuId},${old.ma_thuoc_vtyt}`);
                }
                for (const item of selectedItems) {
                    await khoDuocService.createChiTietXuatKho({ ma_phieu_xuat: phieuId, ma_thuoc_vtyt: item.ma_thuoc_vtyt, so_luong: item.so_luong });
                }
                setSnackbar({ open: true, message: "Cập nhật phiếu xuất thành công.", severity: "success" });
            } else {
                const phieuRes = await khoDuocService.createPhieuXuatKho({
                    ma_don_vi_nhan: donViNhan || null,
                    ma_quan_nhan_nhan: maQuanNhanNhan,
                    ho_ten_nguoi_nhan: hoTenNguoiNhan || null,
                    ngay_thang_nam: ngayXuat.toISOString(),
                    ly_do_xuat: lyDoXuatRef.current || null,
                    ghi_chu: ghiChuRef.current || null,
                    nguoi_xuat: nguoiLap,
                });
                const maPhieu = phieuRes.data.ma_phieu_xuat;
                for (const item of selectedItems) {
                    await khoDuocService.createChiTietXuatKho({ ma_phieu_xuat: maPhieu, ma_thuoc_vtyt: item.ma_thuoc_vtyt, so_luong: item.so_luong });
                }
                setSnackbar({ open: true, message: "Tạo phiếu xuất thành công.", severity: "success" });
            }
            onSaved?.();
            onClose();
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.detail || "Không thể tạo phiếu xuất.", severity: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleXuatKho = async () => {
        if (!phieuId) return;
        setSaving(true);
        try {
            const thucXuatMap = {};
            for (const item of selectedItems) {
                thucXuatMap[item.ma_thuoc_vtyt] =
                    item.so_luong_thuc_xuat ?? item.so_luong;
            }
            await khoDuocService.xuatKho(phieuId, {
                thuc_xuat: thucXuatMap,
                ma_quan_nhan_nhan: maQuanNhanNhan,
                ho_ten_nguoi_nhan: hoTenNguoiNhan,
            });
            clearThuocCache();
            setSnackbar({ open: true, message: "Xuất kho thành công.", severity: "success" });
            onSaved?.();
            onClose();
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.detail || "Xuất kho thất bại.", severity: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleXuatBu = async () => {
        if (!phieuId) return;
        setSaving(true);
        try {
            const res = await khoDuocService.xuatBu(phieuId);
            const maPhieu = res.data?.ma_phieu_xuat;
            setSnackbar({ open: true, message: "Đã tạo phiếu xuất bù.", severity: "success" });
            onXuatBuCreated?.(maPhieu);
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.detail || "Không thể tạo phiếu xuất bù.", severity: "error" });
        } finally {
            setSaving(false);
        }
    };

    return {
        donViNhan, setDonViNhan,
        maQuanNhanNhan, setMaQuanNhanNhan,
        hoTenNguoiNhan, setHoTenNguoiNhan,
        ngayXuat, setNgayXuat,
        ngayXuatThuc,
        lyDoXuat, ghiChu, updateField,
        donViFlat,
        selectedItems,
        creatorName,
        trangThai,
        tenDonViNhan,
        capBac,
        chucVu,
        qnTenDonVi,
        nguoiXuatId,
        saving,
        snackbar, setSnackbar,
        isView,
        currentUser,
        isCreatorOrAuthorized,
        openChonQN, setOpenChonQN,
        openKhoThuoc, setOpenKhoThuoc,
        handleAddFromKhoThuoc,
        handleChonQuanNhan,
        removeItem,
        handleUpdateQuantity,
        handleUpdateThucXuat,
        handleSave,
        handleXuatKho,
        handleXuatBu,
    };
}
