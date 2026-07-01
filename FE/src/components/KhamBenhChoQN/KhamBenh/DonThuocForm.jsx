import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
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
import {
    Delete as DeleteIcon,
    MedicalServices as MedicalServicesIcon,
} from "@mui/icons-material";
import KhoThuocDialog from "./KhoThuocDialog.jsx";
import {
    THOI_DIEM_OPTIONS,
    CACH_SU_DUNG_OPTIONS,
} from "@/constants/khamBenhConstants.js";
import { genKey, buildHuongDieuTri } from "@/utils/khamBenhUtils.js";
import useThuocList from "@/hooks/useThuocList.jsx";

const PrescriptionRow = memo(
    forwardRef(function PrescriptionRow({ initialData, onRemove }, ref) {
        const [maThuoc, setMaThuoc] = useState(
            initialData?.ma_thuoc_vtyt ?? "",
        );
        const [tenThuoc, setTenThuoc] = useState(
            initialData?.ten_thuoc_vtyt ?? "",
        );
        const [donViTinh, setDonViTinh] = useState(
            initialData?.don_vi_tinh ?? "",
        );
        const [soLuong, setSoLuong] = useState(initialData?.so_luong ?? 1);
        const soLuongMax = initialData?.so_luong_max ?? Infinity;
        const [sang, setSang] = useState(initialData?.sang ?? 0);
        const [trua, setTrua] = useState(initialData?.trua ?? 0);
        const [toi, setToi] = useState(initialData?.toi ?? 0);
        const [thoiDiemDung, setThoiDiemDung] = useState(
            initialData?.thoi_diem_dung ?? "sau_an",
        );
        const [cachSuDung, setCachSuDung] = useState(
            initialData?.cach_su_dung ?? "uong",
        );
        const [ghiChu, setGhiChu] = useState(initialData?.ghi_chu ?? "");

        useImperativeHandle(
            ref,
            () => ({
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
                    huong_dieu_tri: buildHuongDieuTri({
                        sang,
                        trua,
                        toi,
                        thoi_diem_dung: thoiDiemDung,
                        cach_su_dung: cachSuDung,
                        ghi_chu: ghiChu,
                    }),
                }),
            }),
            [
                maThuoc,
                tenThuoc,
                donViTinh,
                soLuong,
                sang,
                trua,
                toi,
                thoiDiemDung,
                cachSuDung,
                ghiChu,
            ],
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
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                >
                    <Box sx={{ flex: 2, minWidth: 0 }}>
                        <TextField
                            size="small"
                            label="Tên thuốc"
                            value={tenThuoc}
                            slotProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Box>
                    <TextField
                        size="small"
                        label={
                            soLuongMax !== Infinity
                                ? `SL (tồn: ${soLuongMax})`
                                : "Số lượng"
                        }
                        type="number"
                        value={soLuong}
                        onChange={(e) =>
                            setSoLuong(
                                Math.min(
                                    soLuongMax,
                                    Math.max(1, parseInt(e.target.value) || 1),
                                ),
                            )
                        }
                        sx={{ width: 130 }}
                        slotProps={{
                            htmlInput: { min: 1, max: soLuongMax },
                        }}
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
                    <IconButton size="small" color="error" onClick={onRemove}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                >
                    <TextField
                        size="small"
                        label="Sáng"
                        type="number"
                        value={sang}
                        onChange={(e) =>
                            setSang(Math.max(0, parseInt(e.target.value) || 0))
                        }
                        sx={{ width: 80 }}
                        slotProps={{ min: 0 }}
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
                        slotProps={{ min: 0 }}
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
                        slotProps={{ min: 0 }}
                    />
                </Stack>
                {soLuong > 0 && sang + trua + toi > soLuong && (
                    <Typography color="error" variant="caption">
                        Tổng liều ({sang + trua + toi}) vượt quá số lượng thuốc
                        ({soLuong})
                    </Typography>
                )}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                >
                    <Autocomplete
                        size="small"
                        options={CACH_SU_DUNG_OPTIONS}
                        value={CACH_SU_DUNG_OPTIONS.find(
                            (o) => o.value === cachSuDung,
                        )}
                        onChange={(_, v) => setCachSuDung(v?.value || "uong")}
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
    }),
);

export default function DonThuocForm({ open, onClose, onSave, initialItems }) {
    const [rows, setRows] = useState([]);
    const rowRefs = useRef(new Map());
    const [openKhoThuoc, setOpenKhoThuoc] = useState(false);
    const [saveError, setSaveError] = useState("");
    const { fetchAll, getCache } = useThuocList();

    const handleKhoThuocConfirm = useCallback((items) => {
        setRows((prev) => {
            const existingMas = new Set(
                prev.map((r) => r.initial?.ma_thuoc_vtyt).filter(Boolean),
            );
            const newItems = items
                .filter((item) => !existingMas.has(item.ma_thuoc_vtyt))
                .map((item) => ({
                    key: genKey(),
                    initial: {
                        ma_thuoc_vtyt: item.ma_thuoc_vtyt,
                        ten_thuoc_vtyt: item.ten_thuoc_vtyt,
                        don_vi_tinh: item.don_vi_tinh,
                        so_luong: item.so_luong,
                        so_luong_max: item.so_luong_max,
                    },
                }));
            return newItems.length === 0 ? prev : [...prev, ...newItems];
        });
        setOpenKhoThuoc(false);
    }, []);

    useEffect(() => {
        if (!open) return;
        setSaveError("");
        let cancelled = false;

        (async () => {
            const allItems = await fetchAll();
            if (cancelled) return;

            const stockByMa = {};
            allItems.forEach(
                (item) => (stockByMa[item.ma_thuoc_vtyt] = item.so_luong),
            );

            const next =
                initialItems?.length > 0
                    ? initialItems.map((it) => ({
                          key: genKey(),
                          initial: {
                              ...it,
                              so_luong_max:
                                  stockByMa[it.ma_thuoc_vtyt] ?? Infinity,
                          },
                      }))
                    : [];
            setRows(next);
            rowRefs.current = new Map();
        })();

        return () => {
            cancelled = true;
        };
    }, [open, initialItems, fetchAll]);

    const handleRemove = useCallback((key) => {
        setRows((prev) => prev.filter((r) => r.key !== key));
    }, []);

    const handleSave = useCallback(() => {
        const items = [];
        const errors = [];
        setSaveError("");
        rowRefs.current.forEach((ref) => {
            const data = ref.getData();
            if (!data.ma_thuoc_vtyt) return;
            const total = (data.sang || 0) + (data.trua || 0) + (data.toi || 0);
            if (total > data.so_luong) {
                errors.push(
                    `${data.ten_thuoc_vtyt}: tổng liều ${total} > số lượng ${data.so_luong}`,
                );
                return;
            }
            items.push(data);
        });
        if (errors.length > 0) {
            setSaveError(errors.join("\n"));
            return;
        }
        if (items.length === 0) return;
        onSave(items);
        onClose();
    }, [onSave, onClose]);

    const validCount = rows.length;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "space-between",
                    fontSize: 20,
                    fontWeight: 600,
                }}
            >
                Kê đơn thuốc
                <Button
                    startIcon={<MedicalServicesIcon />}
                    variant="outlined"
                    onClick={() => setOpenKhoThuoc(true)}
                    size="small"
                >
                    Kho thuốc
                </Button>
            </DialogTitle>
            <DialogContent dividers>
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
                    {rows.length === 0 && (
                        <Typography
                            color="text.secondary"
                            sx={{ textAlign: "center", py: 4 }}
                        >
                            Đơn thuốc trống
                        </Typography>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={validCount === 0}
                >
                    Lưu đơn thuốc
                </Button>
            </DialogActions>
            {saveError && (
                <Typography
                    color="error"
                    variant="caption"
                    sx={{ px: 3, pb: 1, whiteSpace: "pre-line" }}
                >
                    {saveError}
                </Typography>
            )}

            <KhoThuocDialog
                open={openKhoThuoc}
                onClose={() => setOpenKhoThuoc(false)}
                onConfirm={handleKhoThuocConfirm}
                cachedItems={getCache()}
            />
        </Dialog>
    );
}
