import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import DatePicker from "@/components/common/DatePicker.jsx";

export default function NhapKhoItemTable({
    items,
    isView,
    hasDuTruCol,
    onUpdateItem,
    onRemoveItem,
}) {
    const columnCount = 5 + (hasDuTruCol ? 1 : 0) + (isView ? 0 : 1);

    return (
        <TableContainer>
            <Table size="small" sx={{ minWidth: 720 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Thuốc / VTYT
                        </TableCell>
                        {hasDuTruCol && (
                            <TableCell
                                sx={{ fontWeight: 600 }}
                                align="right"
                            >
                                SL dự trù
                            </TableCell>
                        )}
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                            SL nhập
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                            Đơn giá
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">
                            Số lô
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">
                            Hạn sử dụng
                        </TableCell>
                        {!isView && <TableCell sx={{ width: 40 }} />}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columnCount}
                                align="center"
                                sx={{
                                    py: 3,
                                    color: "text.secondary",
                                }}
                            >
                                Chưa có thuốc nào.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((it, idx) => (
                            <TableRow key={`${it.ma_thuoc_vtyt}-${idx}`}>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {it.ten_thuoc_vtyt}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {it.ma_thuoc_vtyt}
                                        {it.don_vi_tinh
                                            ? ` · ${it.don_vi_tinh}`
                                            : ""}
                                    </Typography>
                                </TableCell>
                                {hasDuTruCol && (
                                    <TableCell align="right">
                                        {it.soLuongDuTru != null
                                            ? it.soLuongDuTru
                                            : "—"}
                                    </TableCell>
                                )}
                                <TableCell align="right">
                                    {isView ? (
                                        <Typography variant="body2">
                                            {it.soLuong}
                                        </Typography>
                                    ) : (
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={it.soLuong}
                                            onChange={(e) =>
                                                onUpdateItem(idx, {
                                                    soLuong: e.target.value,
                                                })
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    min: 0,
                                                    step: 1,
                                                    sx: {
                                                        textAlign: "right",
                                                        width: 70,
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {isView ? (
                                        <Typography variant="body2">
                                            {it.donGia !== "" &&
                                            it.donGia != null
                                                ? Number(it.donGia).toLocaleString(
                                                      "vi-VN",
                                                  )
                                                : "—"}
                                        </Typography>
                                    ) : (
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={it.donGia}
                                            onChange={(e) =>
                                                onUpdateItem(idx, {
                                                    donGia: e.target.value,
                                                })
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    min: 0,
                                                    step: 1000,
                                                    sx: {
                                                        textAlign: "right",
                                                        width: 110,
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {isView ? (
                                        <Typography variant="body2">
                                            {it.soLo || "—"}
                                        </Typography>
                                    ) : (
                                        <TextField
                                            size="small"
                                            value={it.soLo}
                                            onChange={(e) =>
                                                onUpdateItem(idx, {
                                                    soLo: e.target.value,
                                                })
                                            }
                                            slotProps={{
                                                htmlInput: {
                                                    sx: {
                                                        textAlign: "center",
                                                        width: 100,
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {isView ? (
                                        <Typography variant="body2">
                                            {it.hanSuDung
                                                ? it.hanSuDung.format(
                                                      "DD/MM/YYYY",
                                                  )
                                                : "—"}
                                        </Typography>
                                    ) : (
                                        <DatePicker
                                            value={it.hanSuDung}
                                            onChange={(d) =>
                                                onUpdateItem(idx, {
                                                    hanSuDung: d,
                                                })
                                            }
                                            size="small"
                                        />
                                    )}
                                </TableCell>
                                {!isView && (
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onRemoveItem(idx)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}