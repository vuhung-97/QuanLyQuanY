import { memo } from "react";
import {
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

const DonThuocTable = memo(function DonThuocTable({
    rows = [],
    heading = "Đơn thuốc",
    emptyMessage = "Không có thuốc trong đơn.",
    hideWhenEmpty = false,
}) {
    if (hideWhenEmpty && rows.length === 0) return null;

    return (
        <Box>
            {heading && (
                <Typography
                    variant="h4"
                    sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                >
                    {heading}
                </Typography>
            )}
            {rows.length === 0 ? (
                <Typography color="text.secondary">{emptyMessage}</Typography>
            ) : (
                <Table
                    size="small"
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#F4F7F9" }}>
                            <TableCell sx={{ width: 40 }}>STT</TableCell>
                            <TableCell>Tên thuốc</TableCell>
                            <TableCell sx={{ width: 80 }}>Số lượng</TableCell>
                            <TableCell sx={{ width: 80 }}>ĐVT</TableCell>
                            <TableCell>Hướng dẫn sử dụng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    {row.ten_thuoc ||
                                        row.ten_thuoc_vtyt ||
                                        "--"}
                                </TableCell>
                                <TableCell>{row.so_luong}</TableCell>
                                <TableCell>{row.don_vi_tinh}</TableCell>
                                <TableCell>
                                    <Stack spacing={0.5}>
                                        {row.lieu && (
                                            <Typography variant="body2">
                                                <strong>Liều:</strong>{" "}
                                                {row.lieu}
                                            </Typography>
                                        )}
                                        <Typography variant="body2">
                                            <strong>Cách dùng:</strong>{" "}
                                            {row.cach_dung || "Uống"}
                                            {" | "}
                                            <strong>Thời điểm:</strong>{" "}
                                            {row.thoi_diem || "Sau ăn"}
                                        </Typography>
                                        {row.ghi_chu && (
                                            <Typography variant="body2">
                                                <strong>Ghi chú:</strong>{" "}
                                                {row.ghi_chu}
                                            </Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Box>
    );
});

export default DonThuocTable;
