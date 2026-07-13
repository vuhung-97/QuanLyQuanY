import { useState, useMemo } from "react";
import {
    Stack, Button, Card, CardContent, Typography, Box, Chip,
} from "@mui/material";
import {
    PersonSearch as PersonSearchIcon,
} from "@mui/icons-material";
import ChonQuanNhanDialog from "@/components/common/ChonQuanNhanDialog.jsx";
import PatientInfoCard from "@/components/common/PatientInfoCard.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import LoadingAlert from "@/components/common/LoadingAlert.jsx";
import useBaoCaoQuanNhan from "@/hooks/useBaoCaoQuanNhan.jsx";
import KhamSucKhoeForm from "@/components/KhamSucKhoe/KiemTraSucKhoe/KhamSucKhoeForm.jsx";
import KhamBenhForm from "@/components/KhamBenhChoQN/KhamBenh/KhamBenhForm.jsx";
import ChiTietBenhAn from "@/components/NoiTru/DanhSachNoiTru/ChiTietBenhAn.jsx";
import ChuyenTuyenForm from "@/components/KhamBenhChoQN/ChuyenTuyen/ChuyenTuyenForm.jsx";

const CARD_HEIGHT = 600;
const CARD_SX = { borderRadius: 3, height: CARD_HEIGHT };
const DATA_TABLE_SX = { maxHeight: CARD_HEIGHT - 100, overflow: "auto" };

function formatDateShort(d) {
    if (!d) return "—";
    const s = d.split("T")[0];
    return s || "—";
}

const LONG_TEXT_SX = { maxHeight: 80, overflowY: "auto" };

function StatusChip({ value, map }) {
    const item = map?.[value];
    if (!item) return <Typography variant="body2" color="text.secondary">—</Typography>;
    return (
        <Chip
            label={item.label}
            color={item.color}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600, minWidth: 90 }}
        />
    );
}

const KSK_STATUS = {
    chua_kham: { label: "Chưa khám", color: "default" },
    dang_kham:  { label: "Đang khám", color: "warning" },
    da_kham:    { label: "Đã khám", color: "success" },
};

const KB_STATUS = {
    chờ:             { label: "Chờ khám", color: "default" },
    đang_khám:       { label: "Đang khám", color: "info" },
    chờ_nhận_thuốc:  { label: "Chờ nhận thuốc", color: "warning" },
    đã_nhận_thuốc:   { label: "Đã nhận thuốc", color: "success" },
    đã_khám:         { label: "Đã xong", color: "success" },
    chuyển_tuyến:    { label: "Chuyển tuyến", color: "error" },
    nhập_viện:       { label: "Nhập viện", color: "secondary" },
};

const BA_STATUS = {
    đang_điều_trị: { label: "Đang điều trị", color: "info" },
    đã_ra_viện:    { label: "Đã ra viện", color: "success" },
};

const CT_STATUS = {
    đề_nghị_chuyển_tuyến: { label: "Đề nghị chuyển tuyến", color: "warning" },
    đã_chuyển_tuyến:      { label: "Đã chuyển tuyến", color: "info" },
    đã_về:                { label: "Đã về", color: "success" },
};

const KSK_COLUMNS = [
    { key: "nam", label: "Năm", sx: { width: "15%" } },
    { key: "ma_phieu_kham", label: "Mã phiếu", sx: { width: "30%", color: "primary.main" } },
    { key: "phan_loai", label: "Phân loại SK", sx: { width: "25%" } },
    { key: "trang_thai", label: "Trạng thái", sx: { width: "15%" }, render: (row) => (
        <StatusChip value={row.trang_thai} map={KSK_STATUS} />
    )},
];

const KB_COLUMNS = [
    { key: "ngay_kham", label: "Ngày khám", sx: { width: "15%" } },
    { key: "trieu_chung", label: "Triệu chứng", render: (row) => (
        <Box sx={LONG_TEXT_SX}>{row.trieu_chung || "—"}</Box>
    )},
    { key: "chan_doan", label: "Chẩn đoán", render: (row) => (
        <Box sx={LONG_TEXT_SX}>{row.chan_doan || "—"}</Box>
    )},
    { key: "trang_thai", label: "Trạng thái", sx: { width: "15%" }, render: (row) => (
        <StatusChip value={row.trang_thai} map={KB_STATUS} />
    )},
];

const BA_COLUMNS = [
    { key: "ngay_nhap_vien", label: "Ngày nhập viện", sx: { width: "15%" } },
    { key: "ngay_ra_vien", label: "Ngày ra viện", sx: { width: "15%" } },
    { key: "phong_giuong", label: "Phòng/Giường", sx: { width: "20%" } },
    { key: "chan_doan", label: "Chẩn đoán", render: (row) => (
        <Box sx={LONG_TEXT_SX}>{row.chan_doan || "—"}</Box>
    )},
    { key: "trang_thai", label: "Trạng thái", sx: { width: "15%" }, render: (row) => (
        <StatusChip value={row.trang_thai} map={BA_STATUS} />
    )},
];

const CT_COLUMNS = [
    { key: "ngay_kham", label: "Ngày", sx: { width: "15%" } },
    { key: "ten_benh_vien", label: "Bệnh viện", sx: { width: "25%" } },
    { key: "y_kien_de_nghi", label: "Lý do", sx: { width: "35%" } },
    { key: "chuyen_tuyen_status", label: "Trạng thái", sx: { width: "20%" }, render: (row) => (
        <StatusChip value={row.chuyen_tuyen_status} map={CT_STATUS} />
    )},
];

export default function BaoCaoQuanNhanMain() {
    const {
        quanNhan, setQuanNhan,
        kskList, khamBenhList, benhAnList, chuyenTuyenList,
        loading, error,
    } = useBaoCaoQuanNhan();

    const [openChonQn, setOpenChonQn] = useState(false);

    const [dialogKsk, setDialogKsk] = useState({ open: false, record: null });
    const [dialogKb, setDialogKb] = useState({ open: false, record: null });
    const [dialogBa, setDialogBa] = useState({ open: false, record: null });
    const [dialogCt, setDialogCt] = useState({ open: false, record: null });

    const kskRows = useMemo(() => kskList.map((p) => {
        const kl = typeof p.ket_luan === "string"
            ? JSON.parse(p.ket_luan || "{}")
            : (p.ket_luan || {});
        return {
            ...p,
            phan_loai: kl.phan_loai_suc_khoe || "Loại 1",
        };
    }), [kskList]);

    const kbRows = useMemo(() => khamBenhList.map((p) => ({
        ...p,
        ngay_kham: formatDateShort(p.ngay_kham),
    })), [khamBenhList]);

    const baRows = useMemo(() => benhAnList.map((p) => ({
        ...p,
        ngay_nhap_vien: formatDateShort(p.ngay_nhap_vien),
        ngay_ra_vien: formatDateShort(p.ngay_ra_vien),
        phong_giuong: [p.ten_buong, p.ten_giuong].filter(Boolean).join(" / ") || "—",
    })), [benhAnList]);

    const ctRows = useMemo(() => chuyenTuyenList.map((p) => ({
        ...p,
        ngay_kham: formatDateShort(p.ngay_kham),
    })), [chuyenTuyenList]);

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    startIcon={<PersonSearchIcon />}
                    onClick={() => setOpenChonQn(true)}
                >
                    Chọn quân nhân
                </Button>
            </Stack>

            {quanNhan && (
                <PatientInfoCard
                    data={quanNhan}
                    fields={[
                        'ho_ten', 'ma_quan_nhan', 'ngay_sinh', 'gioi_tinh', 'nghe_nghiep',
                        'cap_bac', 'chuc_vu', 'ten_don_vi', 'so_dien_thoai', 'so_the_bhyt',
                    ]}
                    columnsPerRow={5}
                />
            )}

            <LoadingAlert
                loading={loading}
                error={error}
                empty={!quanNhan}
                emptyMessage="Vui lòng chọn quân nhân để xem thông tin."
            />

            {quanNhan && !loading && !error && (
                <>
                    <Card sx={CARD_SX}>
                        <CardContent>
                            <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                                Khám sức khỏe định kỳ ({kskRows.length})
                            </Typography>
                            <DataTable
                                columns={KSK_COLUMNS}
                                rows={kskRows}
                                onRowClick={(row) => setDialogKsk({ open: true, record: row })}
                                sx={DATA_TABLE_SX}
                                emptyMessage="Không có dữ liệu khám sức khỏe."
                            />
                        </CardContent>
                    </Card>

                    <Card sx={CARD_SX}>
                        <CardContent>
                            <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                                Lịch khám bệnh ({kbRows.length})
                            </Typography>
                            <DataTable
                                columns={KB_COLUMNS}
                                rows={kbRows}
                                onRowClick={(row) => setDialogKb({ open: true, record: row })}
                                sx={DATA_TABLE_SX}
                                emptyMessage="Không có dữ liệu khám bệnh."
                            />
                        </CardContent>
                    </Card>

                    <Card sx={CARD_SX}>
                        <CardContent>
                            <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                                Hồ sơ bệnh án ({baRows.length})
                            </Typography>
                            <DataTable
                                columns={BA_COLUMNS}
                                rows={baRows}
                                onRowClick={(row) => setDialogBa({ open: true, record: row })}
                                sx={DATA_TABLE_SX}
                                emptyMessage="Không có dữ liệu bệnh án."
                            />
                        </CardContent>
                    </Card>

                    <Card sx={CARD_SX}>
                        <CardContent>
                            <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
                                Chuyển tuyến ({ctRows.length})
                            </Typography>
                            <DataTable
                                columns={CT_COLUMNS}
                                rows={ctRows}
                                onRowClick={(row) => setDialogCt({ open: true, record: row })}
                                sx={DATA_TABLE_SX}
                                emptyMessage="Không có dữ liệu chuyển tuyến."
                            />
                        </CardContent>
                    </Card>
                </>
            )}

            <ChonQuanNhanDialog
                open={openChonQn}
                onClose={() => setOpenChonQn(false)}
                onSelected={(qn) => {
                    setOpenChonQn(false);
                    setQuanNhan(qn);
                }}
            />

            {dialogKsk.open && dialogKsk.record && (
                <KhamSucKhoeForm
                    open={dialogKsk.open}
                    onClose={() => setDialogKsk({ open: false, record: null })}
                    quanNhan={quanNhan}
                    existingPhieu={dialogKsk.record}
                    readOnly={true}
                />
            )}

            {dialogKb.open && (
                <KhamBenhForm
                    open={dialogKb.open}
                    examinationId={dialogKb.record?.ma_kham_benh}
                    onClose={() => setDialogKb({ open: false, record: null })}
                    readOnly={true}
                />
            )}

            {dialogBa.open && (
                <ChiTietBenhAn
                    open={dialogBa.open}
                    benhAnId={dialogBa.record?.ma_benh_an}
                    onClose={() => setDialogBa({ open: false, record: null })}
                    readOnly={true}
                />
            )}

            {dialogCt.open && (
                <ChuyenTuyenForm
                    open={dialogCt.open}
                    giayGt={dialogCt.record}
                    onClose={() => setDialogCt({ open: false, record: null })}
                    readOnly={true}
                />
            )}
        </Stack>
    );
}
