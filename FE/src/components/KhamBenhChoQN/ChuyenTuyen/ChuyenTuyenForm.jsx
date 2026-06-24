import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import DatePicker from "@/components/common/DatePicker.jsx";

export default function ChuyenTuyenForm({
    open,
    selectedExam,
    examDetail,
    loading,
    giayGt,
    diTuyen,
    saving,
    onClose,
    onSave,
}) {
    const [tenBenhVien, setTenBenhVien] = useState("");
    const [yKienDeNghi, setYKienDeNghi] = useState("");
    const [thoiGianDen, setThoiGianDen] = useState(null);
    const [chanDoan, setChanDoan] = useState("");
    const [quyetDinhYSinh, setQuyetDinhYSinh] = useState("");
    const [ngayVe, setNgayVe] = useState(null);
    const [chanDoanLucVe, setChanDoanLucVe] = useState("");
    const [ketQuaDieuTri, setKetQuaDieuTri] = useState("");

    useEffect(() => {
        if (!open) return;
        setTenBenhVien(giayGt?.ten_benh_vien || "");
        setYKienDeNghi(giayGt?.y_kien_de_nghi || "");
        setThoiGianDen(
            giayGt?.thoi_gian_den_benh_vien
                ? dayjs(giayGt.thoi_gian_den_benh_vien)
                : null,
        );
        setChanDoan(giayGt?.chan_doan || "");
        setQuyetDinhYSinh(giayGt?.quyet_dinh_y_sinh || "");
        setNgayVe(diTuyen?.ngay_ve ? dayjs(diTuyen.ngay_ve) : null);
        setChanDoanLucVe(diTuyen?.chan_doan_luc_ve || "");
        setKetQuaDieuTri(diTuyen?.ket_qua_huong_dieu_tri || "");
    }, [open, giayGt, diTuyen]);

    const isNew = !giayGt?.ma_giay_gt;

    const handleSave = () => {
        const giayData = {
            ten_benh_vien: tenBenhVien,
            y_kien_de_nghi: yKienDeNghi,
            thoi_gian_den_benh_vien: thoiGianDen?.toISOString() || null,
            chan_doan: chanDoan,
            quyet_dinh_y_sinh: quyetDinhYSinh,
        };
        const diTuyenData = {};
        if (ngayVe) diTuyenData.ngay_ve = ngayVe.format("YYYY-MM-DD");
        if (chanDoanLucVe) diTuyenData.chan_doan_luc_ve = chanDoanLucVe;
        if (ketQuaDieuTri) diTuyenData.ket_qua_huong_dieu_tri = ketQuaDieuTri;
        onSave(giayData, diTuyenData);
    };

    const handlePrint = () => {
        window.print();
    };

    const prescriptionRows = useMemo(() => {
        if (!examDetail?.don_thuoc) return [];
        const rows = [];
        for (const dt of examDetail.don_thuoc) {
            for (const ct of dt.chi_tiet_don_thuoc || []) {
                const hdt = ct.huong_dieu_tri || "";
                const parts = hdt.split(" | ");
                const lieu = parts[0] || "";
                const thoiDiem = parts[1] || "";
                const cachDung = parts[2] || "";
                const ghiChu = parts.slice(3).join(" | ");
                rows.push({
                    ten_thuoc: ct.ten_thuoc_vtyt || ct.ma_thuoc_vtyt,
                    so_luong: ct.so_luong,
                    don_vi_tinh: ct.don_vi_tinh || "",
                    lieu,
                    thoi_diem: thoiDiem,
                    cach_dung: cachDung,
                    ghi_chu: ghiChu,
                });
            }
        }
        return rows;
    }, [examDetail]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        "@media print": {
                            boxShadow: "none",
                            width: "100%",
                            maxWidth: "100%",
                        },
                    },
                },
            }}
        >
            <Box sx={{ "@media print": { display: "none" } }}>
                <DialogTitle sx={{ pb: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 22,
                            fontWeight: 600,
                            textAlign: "center",
                        }}
                    >
                        Giấy giới thiệu
                    </Typography>
                </DialogTitle>
            </Box>

            <DialogContent sx={{ pt: 0 }}>
                {loading ? (
                    <Typography
                        color="text.secondary"
                        sx={{ py: 4, textAlign: "center" }}
                    >
                        Đang tải...
                    </Typography>
                ) : !selectedExam ? (
                    <Typography
                        color="text.secondary"
                        sx={{ py: 4, textAlign: "center" }}
                    >
                        Không tìm thấy thông tin.
                    </Typography>
                ) : (
                    <Stack spacing={2.5}>
                        {/* ===== PRINT HEADER ===== */}
                        <Box
                            className="print-only-header"
                            sx={{
                                display: "none",
                                "@media print": { display: "block", mb: 3 },
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    textAlign: "center",
                                    mb: 2,
                                }}
                            >
                                GIẤY GIỚI THIỆU
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ textAlign: "center", msTouchSelect: 2 }}
                            >
                                Kính gửi:{" "}
                                {tenBenhVien ||
                                    "................................"}
                            </Typography>
                        </Box>

                        {/* ===== A. PATIENT INFO ===== */}
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 1,
                                    fontWeight: 700,
                                    color: "text.primary",
                                }}
                            >
                                Thông tin quân nhân
                            </Typography>
                            <Stack spacing={0.5}>
                                <Typography variant="body1">
                                    <strong>Họ tên:</strong>{" "}
                                    {selectedExam.ho_ten || "--"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Đơn vị:</strong>{" "}
                                    {selectedExam.ten_don_vi || "--"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Mã KB:</strong>{" "}
                                    {selectedExam.ma_kham_benh || "--"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Ngày khám:</strong>{" "}
                                    {selectedExam.ngay_kham
                                        ? new Date(
                                              selectedExam.ngay_kham,
                                          ).toLocaleDateString("vi-VN")
                                        : "--"}
                                </Typography>
                            </Stack>
                        </Box>

                        {/* ===== B. SYMPTOMS & DIAGNOSIS ===== */}
                        {examDetail?.trieu_chung && (
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 700,
                                        color: "text.primary",
                                    }}
                                >
                                    Triệu chứng
                                </Typography>
                                <Typography variant="body1">
                                    {examDetail.trieu_chung}
                                </Typography>
                            </Box>
                        )}

                        {examDetail?.chan_doan && (
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 700,
                                        color: "text.primary",
                                    }}
                                >
                                    Chẩn đoán
                                </Typography>
                                <Typography variant="body1">
                                    {examDetail.chan_doan}
                                </Typography>
                            </Box>
                        )}

                        {examDetail?.phuong_phap_dieu_tri && (
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 700,
                                        color: "text.primary",
                                    }}
                                >
                                    Phương pháp điều trị
                                </Typography>
                                <Typography variant="body1">
                                    {examDetail.phuong_phap_dieu_tri}
                                </Typography>
                            </Box>
                        )}

                        {/* ===== C. PRESCRIPTION ===== */}
                        {prescriptionRows.length > 0 && (
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 700,
                                        color: "text.primary",
                                    }}
                                >
                                    Đơn thuốc đã kê
                                </Typography>
                                <Table
                                    size="small"
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: "#F4F7F9" }}>
                                            <TableCell sx={{ width: 40 }}>
                                                STT
                                            </TableCell>
                                            <TableCell>Tên thuốc</TableCell>
                                            <TableCell sx={{ width: 80 }}>
                                                Số lượng
                                            </TableCell>
                                            <TableCell sx={{ width: 60 }}>
                                                ĐVT
                                            </TableCell>
                                            <TableCell>
                                                Hướng dẫn sử dụng
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {prescriptionRows.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    {row.ten_thuoc}
                                                </TableCell>
                                                <TableCell>
                                                    {row.so_luong}
                                                </TableCell>
                                                <TableCell>
                                                    {row.don_vi_tinh}
                                                </TableCell>
                                                <TableCell>
                                                    {row.huong_dieu_tri ||
                                                        row.lieu}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}

                        {/* ===== D. CHUYỂN TUYẾN INPUTS ===== */}
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 1,
                                    fontWeight: 700,
                                    color: "text.primary",
                                }}
                            >
                                Thông tin chuyển tuyến
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    label="Đơn vị chuyển đến"
                                    value={tenBenhVien}
                                    onChange={(e) =>
                                        setTenBenhVien(e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                />
                                <TextField
                                    label="Ý kiến đề nghị"
                                    value={yKienDeNghi}
                                    onChange={(e) =>
                                        setYKienDeNghi(e.target.value)
                                    }
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    size="small"
                                />
                            </Stack>
                        </Box>

                        {/* ===== E. SAU KHI VỀ INPUTS ===== */}
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 1,
                                    fontWeight: 700,
                                    color: "text.primary",
                                }}
                            >
                                Sau khi quân nhân về
                            </Typography>
                            <Stack spacing={2}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ alignItems: "center" }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ minWidth: 220 }}
                                    >
                                        Thời gian đến bệnh viện, bệnh xá:
                                    </Typography>
                                    <DatePicker
                                        value={thoiGianDen}
                                        onChange={setThoiGianDen}
                                        size="small"
                                    />
                                </Stack>
                                <TextField
                                    label="Chẩn đoán"
                                    value={chanDoan}
                                    onChange={(e) =>
                                        setChanDoan(e.target.value)
                                    }
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    size="small"
                                />
                                <TextField
                                    label="Quyết định của y sinh"
                                    value={quyetDinhYSinh}
                                    onChange={(e) =>
                                        setQuyetDinhYSinh(e.target.value)
                                    }
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    size="small"
                                />
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ alignItems: "center" }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ minWidth: 220 }}
                                    >
                                        Ngày về:
                                    </Typography>
                                    <DatePicker
                                        value={ngayVe}
                                        onChange={setNgayVe}
                                        size="small"
                                    />
                                </Stack>
                                <TextField
                                    label="Chẩn đoán lúc về"
                                    value={chanDoanLucVe}
                                    onChange={(e) =>
                                        setChanDoanLucVe(e.target.value)
                                    }
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    size="small"
                                />
                                <TextField
                                    label="Kết quả hướng điều trị"
                                    value={ketQuaDieuTri}
                                    onChange={(e) =>
                                        setKetQuaDieuTri(e.target.value)
                                    }
                                    multiline
                                    minRows={2}
                                    fullWidth
                                    size="small"
                                />
                            </Stack>
                        </Box>

                        {/* ===== PRINT SIGNATURE ===== */}
                        <Box
                            className="print-only-signature"
                            sx={{
                                display: "none",
                                "@media print": { display: "block", mt: 4 },
                            }}
                        >
                            <Typography variant="body2">
                                Ngày ... tháng ... năm ...
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ mt: 4, textAlign: "right" }}
                            >
                                Y sĩ/Bác sĩ
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ textAlign: "right" }}
                            >
                                (ký, ghi rõ họ tên)
                            </Typography>
                        </Box>

                        {/* ===== PRINT PAGE 2 ===== */}
                        <Box
                            className="print-page-2"
                            sx={{
                                display: "none",
                                "@media print": {
                                    display: "block",
                                    pageBreakBefore: "always",
                                    mt: 4,
                                },
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    textAlign: "center",
                                    mb: 4,
                                }}
                            >
                                TRANG TIẾP THEO
                            </Typography>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="body1">
                                        <strong>
                                            Thời gian đến bệnh viện, bệnh xá:
                                        </strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {thoiGianDen?.format(
                                            "DD/MM/YYYY HH:mm",
                                        ) ||
                                            "........................................"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1">
                                        <strong>Chẩn đoán:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {chanDoan ||
                                            "........................................"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1">
                                        <strong>Quyết định của y sinh:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {quyetDinhYSinh ||
                                            "........................................"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </DialogContent>

            <Box sx={{ "@media print": { display: "none" } }}>
                <DialogActions>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        variant="outlined"
                        onClick={handlePrint}
                        disabled={!selectedExam}
                    >
                        In giấy giới thiệu
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={saving || !selectedExam}
                        sx={{ textTransform: "none" }}
                    >
                        {saving ? "Đang xử lý..." : "Lưu"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
