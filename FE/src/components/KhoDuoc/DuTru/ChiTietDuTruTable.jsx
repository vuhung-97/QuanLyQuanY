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
    Delete as DeleteIcon,
    Inventory2 as KhoIcon,
} from "@mui/icons-material";
import KhoThuocDialog from "@/components/KhamBenhChoQN/KhamBenh/KhoThuocDialog.jsx";

const DVT_OPTIONS = ["Viên", "Lọ", "Chai", "Hộp", "Ống", "Tuýp", "Gói", "Vỉ", "Lít", "Ml", "Kg", "Gam"];

export default function ChiTietDuTruTable({
    items,
    onUpdateItem,
    onRemoveItem,
    onAddItem,
    onAddFromKhoThuoc,
    openKhoThuoc,
    onOpenKhoThuoc,
    onCloseKhoThuoc,
    isView = false,
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
                    {items.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell sx={{ py: 1 }}>
                                <TextField
                                    size="small"
                                    placeholder="Nhập tên thuốc..."
                                    value={item.tenThuoc}
                                    onChange={(e) => onUpdateItem(idx, "tenThuoc", e.target.value)}
                                    disabled={isView}
                                    sx={{ width: "100%", minWidth: 200 }}
                                />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                                <Autocomplete
                                    size="small"
                                    freeSolo
                                    options={DVT_OPTIONS}
                                    value={item.donViTinh}
                                    onInputChange={(_, val) => onUpdateItem(idx, "donViTinh", val)}
                                    disabled={isView}
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="ĐVT" size="small" />
                                    )}
                                    sx={{ minWidth: 100 }}
                                />
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                                <TextField
                                    label="SL"
                                    type="number"
                                    size="small"
                                    value={item.soLuong}
                                    onChange={(e) =>
                                        onUpdateItem(
                                            idx,
                                            "soLuong",
                                            Math.max(1, parseInt(e.target.value) || 1),
                                        )
                                    }
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
                                        onClick={() => onRemoveItem(idx)}
                                        disabled={items.length === 1}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </TableCell>
                        </TableRow>
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
}
