import { memo, useCallback, useState } from "react";
import {
    Autocomplete,
    Button,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    AutoAwesome as AutoAwesomeIcon,
    Delete as DeleteIcon,
    Inventory2 as KhoIcon,
} from "@mui/icons-material";
import KhoThuocDialog from "@/components/KhamBenhChoQN/KhamBenh/KhoThuocDialog.jsx";
import NumberField from "@/components/common/NumberField.jsx";

const DVT_OPTIONS = ["Viên", "Lọ", "Chai", "Hộp", "Ống", "Tuýp", "Gói", "Vỉ", "Lít", "Ml", "Kg", "Gam"];

const DuTruRow = memo(function DuTruRow({
    rowKey, initialItem, onUpdateItem, onRemoveItem, isView, isLast,
}) {
    const [tenThuoc, setTenThuoc] = useState(initialItem?.tenThuoc || "");
    const [donViTinh, setDonViTinh] = useState(initialItem?.donViTinh || "");
    const [soLuong, setSoLuong] = useState(initialItem?.soLuong ?? 1);

    const handleTenThuoc = useCallback((e) => {
        setTenThuoc(e.target.value);
        onUpdateItem(rowKey, "tenThuoc", e.target.value);
    }, [rowKey, onUpdateItem]);

    const handleDonViTinh = useCallback((_, val) => {
        setDonViTinh(val || "");
        onUpdateItem(rowKey, "donViTinh", val || "");
    }, [rowKey, onUpdateItem]);

    const handleSoLuong = useCallback((e) => {
        const v = Math.max(1, parseInt(e.target.value) || 1);
        setSoLuong(v);
        onUpdateItem(rowKey, "soLuong", v);
    }, [rowKey, onUpdateItem]);

    const handleRemove = useCallback(() => {
        onRemoveItem(rowKey);
    }, [rowKey, onRemoveItem]);

    return (
        <TableRow>
            <TableCell sx={{ verticalAlign: "top", py: 1.5 }}>
                <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                    {isLast ? "…" : null}
                </Typography>
            </TableCell>
            <TableCell sx={{ py: 1 }}>
                <TextField
                    size="small"
                    placeholder="Nhập tên thuốc..."
                    value={tenThuoc}
                    onChange={handleTenThuoc}
                    disabled={isView}
                    sx={{ width: "100%", minWidth: 200 }}
                />
            </TableCell>
            <TableCell sx={{ py: 1 }}>
                <Autocomplete
                    size="small"
                    freeSolo
                    options={DVT_OPTIONS}
                    value={donViTinh}
                    onInputChange={handleDonViTinh}
                    disabled={isView}
                    renderInput={(params) => (
                        <TextField {...params} placeholder="ĐVT" size="small" />
                    )}
                    sx={{ minWidth: 100 }}
                />
            </TableCell>
            <TableCell sx={{ py: 1 }}>
                <NumberField
                    label="SL"
                    size="small"
                    value={soLuong}
                    onChange={handleSoLuong}
                    slotProps={{ htmlInput: { min: 1 } }}
                    disabled={isView}
                    sx={{ width: 100 }}
                />
            </TableCell>
            <TableCell sx={{ py: 1 }}>
                {!isView && (
                    <IconButton
                        color="error"
                        size="small"
                        onClick={handleRemove}
                        disabled={false}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
            </TableCell>
        </TableRow>
    );
});

const ChiTietDuTruTable = memo(function ChiTietDuTruTable({
    keys, getItem, onUpdateItem, onRemoveItem, onAddItem,
    onAddFromKhoThuoc, openKhoThuoc, onOpenKhoThuoc, onCloseKhoThuoc, isView,
    onAutoCreate, loadingAuto,
}) {
    return (
        <>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2.5, mb: 1 }}>
                Danh sách thuốc / VTYT
            </Typography>

            <Table size="small" sx={{ "@media print": { display: "none" } }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600, width: 50 }}>STT</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Tên thuốc / VTYT</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 120 }}>ĐVT</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 120 }}>Số lượng</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 50 }} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {keys.map((key, idx) => (
                        <DuTruRow
                            key={key}
                            rowKey={key}
                            initialItem={getItem(idx)}
                            onUpdateItem={onUpdateItem}
                            onRemoveItem={onRemoveItem}
                            isView={isView}
                            isLast={idx === keys.length - 1}
                        />
                    ))}
                </TableBody>
            </Table>

            {!isView && (
                <>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                        <Button startIcon={<AddIcon />} onClick={onAddItem} variant="outlined">
                            Thêm dòng
                        </Button>
                        <Button
                            startIcon={<KhoIcon />}
                            onClick={onOpenKhoThuoc}
                            variant="outlined"
                            color="info"
                        >
                            Mở kho thuốc
                        </Button>
                        <Button
                            startIcon={<AutoAwesomeIcon />}
                            onClick={onAutoCreate}
                            variant="outlined"
                            color="success"
                            disabled={loadingAuto}
                        >
                            {loadingAuto ? "Đang tạo..." : "Tạo tự động"}
                        </Button>
                    </Stack>

                    <KhoThuocDialog
                        open={openKhoThuoc}
                        onClose={onCloseKhoThuoc}
                        onConfirm={onAddFromKhoThuoc}
                    />
                </>
            )}
        </>
    );
});

export default ChiTietDuTruTable;
