import { forwardRef, memo } from "react";
import {
    Box,
    Card,
    CardContent,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import useFormTab from "@/hooks/useFormTab";
import { DEFAULT_PHAN_LOAI } from "@/constants/khamSucKhoeConstants.js";
import PhanLoaiSelect from "../common/PhanLoaiSelect.jsx";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";

const XN_TABLE_COLUMNS = [
    { key: "yeu_cau", label: "Yêu cầu xét nghiệm" },
    { key: "ket_qua", label: "Kết quả" },
    { key: "don_vi", label: "Đơn vị" },
    { key: "ghi_chu", label: "Ghi chú" },
    { key: "khoang_tham_chieu", label: "Khoảng tham chiếu" },
    { key: "qtkt", label: "QTKT" },
    { key: "may_xet_nghiem", label: "Máy xét nghiệm" },
];

function trangThaiGhiChu(ghiChu) {
    const g = (ghiChu || "").toLowerCase();
    if (g.includes("tăng")) return "tang";
    if (g.includes("giảm")) return "giam";
    return null;
}

const BangXetNghiem = memo(function BangXetNghiem({ rows }) {
    if (!rows || rows.length === 0) {
        return (
            <Typography color="text.secondary" sx={{ py: 3 }}>
                Chưa có kết quả xét nghiệm.
            </Typography>
        );
    }

    return (
        <>
            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 2 }}
            >
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {XN_TABLE_COLUMNS.map((col) => (
                                <TableCell
                                    key={col.key}
                                    sx={{ fontWeight: 700 }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, idx) => {
                            const trangThai = trangThaiGhiChu(row.ghi_chu);
                            const mau =
                                trangThai === "tang"
                                    ? "error"
                                    : trangThai === "giam"
                                      ? "info"
                                      : null;
                            return (
                                <TableRow
                                    key={idx}
                                    hover
                                    sx={
                                        mau
                                            ? {
                                                  backgroundColor: (theme) =>
                                                      `${theme.palette[mau].main}18`,
                                              }
                                            : undefined
                                    }
                                >
                                    {XN_TABLE_COLUMNS.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            sx={
                                                col.key === "ket_qua" && mau
                                                    ? {
                                                          color: (theme) =>
                                                              theme.palette[mau]
                                                                  .main,
                                                          fontWeight: 700,
                                                      }
                                                    : undefined
                                            }
                                        >
                                            {row[col.key] || ""}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Box
                    component="span"
                    sx={{ color: "error.main", fontWeight: 700 }}
                >
                    ● Tăng
                </Box>
                <Box
                    component="span"
                    sx={{ color: "info.main", fontWeight: 700 }}
                >
                    ● Giảm
                </Box>
            </Stack>
        </>
    );
});

const XetNghiemTab = memo(
    forwardRef(function XetNghiemTab(
        { initialData, cardStyle, readOnly = false, phanLoai },
        ref,
    ) {
        const { dataRef } = useFormTab(initialData, ref);

        if (dataRef.current.phan_loai === undefined) {
            dataRef.current.phan_loai = phanLoai || DEFAULT_PHAN_LOAI;
        }

        const rows = Array.isArray(initialData) ? initialData : [];

        return (
            <Card sx={cardStyle}>
                <CardContent>
                    <BangXetNghiem rows={rows} />
                    <Box sx={{ mt: 2, maxWidth: 400 }}>
                        <PhanLoaiSelect
                            name="phan_loai"
                            label="Phân loại kết quả xét nghiệm"
                            dataRef={dataRef}
                            readOnly={readOnly}
                            gridProps={false}
                        />
                    </Box>
                </CardContent>
            </Card>
        );
    }),
);

export default XetNghiemTab;
