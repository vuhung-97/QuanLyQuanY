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
    Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

export default function ChiTietXuatTable({ items, isView, onAdd, onRemove }) {
    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
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
                                        {item.so_luong}
                                    </TableCell>
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
}
