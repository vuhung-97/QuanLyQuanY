import { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    Dialog,
    DialogContent,
    Grid,
    Typography,
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";
import DataTable from "@/components/common/DataTable.jsx";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import KhamSucKhoeForm from "@/components/KhamSucKhoe/KiemTraSucKhoe/KhamSucKhoeForm.jsx";
import { ALL_TABS } from "@/constants/khamSucKhoeConstants.js";

const PHAN_LOAI_COLUMNS = [
    { key: "name", label: "Loại sức khỏe", sx: { fontWeight: 600 } },
    { key: "value", label: "Số lượng", sx: { width: 100, textAlign: "center" } },
    {
        key: "ty_le",
        label: "Tỷ lệ",
        sx: { width: 100, textAlign: "center" },
        render: (row) => `${row.ty_le}%`,
    },
];

const SOLDIER_COLUMNS = [
    { key: "stt", label: "STT" },
    { key: "ma_quan_nhan", label: "Mã QN", sx: { color: "primary.main" } },
    { key: "ho_ten", label: "Họ tên" },
    { key: "don_vi", label: "Đơn vị" },
    { key: "cap_bac", label: "Cấp bậc" },
];

const renderBarLabel = (props) => {
    const { x, y, width, payload } = props;
    if (!payload) return null;
    return (
        <text x={x + width + 6} y={y + 10} fill="#64748B" fontSize={11} dominantBaseline="middle">
            {payload.value} ({payload.ty_le}%)
        </text>
    );
};

function PhanLoaiTable({ phanBoPhanLoai, soldiers, phieuMap, maLichKham, nam, unitLookup }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLoai, setSelectedLoai] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedQuanNhan, setSelectedQuanNhan] = useState(null);

    const filteredSoldiers = useMemo(() => {
        if (!selectedLoai || !soldiers || !phieuMap) return [];
        return soldiers
            .filter((s) => {
                const phieu = phieuMap[s.ma_quan_nhan];
                return phieu?.ket_luan?.phan_loai_suc_khoe === selectedLoai;
            })
            .map((s, idx) => ({
                ...s,
                stt: idx + 1,
                don_vi: (unitLookup && unitLookup[s.ma_don_vi]) || s.don_vi || s.ten_don_vi || "",
            }));
    }, [selectedLoai, soldiers, phieuMap, unitLookup]);

    const handleRowClick = (row) => {
        setSelectedLoai(row.name);
        setDialogOpen(true);
    };

    const handleSoldierClick = (soldier) => {
        setSelectedQuanNhan(soldier);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setSelectedQuanNhan(null);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedLoai(null);
    };

    return (
        <>
            <Card sx={{ borderRadius: 3, height: "465px" }}>
                <CardContent>
                    <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                        Bảng phân loại sức khỏe
                    </Typography>
                    <DataTable
                        columns={PHAN_LOAI_COLUMNS}
                        rows={phanBoPhanLoai}
                        onRowClick={handleRowClick}
                        minWidth={300}
                        emptyMessage="Không có dữ liệu."
                    />
                </CardContent>
            </Card>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: { sx: { bgcolor: (theme) => theme.palette.background.paper } },
                }}
                sx={{ "& .MuiDialog-paper": { height: "70vh" } }}
            >
                <DialogTitleWrapper>
                    Danh sách quân nhân - Phân loại {selectedLoai}
                </DialogTitleWrapper>
                <DialogContent dividers sx={{ px: 3 }}>
                    {filteredSoldiers.length > 0 ? (
                        <DataTable
                            columns={SOLDIER_COLUMNS}
                            rows={filteredSoldiers}
                            onRowClick={handleSoldierClick}
                            minWidth={500}
                            emptyMessage="Không có dữ liệu."
                        />
                    ) : (
                        <Typography color="text.secondary" sx={{ fontStyle: "italic", py: 4, textAlign: "center" }}>
                            Không có quân nhân nào được phân loại {selectedLoai}.
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>

            {selectedQuanNhan && (
                <KhamSucKhoeForm
                    open={formOpen}
                    onClose={handleCloseForm}
                    quanNhan={selectedQuanNhan}
                    existingPhieu={phieuMap[selectedQuanNhan.ma_quan_nhan] || null}
                    maLichKham={maLichKham}
                    nam={nam}
                    readOnly
                    allowedTabs={ALL_TABS}
                    editableTabs={[]}
                />
            )}
        </>
    );
}

function DonViChart({ phanBoPhanLoai }) {
    if (!phanBoPhanLoai || phanBoPhanLoai.length === 0) return null;
    return (
        <Card sx={{ borderRadius: 3, height: "465px" }}>
            <CardContent>
                <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                    Phân loại sức khỏe theo 6 loại
                </Typography>
                <ResponsiveContainer width="100%" height={380}>
                    <BarChart data={phanBoPhanLoai} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value} người (${props.payload.ty_le}%)`,
                                props.payload.name,
                            ]}
                            contentStyle={{
                                borderRadius: 8,
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                            {phanBoPhanLoai.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} />
                            ))}
                            <LabelList dataKey="value" content={renderBarLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default function KetQuaKhamSection5({ phanBoPhanLoai, soldiers, phieuMap, maLichKham, nam, stats }) {
    if (!phanBoPhanLoai || phanBoPhanLoai.length === 0) return null;

    const unitLookup = useMemo(() => {
        const dvList = stats?.danh_sach_don_vi || [];
        const map = {};
        dvList.forEach((dv) => { map[dv.ma_don_vi] = dv.ten_don_vi; });
        return map;
    }, [stats]);

    return (
        <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
                <PhanLoaiTable
                    phanBoPhanLoai={phanBoPhanLoai}
                    soldiers={soldiers}
                    phieuMap={phieuMap}
                    maLichKham={maLichKham}
                    nam={nam}
                    unitLookup={unitLookup}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <DonViChart phanBoPhanLoai={phanBoPhanLoai} />
            </Grid>
        </Grid>
    );
}