import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Dialog,
    DialogContent,
    Grid,
    Typography,
} from "@mui/material";
import PhanLoaiBenhChart from "./PhanLoaiBenhChart.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import KhamBenhForm from "@/components/KhamBenhChoQN/KhamBenh/KhamBenhForm.jsx";
import ChiTietBenhAn from "@/components/NoiTru/DanhSachNoiTru/ChiTietBenhAn.jsx";
import { PHAN_LOAI_COLUMNS } from "@/constants/bao_cao.js";
import { baoCaoService } from "@/services/baoCaoService.js";

const SOLDIER_COLUMNS = [
    { key: "stt", label: "STT" },
    { key: "ma_quan_nhan", label: "Mã QN", sx: { color: "primary.main" } },
    { key: "ho_ten", label: "Họ tên" },
    { key: "ten_don_vi", label: "Đơn vị" },
    { key: "cap_bac", label: "Cấp bậc" },
];

function SheetDialog({ open, onClose, title, loai, maNhom, thang, nam }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [khamFormOpen, setKhamFormOpen] = useState(false);
    const [selectedExaminationId, setSelectedExaminationId] = useState(null);
    const [benhAnFormOpen, setBenhAnFormOpen] = useState(false);
    const [selectedBenhAnId, setSelectedBenhAnId] = useState(null);

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        baoCaoService.getChiTietNhomBenh(loai, maNhom, thang, nam)
            .then((res) => {
                const list = res.data || [];
                setRows(list.map((r, idx) => ({ ...r, stt: idx + 1 })));
            })
            .catch(() => setRows([]))
            .finally(() => setLoading(false));
    }, [open, loai, maNhom, thang, nam]);

    const handleSoldierClick = (row) => {
        if (loai === "noi_tru") {
            setSelectedBenhAnId(row.ma_benh_an);
            setBenhAnFormOpen(true);
        } else {
            setSelectedExaminationId(row.ma_kham_benh);
            setKhamFormOpen(true);
        }
    };

    const handleCloseForm = () => {
        setKhamFormOpen(false);
        setBenhAnFormOpen(false);
        setSelectedExaminationId(null);
        setSelectedBenhAnId(null);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: (theme) => theme.palette.background.paper,
                        },
                    },
                }}
                sx={{ "& .MuiDialog-paper": { height: "70vh" } }}
            >
                <DialogTitleWrapper>
                    {title} - Danh sách quân nhân
                </DialogTitleWrapper>
                <DialogContent dividers sx={{ px: 3 }}>
                    {!loading && rows.length === 0 ? (
                        <Typography
                            color="text.secondary"
                            sx={{
                                fontStyle: "italic",
                                py: 4,
                                textAlign: "center",
                            }}
                        >
                            Không có dữ liệu.
                        </Typography>
                    ) : (
                        <DataTable
                            columns={SOLDIER_COLUMNS}
                            rows={rows}
                            onRowClick={handleSoldierClick}
                            loading={loading}
                            minWidth={500}
                            emptyMessage="Không có dữ liệu."
                        />
                    )}
                </DialogContent>
            </Dialog>

            {selectedExaminationId && (
                <KhamBenhForm
                    open={khamFormOpen}
                    examinationId={selectedExaminationId}
                    onClose={handleCloseForm}
                    readOnly
                />
            )}

            {selectedBenhAnId && (
                <ChiTietBenhAn
                    open={benhAnFormOpen}
                    benhAnId={selectedBenhAnId}
                    onClose={handleCloseForm}
                    readOnly
                />
            )}
        </>
    );
}

function ChartSection({ title, loai, data, thang, nam }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMaNhom, setSelectedMaNhom] = useState(null);
    const canClick = Boolean(thang);

    const handleRowClick = (row) => {
        if (!canClick) return;
        setSelectedMaNhom(row.ma_nhom);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedMaNhom(null);
    };

    return (
        <Card sx={{ width: "100%", height: "500px" }}>
            <CardContent>
                <Typography variant="h3" sx={{ mb: 2, color: "primary.main" }}>
                    {title}
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <PhanLoaiBenhChart data={data} title={title} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <DataTable
                            columns={PHAN_LOAI_COLUMNS}
                            rows={data}
                            onRowClick={canClick ? handleRowClick : undefined}
                            minWidth={300}
                            sx={{ maxHeight: 400, overflow: "auto" }}
                        />
                    </Grid>
                </Grid>
            </CardContent>

            {selectedMaNhom && (
                <SheetDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    title={title}
                    loai={loai}
                    maNhom={selectedMaNhom}
                    thang={thang}
                    nam={nam}
                />
            )}
        </Card>
    );
}

export default function BaoCaoThangCharts({ data, thang, nam }) {
    if (!nam) return null;

    return (
        <>
            <ChartSection
                title="Khám chữa bệnh ngoại trú"
                loai="kham"
                data={data.phan_loai_benh_kham}
                thang={thang}
                nam={nam}
            />
            <ChartSection
                title="Khám chữa bệnh nội trú"
                loai="noi_tru"
                data={data.phan_loai_benh_noi_tru}
                thang={thang}
                nam={nam}
            />
        </>
    );
}
