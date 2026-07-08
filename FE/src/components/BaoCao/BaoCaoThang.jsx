import {
    Box, Card, CardContent, Grid, Stack, Typography,
    TextareaAutosize,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import useBaoCaoThang from "@/hooks/useBaoCaoThang.js";
import BaoCaoToolbar from "./BaoCaoToolbar.jsx";
import PhanLoaiBenhChart from "./PhanLoaiBenhChart.jsx";
import StatCard from "./StatCard.jsx";
import BenhTable from "./BenhTable.jsx";

export default function BaoCaoThang() {
    const { thang, nam, data, loading, error, fetchData, handleExport, setThang, setNam } = useBaoCaoThang();

    const soSanhData = data ? [
        { name: "Lượt khám", "Tháng này": data.so_sanh_thang_truoc.luot_kham.thang_nay, "Tháng trước": data.so_sanh_thang_truoc.luot_kham.thang_truoc },
        { name: "Nội trú", "Tháng này": data.so_sanh_thang_truoc.noi_tru.thang_nay, "Tháng trước": data.so_sanh_thang_truoc.noi_tru.thang_truoc },
    ] : [];

    return (
        <Stack spacing={3}>
            <BaoCaoToolbar
                thang={thang}
                nam={nam}
                onThangChange={setThang}
                onNamChange={setNam}
                onExport={handleExport}
                onRefresh={fetchData}
            />

            {loading && <Typography>Đang tải...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {data && (
                <>
                    <Typography variant="h6" fontWeight={700}>
                        BÁO CÁO THỐNG KÊ QUÂN Y THÁNG {data.thang}/{data.nam}
                    </Typography>

                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <StatCard label="Lượt khám" value={data.tong_quan.tong_luot_kham} />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <StatCard label="Nội trú" value={data.tong_quan.tong_noi_tru} />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <StatCard label="Chuyển tuyến" value={data.tong_quan.tong_chuyen_tuyen} />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <StatCard label="Đơn thuốc" value={data.tong_quan.tong_don_thuoc} />
                        </Grid>
                    </Grid>

                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                                PHÂN LOẠI BỆNH KHÁM NGOẠI TRÚ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <PhanLoaiBenhChart data={data.phan_loai_benh_kham} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <BenhTable rows={data.phan_loai_benh_kham} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                                BỆNH NỘI TRÚ (NẰM BỆNH XÁ)
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <PhanLoaiBenhChart data={data.phan_loai_benh_noi_tru} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <BenhTable rows={data.phan_loai_benh_noi_tru} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                                SO SÁNH VỚI THÁNG TRƯỚC
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={soSanhData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Tháng này" fill="#00B4D8" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Tháng trước" fill="#0B3B60" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                                ĐÁNH GIÁ CHUNG
                            </Typography>
                            <TextareaAutosize
                                minRows={3}
                                placeholder="CNQY nhận xét..."
                                style={{ width: "100%", padding: 8, fontFamily: "inherit", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
                            />
                            <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                                <Typography variant="body2">Ngày lập: {data.ngay_lap}</Typography>
                                <Typography variant="body2">Người lập: _________________</Typography>
                                <Typography variant="body2">Xác nhận: _________________</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </>
            )}
        </Stack>
    );
}
