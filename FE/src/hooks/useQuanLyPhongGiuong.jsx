import { useCallback, useEffect, useMemo, useState } from "react";
import { noiTruService } from "@/services/noiTruService";

export default function useQuanLyPhongGiuong() {
    const [buongList, setBuongList] = useState([]);
    const [giuongList, setGiuongList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [editBuong, setEditBuong] = useState(null);
    const [buongForm, setBuongForm] = useState({ ten_buong: "", so_giuong_toi_da: 4 });
    const [buongFormErrors, setBuongFormErrors] = useState({});
    const [tenGiuongMoi, setTenGiuongMoi] = useState("");

    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        type: "",
        id: null,
    });
    const [transferSource, setTransferSource] = useState(null);
    const [confirmNhan, setConfirmNhan] = useState({ open: false, target: null });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const buongRes = await noiTruService.getBuong({ limit: 100 });
            setBuongList(buongRes.data?.data || buongRes.data || []);
        } catch {
            setSnackbar({ open: true, message: "Lỗi tải danh sách buồng.", severity: "error" });
        }
        try {
            const giuongRes = await noiTruService.getGiuongQuanLy({ limit: 500 });
            setGiuongList(giuongRes.data?.data || []);
        } catch {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (editBuong) {
            setBuongForm({
                ten_buong: editBuong.ten_buong || "",
                so_giuong_toi_da: editBuong.so_giuong_toi_da ?? 4,
            });
            setBuongFormErrors({});
            setTenGiuongMoi("");
        }
    }, [editBuong]);

    const handleOpenAddBuong = useCallback(async () => {
        try {
            await noiTruService.createBuong({ ten_buong: "NoName", so_giuong_toi_da: 4 });
            setSnackbar({ open: true, message: "Đã tạo phòng mới.", severity: "success" });
            loadData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi tạo phòng.",
                severity: "error",
            });
        }
    }, [loadData]);

    const handleOpenEditBuong = useCallback(
        (buong) => setEditBuong(buong),
        [],
    );
    const handleCloseBuongDialog = useCallback(
        () => setEditBuong(null),
        [],
    );

    const validateBuongForm = useCallback(() => {
        const errs = {};
        if (!buongForm.ten_buong.trim()) errs.ten_buong = "Vui lòng nhập tên buồng";
        setBuongFormErrors(errs);
        return Object.keys(errs).length === 0;
    }, [buongForm.ten_buong]);

    const handleSaveBuong = useCallback(
        async () => {
            if (!validateBuongForm() || !editBuong) return;
            try {
                await noiTruService.updateBuong(editBuong.ma_buong, buongForm);
                setSnackbar({ open: true, message: "Đã cập nhật buồng.", severity: "success" });
                setEditBuong(null);
                loadData();
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: err.response?.data?.detail || "Lỗi lưu buồng.",
                    severity: "error",
                });
            }
        },
        [buongForm, editBuong, loadData, validateBuongForm],
    );

    const handleDeleteClick = useCallback(
        (type, id) => setConfirmDelete({ open: true, type, id }),
        [],
    );
    const handleDeleteCancel = useCallback(
        () => setConfirmDelete({ open: false, type: "", id: null }),
        [],
    );

    const handleDeleteConfirm = useCallback(async () => {
        const { type, id } = confirmDelete;
        try {
            if (type === "buong") {
                await noiTruService.deleteBuong(id);
                setSnackbar({
                    open: true,
                    message: "Đã xóa buồng.",
                    severity: "success",
                });
            } else {
                await noiTruService.deleteGiuong(id);
                setSnackbar({
                    open: true,
                    message: "Đã xóa giường.",
                    severity: "success",
                });
            }
            setConfirmDelete({ open: false, type: "", id: null });
            loadData();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || "Lỗi xóa.",
                severity: "error",
            });
        }
    }, [confirmDelete, loadData]);

    const handleSelectSource = useCallback(
        (maGiuong) => setTransferSource(maGiuong),
        [],
    );
    const handleCancelTransfer = useCallback(
        () => setTransferSource(null),
        [],
    );
    const handleNhanClick = useCallback(
        (target) => setConfirmNhan({ open: true, target }),
        [],
    );
    const handleNhanCancel = useCallback(
        () => setConfirmNhan({ open: false, target: null }),
        [],
    );
    const handleNhanConfirm = useCallback(
        async () => {
            try {
                await noiTruService.chuyenGiuong(transferSource, {
                    ma_giuong_moi: confirmNhan.target,
                });
                setSnackbar({ open: true, message: "Đã chuyển giường thành công.", severity: "success" });
                setConfirmNhan({ open: false, target: null });
                setTransferSource(null);
                loadData();
            } catch (err) {
                setSnackbar({ open: true, message: err.response?.data?.detail || "Lỗi chuyển giường.", severity: "error" });
            }
        },
        [transferSource, confirmNhan.target, loadData],
    );

    const buongData = useMemo(() => {
        return buongList.map((b) => ({
            ...b,
            so_giuong_hien_co: giuongList.filter(
                (g) => g.ma_buong === b.ma_buong,
            ).length,
        }));
    }, [buongList, giuongList]);

    const [filterBuong, setFilterBuong] = useState("");

    const filteredGiuong = useMemo(() => {
        if (!filterBuong) return giuongList;
        return giuongList.filter((g) => g.ma_buong === filterBuong);
    }, [giuongList, filterBuong]);

    const selectedBuong = useMemo(
        () => buongList.find((b) => b.ma_buong === filterBuong) || null,
        [buongList, filterBuong],
    );

    const editBuongGiuongList = useMemo(
        () => giuongList.filter((g) => g.ma_buong === editBuong?.ma_buong),
        [giuongList, editBuong],
    );

    const handleAddGiuongInRoom = useCallback(
        async (maBuong, tenGiuong) => {
            try {
                await noiTruService.createGiuong({ ma_buong: maBuong, ten_giuong: tenGiuong });
                setSnackbar({ open: true, message: "Đã thêm giường.", severity: "success" });
                loadData();
            } catch (err) {
                setSnackbar({ open: true, message: err.response?.data?.detail || "Lỗi thêm giường.", severity: "error" });
            }
        },
        [loadData],
    );

    const handleDeleteGiuongInRoom = useCallback(
        async (maGiuong) => {
            try {
                await noiTruService.deleteGiuong(maGiuong);
                setSnackbar({ open: true, message: "Đã xóa giường.", severity: "success" });
                loadData();
            } catch (err) {
                setSnackbar({ open: true, message: err.response?.data?.detail || "Lỗi xóa giường.", severity: "error" });
            }
        },
        [loadData],
    );

    return {
        loading,
        buongList: buongData,
        giuongList,
        filteredGiuong,
        filterBuong,
        setFilterBuong,
        snackbar,
        setSnackbar,
        editBuong,
        buongForm,
        setBuongForm,
        buongFormErrors,
        validateBuongForm,
        tenGiuongMoi,
        setTenGiuongMoi,
        handleOpenAddBuong,
        handleOpenEditBuong,
        handleCloseBuongDialog,
        handleSaveBuong,
        confirmDelete,
        handleDeleteClick,
        handleDeleteCancel,
        handleDeleteConfirm,
        loadData,
        selectedBuong,
        transferSource,
        confirmNhan,
        handleSelectSource,
        handleCancelTransfer,
        handleNhanClick,
        handleNhanCancel,
        handleNhanConfirm,
        editBuongGiuongList,
        handleAddGiuongInRoom,
        handleDeleteGiuongInRoom,
    };
}
