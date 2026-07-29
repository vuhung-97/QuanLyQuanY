import { useState, useMemo } from "react";
import { Card, CardContent, Dialog, DialogContent, Grid, Typography } from "@mui/material";
import DataTable from "@/components/common/DataTable.jsx";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import KhamSucKhoeForm from "@/components/KhamSucKhoe/KiemTraSucKhoe/KhamSucKhoeForm.jsx";
import { ALL_TABS } from "@/constants/khamSucKhoeConstants.js";

const LAM_SANG_FIELDS = [
    { key: "tim_mach_loai", label: "Tim mạch" },
    { key: "ho_hap_loai", label: "Hô hấp" },
    { key: "tieu_hoa_loai", label: "Tiêu hóa" },
    { key: "than_tiet_nieu_sinh_duc_nam_loai", label: "Thận tiết niệu - SD Nam" },
    { key: "tam_than_than_kinh_loai", label: "Tâm thần - Thần kinh" },
    { key: "co_xuong_khop_loai", label: "Cơ xương khớp" },
    { key: "noi_tiet_chuyen_hoa_mien_dich_loai", label: "Nội tiết - Chuyển hóa" },
    { key: "benh_mau_loai", label: "Bệnh máu" },
    { key: "ngoai_khoa_loai", label: "Ngoại khoa" },
    { key: "da_lieu_loai", label: "Da liễu" },
    { key: "phu_san_loai", label: "Phụ sản" },
    { key: "tai_mui_hong_loai", label: "Tai Mũi Họng" },
    { key: "rang_ham_mat_loai", label: "Răng Hàm Mặt" },
];

const LAM_SANG_LABEL_TO_KEY = Object.fromEntries(LAM_SANG_FIELDS.map((f) => [f.label, f.key]));

const COLUMNS_LAM_SANG = [
    { key: "label", label: "Chuyên khoa", sx: { minWidth: 200 } },
    {
        key: "value",
        label: "Số lượng",
        sx: { width: 100, textAlign: "center" },
        render: (row) => (
            <span style={{ fontWeight: 600, color: row.value > 0 ? "#EF4444" : undefined }}>
                {row.value}
            </span>
        ),
    },
];

const COLUMNS_BENH_TAT = [
    { key: "ten", label: "Bệnh tật theo dõi", sx: { minWidth: 250 } },
    { key: "so_luong", label: "Số ca", sx: { width: 100, textAlign: "center" } },
];

const SOLDIER_COLUMNS = [
    { key: "stt", label: "STT" },
    { key: "ma_quan_nhan", label: "Mã QN", sx: { color: "primary.main" } },
    { key: "ho_ten", label: "Họ tên" },
    { key: "don_vi", label: "Đơn vị" },
    { key: "cap_bac", label: "Cấp bậc" },
];

function LamSangDialog({ lamSangBatThuong, soldiers, phieuMap, allUnitLookup, maLichKham, nam }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedQuanNhan, setSelectedQuanNhan] = useState(null);

    const filteredSoldiers = useMemo(() => {
        if (!selectedLabel || !soldiers || !phieuMap) return [];
        const fieldKey = LAM_SANG_LABEL_TO_KEY[selectedLabel];
        if (!fieldKey) return [];
        return soldiers
            .filter((s) => {
                const phieu = phieuMap[s.ma_quan_nhan];
                const ls = phieu?.kham_lam_sang || {};
                return ls[fieldKey] && ls[fieldKey] !== "Loại 1";
            })
            .map((s, idx) => ({
                ...s,
                stt: idx + 1,
                don_vi: (allUnitLookup?.get(s.ma_don_vi)) || s.don_vi || s.ten_don_vi || "",
            }));
    }, [selectedLabel, soldiers, phieuMap, allUnitLookup]);

    const handleRowClick = (row) => {
        setSelectedLabel(row.label);
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
        setSelectedLabel(null);
    };

    return (
        <>
            <DataTable
                columns={COLUMNS_LAM_SANG}
                rows={lamSangBatThuong}
                onRowClick={handleRowClick}
                minWidth={300}
                emptyMessage="Không có dữ liệu."
            />

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
                slotProps={{ paper: { sx: { bgcolor: (theme) => theme.palette.background.paper } } }}
                sx={{ "& .MuiDialog-paper": { height: "70vh" } }}
            >
                <DialogTitleWrapper>
                    Danh sách quân nhân - Lâm sàng bất thường: {selectedLabel}
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
                            Không có quân nhân nào với bất thường {selectedLabel}.
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
                    unitLookup={allUnitLookup}
                />
            )}
        </>
    );
}

function BenhTatDialog({ benhTat, soldiers, phieuMap, allUnitLookup, maLichKham, nam }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBenh, setSelectedBenh] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedQuanNhan, setSelectedQuanNhan] = useState(null);

    const filteredSoldiers = useMemo(() => {
        if (!selectedBenh || !soldiers || !phieuMap) return [];
        return soldiers
            .filter((s) => {
                const phieu = phieuMap[s.ma_quan_nhan];
                const benh = phieu?.ket_luan?.benh_tat_theo_doi;
                if (!benh || typeof benh !== "string") return false;
                return benh.split(",").some((b) => b.trim().replace(/\s+/g, " ").toLowerCase() === selectedBenh);
            })
            .map((s, idx) => ({
                ...s,
                stt: idx + 1,
                don_vi: (allUnitLookup?.get(s.ma_don_vi)) || s.don_vi || s.ten_don_vi || "",
            }));
    }, [selectedBenh, soldiers, phieuMap, allUnitLookup]);

    const handleRowClick = (row) => {
        setSelectedBenh(row.ten);
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
        setSelectedBenh(null);
    };

    return (
        <>
            {benhTat && benhTat.length > 0 ? (
                <DataTable
                    columns={COLUMNS_BENH_TAT}
                    rows={benhTat}
                    onRowClick={handleRowClick}
                    minWidth={300}
                    emptyMessage="Không có dữ liệu."
                />
            ) : (
                <Typography color="text.secondary" sx={{ fontStyle: "italic", py: 2, textAlign: "center" }}>
                    Không có dữ liệu bệnh tật.
                </Typography>
            )}

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
                slotProps={{ paper: { sx: { bgcolor: (theme) => theme.palette.background.paper } } }}
                sx={{ "& .MuiDialog-paper": { height: "70vh" } }}
            >
                <DialogTitleWrapper>
                    Danh sách quân nhân - Bệnh: {selectedBenh}
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
                            Không có quân nhân nào mắc bệnh {selectedBenh}.
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
                    unitLookup={allUnitLookup}
                />
            )}
        </>
    );
}

export default function KetQuaKhamLamSangBenh({ lamSangBatThuong, benhTat, soldiers, phieuMap, maLichKham, nam, stats, allUnitLookup }) {
    return (
        <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                            Lâm sàng bất thường
                        </Typography>
                        <LamSangDialog
                            lamSangBatThuong={lamSangBatThuong}
                            soldiers={soldiers}
                            phieuMap={phieuMap}
                            allUnitLookup={allUnitLookup}
                            maLichKham={maLichKham}
                            nam={nam}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                            Bệnh tật phát hiện
                        </Typography>
                        <BenhTatDialog
                            benhTat={benhTat}
                            soldiers={soldiers}
                            phieuMap={phieuMap}
                            allUnitLookup={allUnitLookup}
                            maLichKham={maLichKham}
                            nam={nam}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}