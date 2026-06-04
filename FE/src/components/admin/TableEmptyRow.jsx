import { TableCell, TableRow } from "@mui/material";

export default function TableEmptyRow({ colSpan, message }) {
    return (
        <TableRow>
            <TableCell
                colSpan={colSpan}
                align="center"
                sx={{ py: 5, color: "text.secondary" }}
            >
                {message}
            </TableCell>
        </TableRow>
    );
}
