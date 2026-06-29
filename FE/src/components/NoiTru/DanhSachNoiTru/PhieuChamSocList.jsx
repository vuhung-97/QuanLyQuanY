import { useMemo } from "react";
import {
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

export default function PhieuChamSocList({ records, onEdit }) {
    const sorted = useMemo(() => {
        if (!records || records.length === 0) return [];
        return [...records].sort((a, b) => {
            const tA = a.thoi_gian ? new Date(a.thoi_gian) : 0;
            const tB = b.thoi_gian ? new Date(b.thoi_gian) : 0;
            return tB - tA;
        });
    }, [records]);

    if (!records || records.length === 0) {
        return (
            <Typography color="text.secondary" sx={{ py: 2 }}>
                Chưa có phiếu chăm sóc nào.
            </Typography>
        );
    }

    return (
        <TableContainer>
            <Table size="small" sx={{ border: "1px solid", borderColor: "divider" }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: "#F4F7F9" }}>
                        <TableCell sx={{ width: 40 }}>STT</TableCell>
                        <TableCell sx={{ width: 140 }}>Ngày</TableCell>
                        <TableCell sx={{ width: 80 }}>Giường</TableCell>
                        <TableCell sx={{ width: 80 }}>Phòng</TableCell>
                        <TableCell>Diễn biến</TableCell>
                        <TableCell>Y lệnh</TableCell>
                        <TableCell sx={{ width: 120 }}>Thuốc</TableCell>
                        <TableCell sx={{ width: 60 }}>Sửa</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map((pcs, idx) => (
                        <TableRow key={pcs.ma_phieu_cs || idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>
                                {pcs.thoi_gian
                                    ? new Date(pcs.thoi_gian).toLocaleDateString("vi-VN")
                                    : "--"}
                            </TableCell>
                            <TableCell>{pcs.so_giuong || "--"}</TableCell>
                            <TableCell>{pcs.buong || "--"}</TableCell>
                            <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                                {pcs.theo_doi_dien_bien || "--"}
                            </TableCell>
                            <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                                {pcs.thuc_hien_y_lenh || "--"}
                            </TableCell>
                            <TableCell>
                                {pcs.chi_tiet && pcs.chi_tiet.length > 0
                                    ? `${pcs.chi_tiet.length} loại`
                                    : "--"}
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => onEdit?.(pcs)}
                                    sx={{ textTransform: "none", minWidth: 36 }}
                                >
                                    <EditIcon fontSize="small" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}