import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";

export default function BenhTable({ rows }) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Nhóm bệnh</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Số ca</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Tỉ lệ (%)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((r, i) => (
                        <TableRow key={i}>
                            <TableCell>{r.ten_nhom}</TableCell>
                            <TableCell align="right">{r.so_ca}</TableCell>
                            <TableCell align="right">{r.ty_le}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
