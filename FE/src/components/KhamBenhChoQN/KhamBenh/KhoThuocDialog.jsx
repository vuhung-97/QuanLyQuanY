import {
    Fragment,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    TableCell,
    TableRow,
    TextField,
    Typography,
    Stack,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";
import StatusFilter from "@/components/common/StatusFilter.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import useThuocList from "@/hooks/useThuocList.jsx";

const GroupRow = memo(function GroupRow({
    item,
    selected,
    quantity,
    onToggle,
    onQuantityChange,
}) {
    return (
        <TableRow hover selected={selected}>
            <TableCell sx={{ py: 0.5 }}>
                <Checkbox
                    checked={selected}
                    onChange={() => onToggle(item.ma_thuoc_vtyt)}
                    size="small"
                />
            </TableCell>
            <TableCell sx={{ py: 0.5, fontWeight: 600 }}>
                {item.ten_thuoc_vtyt}
            </TableCell>
            <TableCell sx={{ py: 0.5 }}>{item.don_vi_tinh || "--"}</TableCell>
            <TableCell sx={{ py: 0.5 }}>{item.so_luong}</TableCell>
            <TableCell sx={{ py: 0.5 }}>
                <TextField
                    size="small"
                    type="number"
                    value={selected ? (quantity ?? "") : ""}
                    onChange={(e) =>
                        onQuantityChange(
                            item.ma_thuoc_vtyt,
                            e.target.value,
                            item.so_luong,
                        )
                    }
                    disabled={!selected}
                    slotProps={{ htmlInput: { min: 1, max: item.so_luong } }}
                    sx={{ width: 90 }}
                    placeholder="SL"
                />
            </TableCell>
        </TableRow>
    );
});

export default function KhoThuocDialog({
    open,
    onClose,
    onConfirm,
    cachedItems,
}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [phanLoaiFilter, setPhanLoaiFilter] = useState("");
    const [selected, setSelected] = useState(new Set());
    const [quantities, setQuantities] = useState({});
    const [error, setError] = useState("");
    const { fetchAll } = useThuocList();

    useEffect(() => {
        if (!open) return;
        setSelected(new Set());
        setQuantities({});
        setSearchText("");
        setPhanLoaiFilter("");
        setError("");

        if (cachedItems) {
            setItems(cachedItems);
            return;
        }

        setLoading(true);
        fetchAll()
            .then((all) => setItems(all))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [open, cachedItems, fetchAll]);

    const phanLoaiOptions = useMemo(() => {
        const s = new Set(items.map((i) => i.phan_loai).filter(Boolean));
        return [...s].sort();
    }, [items]);

    const displayItems = useMemo(() => {
        let filtered = items;
        if (phanLoaiFilter) {
            filtered = filtered.filter(
                (item) => item.phan_loai === phanLoaiFilter,
            );
        }
        if (!searchText) return filtered;
        const q = searchText.toLowerCase();
        return filtered.filter(
            (item) =>
                item.ten_thuoc_vtyt.toLowerCase().includes(q) ||
                (item.phan_loai || "").toLowerCase().includes(q),
        );
    }, [items, phanLoaiFilter, searchText]);

    const grouped = useMemo(() => {
        const map = {};
        for (const item of displayItems) {
            const group = item.phan_loai || "Chưa phân loại";
            if (!map[group]) map[group] = [];
            map[group].push(item);
        }
        return map;
    }, [displayItems]);

    const sortedGroups = useMemo(() => Object.keys(grouped).sort(), [grouped]);

    const selectedCount = selected.size;

    const handleToggle = useCallback((ma) => {
        setSelected((prev) => {
            const copy = new Set(prev);
            if (copy.has(ma)) copy.delete(ma);
            else copy.add(ma);
            return copy;
        });
        setQuantities((prev) => {
            if (prev[ma] !== undefined) {
                const next = { ...prev };
                delete next[ma];
                return next;
            }
            return { ...prev, [ma]: 1 };
        });
    }, []);

    const handleQuantityChange = useCallback((ma, raw, stock) => {
        const val =
            raw === ""
                ? ""
                : Math.min(stock, Math.max(1, parseInt(raw, 10) || 1));
        setQuantities((prev) => ({ ...prev, [ma]: val }));
    }, []);

    const handleConfirm = useCallback(() => {
        const selectedItems = [];
        const errors = [];

        for (const item of items) {
            if (!selected.has(item.ma_thuoc_vtyt)) continue;
            const qty = quantities[item.ma_thuoc_vtyt];
            if (qty === "" || qty === undefined || qty === null || qty < 1) {
                errors.push(`${item.ten_thuoc_vtyt}: số lượng phải lớn hơn 0`);
                continue;
            }
            if (qty > item.so_luong) {
                errors.push(
                    `${item.ten_thuoc_vtyt}: số lượng vượt quá tồn kho (${item.so_luong})`,
                );
                continue;
            }
            selectedItems.push({
                ma_thuoc_vtyt: item.ma_thuoc_vtyt,
                ten_thuoc_vtyt: item.ten_thuoc_vtyt,
                don_vi_tinh: item.don_vi_tinh,
                so_luong: qty,
                so_luong_max: item.so_luong,
            });
        }

        if (selectedItems.length === 0) {
            setError("Vui lòng chọn ít nhất một thuốc.");
            return;
        }

        if (errors.length > 0) {
            setError(errors.join("\n"));
            return;
        }

        setError("");
        onConfirm(selectedItems);
        onClose();
    }, [items, selected, quantities, onConfirm, onClose]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{ paper: { sx: { height: "80vh" } } }}
        >
            <DialogTitleWrapper wrap={false}>Kho thuốc</DialogTitleWrapper>
            <DialogContent dividers>
                <Stack sx={{ overflow: "hidden", pb: 0 }}>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center", mb: 2 }}
                    >
                        <SearchBarDebounced
                            onSearch={setSearchText}
                            placeholder="Tìm kiếm theo tên hoặc phân loại..."
                        />
                        <StatusFilter
                            value={phanLoaiFilter}
                            onChange={setPhanLoaiFilter}
                            options={phanLoaiOptions.map((o) => ({
                                value: o,
                                label: o,
                            }))}
                            label="Phân loại"
                        />
                    </Stack>

                    {loading ? (
                        <Typography
                            color="text.secondary"
                            sx={{ py: 2, textAlign: "center" }}
                        >
                            Đang tải...
                        </Typography>
                    ) : displayItems.length === 0 ? (
                        <Typography
                            color="text.secondary"
                            sx={{ py: 2, textAlign: "center" }}
                        >
                            Không tìm thấy thuốc.
                        </Typography>
                    ) : (
                        <DataTable
                            columns={[
                                {
                                    key: "checkbox",
                                    label: "",
                                    sx: { width: 40 },
                                },
                                { key: "ten_thuoc_vtyt", label: "Tên thuốc" },
                                {
                                    key: "don_vi_tinh",
                                    label: "ĐVT",
                                    sx: { width: 70 },
                                },
                                {
                                    key: "so_luong",
                                    label: "Tồn kho",
                                    sx: { width: 70 },
                                },
                                {
                                    key: "sl_lay",
                                    label: "SL lấy",
                                    sx: { width: 110 },
                                },
                            ]}
                        >
                            {sortedGroups.map((group) => (
                                <Fragment key={group}>
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            sx={{
                                                py: 0.5,
                                                color: "primary.main",
                                                fontWeight: 700,
                                                textTransform: "uppercase",
                                                fontSize: 12,
                                                letterSpacing: 0.5,
                                            }}
                                        >
                                            {group}
                                        </TableCell>
                                    </TableRow>
                                    {grouped[group].map((item) => (
                                        <GroupRow
                                            key={item.ma_thuoc_vtyt}
                                            item={item}
                                            selected={selected.has(
                                                item.ma_thuoc_vtyt,
                                            )}
                                            quantity={
                                                quantities[item.ma_thuoc_vtyt]
                                            }
                                            onToggle={handleToggle}
                                            onQuantityChange={
                                                handleQuantityChange
                                            }
                                        />
                                    ))}
                                </Fragment>
                            ))}
                        </DataTable>
                    )}

                    {error && (
                        <Typography
                            color="error"
                            variant="caption"
                            sx={{
                                mt: 1,
                                display: "block",
                                whiteSpace: "pre-line",
                            }}
                        >
                            {error}
                        </Typography>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Đã chọn: {selectedCount} thuốc
                </Typography>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={selectedCount === 0}
                >
                    Thêm {selectedCount > 0 ? `(${selectedCount})` : ""} vào đơn
                </Button>
            </DialogActions>
        </Dialog>
    );
}
