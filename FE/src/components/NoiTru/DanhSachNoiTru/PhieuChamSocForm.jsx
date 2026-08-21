import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
import FormTextField from "@/components/common/FormTextField.jsx";
import NumberField from "@/components/common/NumberField.jsx";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import KhoThuocDialog from "@/components/KhamBenhChoQN/KhamBenh/KhoThuocDialog.jsx";
import useThuocList from "@/hooks/useThuocList.jsx";

let _itemKey = 0;
const nextKey = () => ++_itemKey;

const ThuocItemRow = memo(function ThuocItemRow({
    item,
    index,
    onUpdateRef,
    onRemove,
    readOnly,
}) {
    const [soLuong, setSoLuong] = useState(item.so_luong ?? 1);

    useEffect(() => {
        setSoLuong(item.so_luong ?? 1);
    }, [item.so_luong]);

    const handleSoLuongChange = useCallback(
        (e) => {
            const v = Math.max(1, parseInt(e.target.value) || 1);
            setSoLuong(v);
            onUpdateRef(index, "so_luong", v);
        },
        [index, onUpdateRef],
    );

    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                alignItems: "center",
            }}
        >
            <Typography variant="body2" sx={{ flex: 1 }}>
                {index + 1}. {item.ten_thuoc_vtyt || item.ma_thuoc_vtyt}
            </Typography>
            <NumberField
                size="small"
                value={soLuong}
                onChange={handleSoLuongChange}
                disabled={readOnly}
                min={1}
                slotProps={{
                    htmlInput: {
                        min: 1,
                        style: { width: 60 },
                    },
                }}
                sx={{
                    "& .MuiInputBase-root": { fontSize: "0.8125rem" },
                }}
            />
            <Typography variant="body2" color="text.secondary">
                ({item.don_vi_tinh || "?"})
            </Typography>
            {!readOnly && (
                <ActionIcon title="Xoá" icon={<DeleteIcon />} color="error" onClick={() => onRemove(index)} />
            )}
        </Stack>
    );
});

export default function PhieuChamSocForm({
    open,
    initialData,
    onSave,
    onClose,
    defaultGiuong = "",
    defaultBuong = "",
    readOnly = false,
}) {
    const formRef = useRef({
        thoi_gian: new Date().toISOString().slice(0, 16),
        so_giuong: "",
        buong: "",
        theo_doi_dien_bien: "",
        thuc_hien_y_lenh: "",
    });
    const itemsRef = useRef([]);
    const [keys, setKeys] = useState([]);
    const keysRef = useRef(keys);
    keysRef.current = keys;
    const [openThemThuoc, setOpenThemThuoc] = useState(false);
    const [warningMsg, setWarningMsg] = useState("");
    const { getCache } = useThuocList();

    useEffect(() => {
        if (!open) return;
        if (initialData) {
            formRef.current = {
                thoi_gian: initialData.thoi_gian
                    ? new Date(initialData.thoi_gian).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
                so_giuong: initialData.so_giuong || "",
                buong: initialData.buong || "",
                theo_doi_dien_bien: initialData.theo_doi_dien_bien || "",
                thuc_hien_y_lenh: initialData.thuc_hien_y_lenh || "",
            };
            const chiTiet = initialData.chi_tiet || [];
            itemsRef.current = chiTiet.map((ct) => ({
                ...ct,
                so_luong: ct.so_luong ?? 1,
            }));
            setKeys(chiTiet.map(() => nextKey()));
        } else {
            formRef.current = {
                thoi_gian: new Date().toISOString().slice(0, 16),
                so_giuong: defaultGiuong || "",
                buong: defaultBuong || "",
                theo_doi_dien_bien: "",
                thuc_hien_y_lenh: "",
            };
            itemsRef.current = [];
            setKeys([]);
        }
    }, [open, initialData, defaultGiuong, defaultBuong]);

    const updateField = useCallback((name, value) => {
        formRef.current[name] = value;
    }, []);

    const updateItem = useCallback((idx, field, value) => {
        if (itemsRef.current[idx]) {
            itemsRef.current[idx][field] = value;
        }
    }, []);

    const handleThemThuocConfirm = useCallback((items) => {
        const newKeys = [];
        for (const item of items) {
            itemsRef.current.push({
                ma_thuoc_vtyt: item.ma_thuoc_vtyt,
                ten_thuoc_vtyt: item.ten_thuoc_vtyt,
                don_vi_tinh: item.don_vi_tinh || "",
                so_luong: item.so_luong ?? 1,
                so_luong_max: item.so_luong_max,
            });
            newKeys.push(nextKey());
        }
        setKeys((prev) => [...prev, ...newKeys]);
        setOpenThemThuoc(false);
    }, []);

    const handleXoaThuoc = useCallback((idx) => {
        itemsRef.current.splice(idx, 1);
        setKeys((prev) => prev.filter((_, i) => i !== idx));
    }, []);

    const handleSave = useCallback(() => {
        if (!formRef.current.theo_doi_dien_bien?.trim()) {
            setWarningMsg("Vui lòng nhập diễn biến.");
            return;
        }
        if (!formRef.current.thuc_hien_y_lenh?.trim()) {
            setWarningMsg("Vui lòng nhập y lệnh đã thực hiện.");
            return;
        }
        onSave({
            ...formRef.current,
            thoi_gian: new Date(formRef.current.thoi_gian).toISOString(),
            chi_tiet: [...itemsRef.current],
        });
    }, [onSave]);

    const sortedKeys = keys;

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                sx={{ "& .MuiDialog-paper": { height: "80vh" } }}
            >
                <DialogTitleWrapper wrap={false}>
                    {initialData ? "Sửa phiếu chăm sóc" : "Thêm phiếu chăm sóc"}
                </DialogTitleWrapper>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        {readOnly && (
                            <Typography
                                variant="body2"
                                color="warning.main"
                                sx={{ fontWeight: 600 }}
                            >
                                Bệnh án đã xuất viện, không thể thay đổi phiếu
                                chăm sóc.
                            </Typography>
                        )}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormTextField
                                    name="thoi_gian"
                                    initialValue={formRef.current.thoi_gian}
                                    onUpdateRef={updateField}
                                    label="Thời gian"
                                    type="datetime-local"
                                    fullWidth
                                    disabled={readOnly}
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                                <FormTextField
                                    name="so_giuong"
                                    initialValue={formRef.current.so_giuong}
                                    onUpdateRef={updateField}
                                    label="Số giường"
                                    fullWidth
                                    disabled={readOnly}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                                <FormTextField
                                    name="buong"
                                    initialValue={formRef.current.buong}
                                    onUpdateRef={updateField}
                                    label="Buồng"
                                    fullWidth
                                    disabled={readOnly}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormTextField
                                    name="theo_doi_dien_bien"
                                    initialValue={
                                        formRef.current.theo_doi_dien_bien
                                    }
                                    onUpdateRef={updateField}
                                    label="Diễn biến"
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    disabled={readOnly}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormTextField
                                    name="thuc_hien_y_lenh"
                                    initialValue={
                                        formRef.current.thuc_hien_y_lenh
                                    }
                                    onUpdateRef={updateField}
                                    label="Y lệnh đã thực hiện"
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    disabled={readOnly}
                                />
                            </Grid>
                        </Grid>

                        <Stack spacing={1}>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ alignItems: "center" }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{ color: "text.primary" }}
                                >
                                    Thuốc / VTYT đã dùng
                                </Typography>
                                {!readOnly && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => setOpenThemThuoc(true)}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Thêm thuốc
                                    </Button>
                                )}
                            </Stack>
                            {sortedKeys.length === 0 ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Chưa có thuốc nào.
                                </Typography>
                            ) : (
                                <Stack spacing={1}>
                                    {sortedKeys.map((key, idx) => (
                                        <ThuocItemRow
                                            key={key}
                                            item={itemsRef.current[idx]}
                                            index={idx}
                                            onUpdateRef={updateItem}
                                            onRemove={handleXoaThuoc}
                                            readOnly={readOnly}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} sx={{ textTransform: "none" }}>
                        {readOnly ? "Đóng" : "Hủy"}
                    </Button>
                    {!readOnly && (
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{ textTransform: "none" }}
                        >
                            Lưu phiếu
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <KhoThuocDialog
                open={openThemThuoc}
                onClose={() => setOpenThemThuoc(false)}
                onConfirm={handleThemThuocConfirm}
                cachedItems={getCache()}
            />
            <FeedbackSnackbar
                open={!!warningMsg}
                message={warningMsg}
                severity="warning"
                onClose={() => setWarningMsg("")}
            />
        </>
    );
}
