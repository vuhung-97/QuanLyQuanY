import { memo, useEffect, useRef, useState } from "react";
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
import NumberField from "@/components/common/NumberField.jsx";
import { Delete as DeleteIcon } from "@mui/icons-material";
import DatePicker from "@/components/common/DatePicker.jsx";

const NhapKhoTableRow = memo(function NhapKhoTableRow({
    it,
    idx,
    isView,
    hasDuTruCol,
    onUpdateItem,
    onRemoveItem,
}) {
    const soLuongFocused = useRef(false);
    const donGiaFocused = useRef(false);
    const soLoFocused = useRef(false);

    const [soLuong, setSoLuong] = useState(it.soLuong ?? "");
    const [donGia, setDonGia] = useState(it.donGia ?? "");
    const [soLo, setSoLo] = useState(it.soLo ?? "");

    useEffect(() => {
        if (!soLuongFocused.current) setSoLuong(it.soLuong ?? "");
    }, [it.soLuong]);

    useEffect(() => {
        if (!donGiaFocused.current) setDonGia(it.donGia ?? "");
    }, [it.donGia]);

    useEffect(() => {
        if (!soLoFocused.current) setSoLo(it.soLo ?? "");
    }, [it.soLo]);

    const commitBlur = (field) => {
        if (field === "soLuong") {
            soLuongFocused.current = false;
            onUpdateItem(idx, { soLuong });
        } else if (field === "donGia") {
            donGiaFocused.current = false;
            onUpdateItem(idx, { donGia });
        } else {
            soLoFocused.current = false;
            onUpdateItem(idx, { soLo });
        }
    };

    const commitEnter = (e, field) => {
        if (e.key === "Enter") e.currentTarget.blur();
    };

    return (
        <TableRow key={it.ma_thuoc_vtyt}>
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
                        {soLuong}
                    </Typography>
                ) : (
                    <NumberField
                        size="small"
                        value={soLuong}
                        onFocus={() => (soLuongFocused.current = true)}
                        onBlur={() => commitBlur("soLuong")}
                        onKeyDown={(e) => commitEnter(e, "soLuong")}
                        onChange={(e) => setSoLuong(e.target.value)}
                        min={0}
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
                        {donGia !== "" && donGia != null
                            ? Number(donGia).toLocaleString("vi-VN")
                            : "—"}
                    </Typography>
                ) : (
                    <NumberField
                        size="small"
                        value={donGia}
                        onFocus={() => (donGiaFocused.current = true)}
                        onBlur={() => commitBlur("donGia")}
                        onKeyDown={(e) => commitEnter(e, "donGia")}
                        onChange={(e) => setDonGia(e.target.value)}
                        min={0}
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
                        {soLo || "—"}
                    </Typography>
                ) : (
                    <TextField
                        size="small"
                        value={soLo}
                        onFocus={() => (soLoFocused.current = true)}
                        onBlur={() => commitBlur("soLo")}
                        onKeyDown={(e) => commitEnter(e, "soLo")}
                        onChange={(e) => setSoLo(e.target.value)}
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
                            ? it.hanSuDung.format("DD/MM/YYYY")
                            : "—"}
                    </Typography>
                ) : (
                    <DatePicker
                        value={it.hanSuDung}
                        onChange={(d) =>
                            onUpdateItem(idx, { hanSuDung: d })
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
    );
});

const NhapKhoItemTable = memo(function NhapKhoItemTable({
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
                            <NhapKhoTableRow
                                key={it.ma_thuoc_vtyt}
                                it={it}
                                idx={idx}
                                isView={isView}
                                hasDuTruCol={hasDuTruCol}
                                onUpdateItem={onUpdateItem}
                                onRemoveItem={onRemoveItem}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default NhapKhoItemTable;