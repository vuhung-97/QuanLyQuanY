import { memo } from "react";
import {
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Stack,
    Tab,
    TableCell,
    TableRow,
    Tabs,
    Typography,
} from "@mui/material";
import {
    Edit as EditIcon,
    MedicalServices as MedicalServicesIcon,
    QrCode as QrCodeIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import { STATUS_CHIP } from "@/constants/khamSucKhoeConstants.js";
import { getStatus } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";

const columns = [
    { key: "stt", label: "STT" },
    { key: "ma_quan_nhan", label: "Mã QN", sx: { color: "primary.main" } },
    { key: "ho_ten", label: "Họ tên" },
    { key: "don_vi", label: "Đơn vị" },
    { key: "cap_bac", label: "Cấp bậc" },
    { key: "chuc_vu", label: "Chức vụ" },
    { key: "tinh_trang", label: "Tình trạng khám" },
    {
        key: "ma_lay_mau",
        label: "Mã lấy máu",
        sx: { width: 120, minWidth: 120 },
    },
    { key: "thao_tac", label: "Thao tác" },
];

const SoldierRows = memo(function SoldierRows({
    soldiers,
    phieuMap,
    allUnitLookup,
    onEdit,
    onViewHistory,
    onGenerateBloodCode,
    generatingCodes = new Set(),
}) {
    return soldiers.map((qn, idx) => {
        const phieu = phieuMap[qn.ma_quan_nhan];
        const tt = getStatus(phieu);
        const maCode = phieu?.ma_lay_mau;
        const isGenerating = generatingCodes.has(qn.ma_quan_nhan);
        return (
            <TableRow key={qn.ma_quan_nhan} hover>
                <TableCell>{idx + 1}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                    {qn.ma_quan_nhan}
                </TableCell>
                <TableCell
                    sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        color: "primary.main",
                        "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => onViewHistory(qn)}
                >
                    {qn.ho_ten || "--"}
                </TableCell>
                <TableCell>
                    {allUnitLookup.get(qn.ma_don_vi) || qn.ma_don_vi || "--"}
                </TableCell>
                <TableCell>{qn.cap_bac || "--"}</TableCell>
                <TableCell>{qn.chuc_vu || "--"}</TableCell>
                <TableCell>
                    <Chip
                        size="small"
                        label={tt}
                        sx={{
                            ...STATUS_CHIP[tt],
                            fontWeight: 700,
                            minWidth: 90,
                        }}
                    />
                </TableCell>
                <TableCell>
                    {maCode ? (
                        <Chip label={maCode} color="primary" size="small" sx={{ fontWeight: 700, minWidth: 90 }} />
                    ) : isGenerating ? (
                        <CircularProgress size={24} />
                    ) : (
                        <ActionIcon title="Tạo mã lấy máu" icon={<QrCodeIcon />} color="secondary" onClick={() => onGenerateBloodCode(qn)} />
                    )}
                </TableCell>
                <TableCell>
                    <Stack direction="row" spacing={0.5}>
                        {tt === "Chưa khám" && maCode && (
                            <ActionIcon title="Khám" icon={<MedicalServicesIcon />} onClick={() => { document.activeElement?.blur(); onEdit(qn); }} />
                        )}
                        {tt === "Đang khám" && (
                            <ActionIcon title="Tiếp tục" icon={<EditIcon />} onClick={() => { document.activeElement?.blur(); onEdit(qn); }} />
                        )}
                        {tt === "Đã khám" && (
                            <ActionIcon title="Xem" icon={<VisibilityIcon />} color="info" onClick={() => { document.activeElement?.blur(); onEdit(qn); }} />
                        )}
                    </Stack>
                </TableCell>
            </TableRow>
        );
    });
});

export default function BangQuanNhan({
    soldiers,
    phieuMap,
    loading,
    allUnitLookup,
    onSearch,
    filterTab,
    onFilterTabChange,
    onEdit,
    onViewHistory,
    onGenerateBloodCode,
    generatingCodes,
    filterTabs,
}) {
    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{
                        mb: 2,
                        justifyContent: "space-between",
                        alignItems: { md: "center" },
                    }}
                >
                    <Typography variant="h2" sx={{ whiteSpace: "nowrap" }}>
                        Danh sách quân nhân
                    </Typography>
                    <SearchBarDebounced
                        onSearch={onSearch}
                        placeholder="Tìm kiếm quân nhân..."
                    />
                    <Tabs
                        value={filterTab}
                        onChange={onFilterTabChange}
                        sx={{
                            minHeight: 36,
                            "& .MuiTab-root": { minHeight: 36, py: 0.5 },
                        }}
                    >
                        {filterTabs.map((t) => (
                            <Tab
                                key={t}
                                label={t}
                                sx={{ textTransform: "none", fontSize: 14 }}
                            />
                        ))}
                    </Tabs>
                </Stack>
                <DataTable
                    columns={columns}
                    rows={soldiers}
                    loading={loading}
                    emptyMessage="Không có quân nhân nào."
                    getRowKey={(qn) => qn.ma_quan_nhan}
                    minWidth={800}
                >
                    <SoldierRows
                        soldiers={soldiers}
                        phieuMap={phieuMap}
                        allUnitLookup={allUnitLookup}
                        onEdit={onEdit}
                        onViewHistory={onViewHistory}
                        onGenerateBloodCode={onGenerateBloodCode}
                        generatingCodes={generatingCodes}
                    />
                </DataTable>
            </CardContent>
        </Card>
    );
}
