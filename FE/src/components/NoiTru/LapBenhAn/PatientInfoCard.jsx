import { memo } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

function InfoRow({ label, value }) {
    return (
        <Box>
            <Typography variant="body2" color="text.secondary">
                {label} <strong>{value}</strong>
            </Typography>
        </Box>
    );
}

const PatientInfoCard = memo(function PatientInfoCard({ exam, ngayNhapVien }) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "#F8FAFC" }}>
            <CardContent>
                <Stack spacing={1.5}>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ "& > *": { flex: 1, minWidth: 0 } }}
                    >
                        <InfoRow
                            label="Họ tên:"
                            value={`${exam.ho_ten || ""} - ${exam.ma_quan_nhan || ""}`}
                        />
                        <InfoRow
                            label="Ngày sinh:"
                            value={
                                exam.ngay_sinh
                                    ? new Date(exam.ngay_sinh).toLocaleDateString("vi-VN")
                                    : "--"
                            }
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ "& > *": { flex: 1, minWidth: 0 } }}
                    >
                        <InfoRow
                            label="Giới tính:"
                            value={
                                exam.gioi_tinh === true
                                    ? "Nam"
                                    : exam.gioi_tinh === false
                                      ? "Nữ"
                                      : "--"
                            }
                        />
                        <InfoRow
                            label="Nghề nghiệp:"
                            value={exam.nghe_nghiep || "--"}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ "& > *": { flex: 1, minWidth: 0 } }}
                    >
                        <InfoRow
                            label="Cấp bậc:"
                            value={exam.cap_bac || "--"}
                        />
                        <InfoRow
                            label="Chức vụ:"
                            value={exam.chuc_vu || "--"}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ "& > *": { flex: 1, minWidth: 0 } }}
                    >
                        <InfoRow
                            label="Số điện thoại:"
                            value={exam.so_dien_thoai || "--"}
                        />
                        <InfoRow
                            label="Số thẻ BHYT:"
                            value={exam.so_the_bhyt || "--"}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ "& > *": { flex: 1, minWidth: 0 } }}
                    >
                        <InfoRow
                            label="Đơn vị:"
                            value={exam.ten_don_vi || "--"}
                        />                        
                        <InfoRow
                            label="Ngày nhập viện:"
                            value={
                                ngayNhapVien
                                    ? new Date(ngayNhapVien).toLocaleDateString("vi-VN") +
                                      " " +
                                      new Date(ngayNhapVien).toLocaleTimeString("vi-VN")
                                    : "--"
                            }
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ "& > *": { flex: 1, minWidth: 0 } }}
                    >
                        <InfoRow 
                            label="Triệu chứng"
                            value={exam.trieu_chung || "--"}
                        />
                        <InfoRow
                            label="Chẩn đoán:"
                            value={exam.chan_doan || "--"}
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
});

export default PatientInfoCard;
