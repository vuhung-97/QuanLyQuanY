import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { khamBenhService } from "../../services/khamBenhService.js";

function genKey() {
    return Math.random().toString(36).slice(2, 11);
}

const THOI_DIEM_OPTIONS = [
    { value: "sau_an", label: "Sau ăn" },
    { value: "truoc_an", label: "Trước ăn" },
    { value: "truoc_khi_ngu", label: "Trước khi ngủ" },
    { value: "sau_khi_thuc_day", label: "Sau khi thức dậy" },
    { value: "khong", label: "Không" },
];

const CACH_SU_DUNG_OPTIONS = [
    { value: "uong", label: "Uống" },
    { value: "boi", label: "Bôi" },
    { value: "tiem", label: "Tiêm" },
    { value: "xong", label: "Xông" },
    { value: "ngam", label: "Ngậm" },
    { value: "nhot", label: "Nhỏ mắt" },
    { value: "khac", label: "Khác" },
];

const PrescriptionRow = memo(forwardRef(function PrescriptionRow({ initialData, onRemove }, ref) {
    const [maThuoc, setMaThuoc] = useState(initialData?.ma_thuoc_vtyt ?? "");
    const [tenThuoc, setTenThuoc] = useState(initialData?.ten_thuoc_vtyt ?? "");
    const [donViTinh, setDonViTinh] = useState(initialData?.don_vi_tinh ?? "");
    const [soLuong, setSoLuong] = useState(initialData?.so_luong ?? 1);
    const [sang, setSang] = useState(initialData?.sang ?? 0);
    const [trua, setTrua] = useState(initialData?.trua ?? 0);
    const [toi, setToi] = useState(initialData?.toi ?? 0);
    const [thoiDiemDung, setThoiDiemDung] = useState(initialData?.thoi_diem_dung ?? "sau_an");
    const [cachSuDung, setCachSuDung] = useState(initialData?.cach_su_dung ?? "uong");
    const [ghiChu, setGhiChu] = useState(initialData?.ghi_chu ?? "");
    const [inputValue, setInputValue] = useState(initialData?.ten_thuoc_vtyt ?? "");
    const [options, setOptions] = useState(
        initialData?.ma_thuoc_vtyt && initialData?.ten_thuoc_vtyt
            ? [
                  {
                      ma_thuoc_vtyt: initialData.ma_thuoc_vtyt,
                      ten_thuoc_vtyt: initialData.ten_thuoc_vtyt,
                      don_vi_tinh: initialData.don_vi_tinh,
                  },
              ]
            : [],
    );

    useImperativeHandle(ref, () => ({
        getData: () => ({
            ma_thuoc_vtyt: maThuoc,
            ten_thuoc_vtyt: tenThuoc,
            don_vi_tinh: donViTinh,
            so_luong: soLuong,
            sang,
            trua,
            toi,
            thoi_diem_dung: thoiDiemDung,
            cach_su_dung: cachSuDung,
            ghi_chu: ghiChu,
            huong_dieu_tri: buildHuongDieuTri({ sang, trua, toi, thoi_diem_dung: thoiDiemDung, cach_su_dung: cachSuDung, ghi_chu: ghiChu }),
        }),
    }), [maThuoc, tenThuoc, donViTinh, soLuong, sang, trua, toi, thoiDiemDung, cachSuDung, ghiChu]);

    useEffect(() => {
        if (inputValue.length < 1) {
            setOptions([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await khamBenhService.searchThuoc(inputValue);
                setOptions(res.data || []);
            } catch {
                setOptions([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [inputValue]);

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
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box sx={{ flex: 2, minWidth: 0 }}>
                    <Autocomplete
                        size="small"
                        options={options}
                        inputValue={inputValue}
                        onInputChange={(_, v) => setInputValue(v)}
                        getOptionLabel={(o) => o.ten_thuoc_vtyt || ""}
                        isOptionEqualToValue={(o, v) =>
                            o.ma_thuoc_vtyt === v.ma_thuoc_vtyt
                        }
                        value={
                            options.find(
                                (o) => o.ma_thuoc_vtyt === maThuoc,
                            ) || null
                        }
                        onChange={(_, newVal) => {
                            setMaThuoc(newVal?.ma_thuoc_vtyt || "");
                            setTenThuoc(newVal?.ten_thuoc_vtyt || "");
                            setDonViTinh(newVal?.don_vi_tinh || "");
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Tên thuốc" />
                        )}
                    />
                </Box>
                <TextField
                    size="small"
                    label="Số lượng"
                    type="number"
                    value={soLuong}
                    onChange={(e) =>
                        setSoLuong(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    sx={{ width: 100 }}
                    inputProps={{ min: 1 }}
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
                <IconButton
                    size="small"
                    color="error"
                    onClick={onRemove}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <TextField
                    size="small"
                    label="Sáng"
                    type="number"
                    value={sang}
                    onChange={(e) =>
                        setSang(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    sx={{ width: 80 }}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    size="small"
                    label="Trưa"
                    type="number"
                    value={trua}
                    onChange={(e) =>
                        setTrua(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    sx={{ width: 80 }}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    size="small"
                    label="Tối"
                    type="number"
                    value={toi}
                    onChange={(e) =>
                        setToi(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    sx={{ width: 80 }}
                    inputProps={{ min: 0 }}
                />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Autocomplete
                    size="small"
                    options={CACH_SU_DUNG_OPTIONS}
                    value={CACH_SU_DUNG_OPTIONS.find(
                        (o) => o.value === cachSuDung,
                    )}
                    onChange={(_, v) =>
                        setCachSuDung(v?.value || "uong")
                    }
                    getOptionLabel={(o) => o.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Cách sử dụng" />
                    )}
                    sx={{ minWidth: 150 }}
                />
                <Autocomplete
                    size="small"
                    options={THOI_DIEM_OPTIONS}
                    value={THOI_DIEM_OPTIONS.find(
                        (o) => o.value === thoiDiemDung,
                    )}
                    onChange={(_, v) =>
                        setThoiDiemDung(v?.value || "sau_an")
                    }
                    getOptionLabel={(o) => o.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Thời điểm dùng" />
                    )}
                    sx={{ minWidth: 200 }}
                />
                <TextField
                    size="small"
                    label="Ghi chú"
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    sx={{ flex: 1, minWidth: 200 }}
                />
            </Stack>
        </Stack>
    );
}));

function buildHuongDieuTri(item) {
    const lieu = `Sáng: ${item.sang} - Trưa: ${item.trua} - Tối: ${item.toi}`;
    const td = THOI_DIEM_OPTIONS.find((o) => o.value === item.thoi_diem_dung);
    const cd = CACH_SU_DUNG_OPTIONS.find((o) => o.value === item.cach_su_dung);
    const cachDung = cd?.label || "Uống";
    const thoiDiem = td?.label || "Sau ăn";
    let result = `${lieu} | ${thoiDiem} | ${cachDung}`;
    if (item.ghi_chu) result += ` | ${item.ghi_chu}`;
    return result;
}

export default function PrescriptionForm({
    open,
    onClose,
    onSave,
    initialItems,
}) {
    const [rows, setRows] = useState([]);
    const rowRefs = useRef(new Map());

    useEffect(() => {
        if (open) {
            const next = initialItems?.length > 0
                ? initialItems.map((it) => ({ key: genKey(), initial: it }))
                : [{ key: genKey(), initial: null }];
            setRows(next);
            rowRefs.current = new Map();
        }
    }, [open, initialItems]);

    const handleRemove = useCallback((key) => {
        setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
    }, []);

    const addRow = useCallback(() => {
        setRows((prev) => [...prev, { key: genKey(), initial: null }]);
    }, []);

    const handleSave = useCallback(() => {
        const items = [];
        rowRefs.current.forEach((ref) => {
            const data = ref.getData();
            if (data.ma_thuoc_vtyt) items.push(data);
        });
        if (items.length === 0) return;
        onSave(items);
        onClose();
    }, [onSave, onClose]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const validCount = rows.length;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h2" sx={{ textAlign: "center" }}>
                    Kê đơn thuốc
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    {rows.map(({ key, initial }) => (
                        <PrescriptionRow
                            key={key}
                            ref={(el) => {
                                if (el) rowRefs.current.set(key, el);
                                else rowRefs.current.delete(key);
                            }}
                            initialData={initial}
                            onRemove={() => handleRemove(key)}
                        />
                    ))}
                    <Button
                        startIcon={<AddIcon />}
                        onClick={addRow}
                        sx={{ alignSelf: "flex-start" }}
                    >
                        Thêm thuốc
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    variant="outlined"
                    onClick={handlePrint}
                    disabled={validCount === 0}
                >
                    In đơn thuốc
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={validCount === 0}
                >
                    Lưu đơn thuốc
                </Button>
            </DialogActions>
        </Dialog>
    );
}
