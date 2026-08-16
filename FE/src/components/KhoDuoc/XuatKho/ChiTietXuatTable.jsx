import { memo } from "react";
import {
    Button,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const ChiTietXuatTable = memo(function ChiTietXuatTable({ items, isView, onAdd, onRemove, onQuantityChange, thucXuatEditable = false, onThucXuatChange }) {
    return (
        <>
            <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Danh sách thuốc / VTYT
                </Typography>
                {!isView && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                    >
                        Thêm thuốc
                    </Button>
                )}
            </Stack>

            {items.length > 0 && (
                <TableContainer>
                    <Table size="small" sx={{ minWidth: 400 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    Tên thuốc
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    ĐVT
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: 600 }}
                                    align="right"
                                >
                                    Số lượng
                                </TableCell>
                                {isView && (
                                    <TableCell
                                        sx={{ fontWeight: 600 }}
                                        align="right"
                                    >
                                        Thực xuất
                                    </TableCell>
                                )}
                                <TableCell sx={{ width: 50 }} />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.ma_thuoc_vtyt}>
                                    <TableCell>{item.ten_thuoc_vtyt}</TableCell>
                                    <TableCell>
                                        {item.don_vi_tinh || "—"}
                                    </TableCell>
                                    <TableCell align="right">
                                        {isView ? (
                                            item.so_luong
                                        ) : (
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={item.so_luong}
                                                onChange={(e) =>
                                                    onQuantityChange(
                                                        item.ma_thuoc_vtyt,
                                                        e.target.value,
                                                    )
                                                }
                                                slotProps={{
                                                    htmlInput: {
                                                        min: 1,
                                                        max:
                                                            item.so_luong_max ??
                                                            999999,
                                                        style: {
                                                            textAlign: "right",
                                                        },
                                                    },
                                                }}
                                                sx={{ width: 80 }}
                                            />
                                        )}
                                    </TableCell>
                                    {isView && (
                                        <TableCell align="right">
                                            {thucXuatEditable ? (
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={
                                                        item.so_luong_thuc_xuat ??
                                                        item.so_luong
                                                    }
                                                    onChange={(e) =>
                                                        onThucXuatChange(
                                                            item.ma_thuoc_vtyt,
                                                            e.target.value,
                                                        )
                                                    }
                                                    slotProps={{
                                                        htmlInput: {
                                                            min: 0,
                                                            max: Math.min(
                                                                item.so_luong,
                                                                item.so_luong_max ??
                                                                    item.so_luong,
                                                            ),
                                                            style: {
                                                                textAlign:
                                                                    "right",
                                                            },
                                                        },
                                                    }}
                                                    sx={{ width: 80 }}
                                                />
                                            ) : (
                                                item.so_luong_thuc_xuat ??
                                                item.so_luong
                                            )}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        {!isView && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    onRemove(item.ma_thuoc_vtyt)
                                                }
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {items.length === 0 && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 1 }}
                >
                    Chưa có thuốc nào.
                </Typography>
            )}
        </>
    );
});

export default ChiTietXuatTable;
