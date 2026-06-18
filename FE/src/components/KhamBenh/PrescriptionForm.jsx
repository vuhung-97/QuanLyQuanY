import { useCallback, useEffect, useState } from "react";
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

const EMPTY_ITEM = {
    ma_thuoc_vtyt: "",
    ten_thuoc_vtyt: "",
    don_vi_tinh: "",
    so_luong: 1,
    sang: 0,
    trua: 0,
    toi: 0,
    thoi_diem_dung: "sau_an",
    cach_su_dung: "uong",
    ghi_chu: "",
};

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

function PrescriptionRow({ item, index, onChange, onRemove }) {
    const [inputValue, setInputValue] = useState(item.ten_thuoc_vtyt || "");
    const [options, setOptions] = useState(
        item.ma_thuoc_vtyt && item.ten_thuoc_vtyt
            ? [
                  {
                      ma_thuoc_vtyt: item.ma_thuoc_vtyt,
                      ten_thuoc_vtyt: item.ten_thuoc_vtyt,
                      don_vi_tinh: item.don_vi_tinh,
                  },
              ]
            : [],
    );

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

    const handleField = useCallback(
        (field, value) => onChange(index, field, value),
        [index, onChange],
    );

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
                                (o) => o.ma_thuoc_vtyt === item.ma_thuoc_vtyt,
                            ) || null
                        }
                        onChange={(_, newVal) => {
                            handleField(
                                "ma_thuoc_vtyt",
                                newVal?.ma_thuoc_vtyt || "",
                            );
                            handleField(
                                "ten_thuoc_vtyt",
                                newVal?.ten_thuoc_vtyt || "",
                            );
                            handleField(
                                "don_vi_tinh",
                                newVal?.don_vi_tinh || "",
                            );
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
                    value={item.so_luong}
                    onChange={(e) =>
                        handleField(
                            "so_luong",
                            Math.max(1, parseInt(e.target.value) || 1),
                        )
                    }
                    sx={{ width: 100 }}
                    inputProps={{ min: 1 }}
                />
                {item.don_vi_tinh && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ minWidth: 50, alignSelf: "center" }}
                    >
                        ({item.don_vi_tinh})
                    </Typography>
                )}
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemove(index)}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <TextField
                    size="small"
                    label="Sáng"
                    type="number"
                    value={item.sang}
                    onChange={(e) =>
                        handleField(
                            "sang",
                            Math.max(0, parseInt(e.target.value) || 0),
                        )
                    }
                    sx={{ width: 80 }}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    size="small"
                    label="Trưa"
                    type="number"
                    value={item.trua}
                    onChange={(e) =>
                        handleField(
                            "trua",
                            Math.max(0, parseInt(e.target.value) || 0),
                        )
                    }
                    sx={{ width: 80 }}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    size="small"
                    label="Tối"
                    type="number"
                    value={item.toi}
                    onChange={(e) =>
                        handleField(
                            "toi",
                            Math.max(0, parseInt(e.target.value) || 0),
                        )
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
                        (o) => o.value === item.cach_su_dung,
                    )}
                    onChange={(_, v) =>
                        handleField("cach_su_dung", v?.value || "uong")
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
                        (o) => o.value === item.thoi_diem_dung,
                    )}
                    onChange={(_, v) =>
                        handleField("thoi_diem_dung", v?.value || "sau_an")
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
                    value={item.ghi_chu}
                    onChange={(e) => handleField("ghi_chu", e.target.value)}
                    sx={{ flex: 1, minWidth: 200 }}
                />
            </Stack>
        </Stack>
    );
}

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
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (open) {
            setItems(
                initialItems?.length > 0
                    ? initialItems.map((it) => ({ ...EMPTY_ITEM, ...it }))
                    : [{ ...EMPTY_ITEM }],
            );
        }
    }, [open, initialItems]);

    const handleItemChange = useCallback((index, field, value) => {
        setItems((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    }, []);

    const addRow = useCallback(() => {
        setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
    }, []);

    const removeRow = useCallback((index) => {
        setItems((prev) =>
            prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
        );
    }, []);

    const handleSave = useCallback(() => {
        const valid = items.filter((it) => it.ma_thuoc_vtyt);
        if (valid.length === 0) return;
        const mapped = valid.map((it) => ({
            ma_thuoc_vtyt: it.ma_thuoc_vtyt,
            ten_thuoc_vtyt: it.ten_thuoc_vtyt,
            don_vi_tinh: it.don_vi_tinh,
            so_luong: it.so_luong,
            sang: it.sang,
            trua: it.trua,
            toi: it.toi,
            thoi_diem_dung: it.thoi_diem_dung,
            cach_su_dung: it.cach_su_dung,
            ghi_chu: it.ghi_chu,
            huong_dieu_tri: buildHuongDieuTri(it),
        }));
        onSave(mapped);
        onClose();
    }, [items, onSave, onClose]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h2" sx={{ textAlign: "center" }}>
                    Kê đơn thuốc
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    {items.map((item, idx) => (
                        <PrescriptionRow
                            key={idx}
                            item={item}
                            index={idx}
                            onChange={handleItemChange}
                            onRemove={removeRow}
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
                    disabled={
                        items.filter((it) => it.ma_thuoc_vtyt).length === 0
                    }
                >
                    In đơn thuốc
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={
                        items.filter((it) => it.ma_thuoc_vtyt).length === 0
                    }
                >
                    Lưu đơn thuốc
                </Button>
            </DialogActions>
        </Dialog>
    );
}
