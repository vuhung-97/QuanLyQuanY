import {
    Card,
    CardContent,
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {
    Warning as WarningIcon,
    Error as ErrorIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import useTonKhoCanhBao from "@/hooks/useTonKhoCanhBao.js";

function getAlertIcon(ton) {
    if (ton < 100) return <ErrorIcon sx={{ color: "#EF4444", fontSize: 16 }} />;
    if (ton < 200)
        return <WarningIcon sx={{ color: "#F59E0B", fontSize: 16 }} />;
    return <CheckCircleIcon sx={{ color: "#94A3B8", fontSize: 16 }} />;
}

function getAlertColor(ton) {
    if (ton < 100) return "#EF4444";
    if (ton < 200) return "#F59E0B";
    return "#64748B";
}

const columns = [
    { key: "ten_thuoc", label: "Tên thuốc" },
    { key: "loai", label: "Loại" },
    { key: "ton_cuoi_ky", label: "Tồn kho" },
    { key: "don_vi", label: "Đơn vị" },
];

export default function TonKhoCanhBao() {
    const { items, loading } = useTonKhoCanhBao();

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
            }}
        >
            <CardContent sx={{ p: "24px !important" }}>
                <Stack spacing={1.5}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: "#1E293B" }}
                    >
                        Cảnh báo tồn kho
                    </Typography>

                    {loading ? (
                        <Typography color="text.secondary">
                            Đang tải...
                        </Typography>
                    ) : items.length > 0 ? (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((col) => (
                                            <TableCell
                                                key={col.key}
                                                sx={{
                                                    color: "#1E293B",
                                                    fontWeight: 600,
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                    pl:
                                                        col.key === "ten_thuoc"
                                                            ? 0
                                                            : undefined,
                                                }}
                                            >
                                                {col.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                    pl: 0,
                                                    py: 1,
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {getAlertIcon(
                                                        item.ton_cuoi_ky,
                                                    )}
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                        sx={{
                                                            color: "#334155",
                                                        }}
                                                    >
                                                        {item.ten_thuoc}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                    color: "#64748B",
                                                }}
                                            >
                                                {item.loai === "vat_tu"
                                                    ? "VTYT"
                                                    : "Thuốc"}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                    color: getAlertColor(
                                                        item.ton_cuoi_ky,
                                                    ),
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.ton_cuoi_ky}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        "1px solid #F1F5F9",
                                                    color: "#64748B",
                                                }}
                                            >
                                                {item.don_vi || ""}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography color="text.secondary">
                            Tất cả thuốc và vật tư y tế đều đủ tồn kho
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
