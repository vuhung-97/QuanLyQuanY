import {
    Stack, Typography, Card, CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useBaoCaoTonKho from "@/hooks/useBaoCaoTonKho.js";
import { TON_KHO_COLUMNS } from "@/constants/bao_cao.js";
import BaoCaoToolbar from "./BaoCaoToolbar.jsx";

export default function BaoCaoTonKho() {
    const { thang, nam, data, loading, error, fetchData, handleExport, setThang, setNam } = useBaoCaoTonKho();

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
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                BÁO CÁO TỒN KHO THUỐC - VT Y TẾ THÁNG {data.thang}/{data.nam}
                            </Typography>
                            <div style={{ height: 500, width: "100%" }}>
                                <DataGrid
                                    rows={data.danh_sach}
                                    columns={TON_KHO_COLUMNS}
                                    getRowId={(row) => row.ma_thuoc}
                                    pageSizeOptions={[20, 50, 100]}
                                    initialState={{
                                        pagination: { paginationModel: { pageSize: 20 } },
                                    }}
                                    disableRowSelectionOnClick
                                />
                            </div>
                            <Stack direction="row" spacing={4} sx={{ mt: 2, justifyContent: "flex-end" }}>
                                <Typography variant="subtitle2">
                                    Tổng tồn đầu: <strong>{data.tong_ton_dau}</strong>
                                </Typography>
                                <Typography variant="subtitle2">
                                    Tổng nhập: <strong>{data.tong_nhap}</strong>
                                </Typography>
                                <Typography variant="subtitle2">
                                    Tổng xuất: <strong>{data.tong_xuat}</strong>
                                </Typography>
                                <Typography variant="subtitle2">
                                    Tổng tồn cuối: <strong>{data.tong_ton_cuoi}</strong>
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </>
            )}
        </Stack>
    );
}
