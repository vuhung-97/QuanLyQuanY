import {
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

export default function DataTable({
    columns = [],
    rows,
    loading = false,
    emptyMessage = "Không có dữ liệu.",
    getRowKey = (row, idx) => idx,
    onRowClick,
    rowSx,
    sx,
    children,
    minWidth = 700,
}) {
    const hasChildren = children != null;
    const hasRows = rows != null && rows.length > 0;

    return (
        <TableContainer sx={sx}>
            <Table sx={{ minWidth }}>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={col.key}
                                sx={{ fontWeight: 700, color: "text.primary", ...col.sx }}
                                align={col.align || "left"}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading && (
                        <TableRow>
                            <TableCell colSpan={columns.length} sx={{ p: 0 }}>
                                <LinearProgress />
                            </TableCell>
                        </TableRow>
                    )}
                    {!loading && !hasChildren && !hasRows && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                align="center"
                                sx={{ py: 6, color: "text.secondary" }}
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                    {hasChildren
                        ? children
                        : rows?.map((row, idx) => (
                              <TableRow
                                  key={getRowKey(row, idx)}
                                  hover
                                  sx={typeof rowSx === "function" ? rowSx(row) : rowSx}
                                  onClick={() => onRowClick?.(row)}
                                  style={onRowClick ? { cursor: "pointer" } : undefined}
                              >
                                  {columns.map((col) => (
                                      <TableCell
                                          key={col.key}
                                          align={col.align || "left"}
                                          sx={col.sx}
                                      >
                                          {col.render ? col.render(row, idx) : row[col.key]}
                                      </TableCell>
                                  ))}
                              </TableRow>
                          ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
