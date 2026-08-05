import { memo, useMemo, useState } from "react";
import {
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import {
    Bloodtype as BloodtypeIcon,
    Edit as EditIcon,
    MedicalServices as MedicalServicesIcon,
    QrCode as QrCodeIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import StatusFilter from "@/components/common/StatusFilter.jsx";
import { STATUS_CHIP, TRANG_THAI_STATUS_FILTER } from "@/constants/khamSucKhoeConstants.js";
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
    onConfirmBloodDraw,
    generatingCodes = new Set(),
    isXetNghiem,
    isLayMauWindow = true,
    isKhamWindow = true,
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
                    ) : isXetNghiem && isLayMauWindow ? (
                        <ActionIcon title="Tạo mã lấy máu" icon={<QrCodeIcon />} color="secondary" onClick={() => onGenerateBloodCode(qn)} />
                    ) : null}
                </TableCell>
                <TableCell>
                    <Stack direction="row" spacing={0.5}>
                        {tt === "Chưa lấy máu" && maCode && isXetNghiem && isLayMauWindow && (
                            <ActionIcon title="Xác nhận đã lấy máu" icon={<BloodtypeIcon />} color="secondary" onClick={() => onConfirmBloodDraw(qn)} />
                        )}
                        {tt === "Đã lấy máu" && isKhamWindow && (
                            <ActionIcon title="Khám" icon={<MedicalServicesIcon />} onClick={() => { document.activeElement?.blur(); onEdit(qn); }} />
                        )}
                        {tt === "Đang khám" && isKhamWindow && (
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
    statusFilter,
    onStatusFilterChange,
    onEdit,
    onViewHistory,
    onGenerateBloodCode,
    onConfirmBloodDraw,
    generatingCodes,
    isXetNghiem,
    isLayMauWindow,
    isKhamWindow,
}) {
    const [sortBy, setSortBy] = useState("ho_ten");

    const sortedSoldiers = useMemo(() => {
        if (!sortBy) return soldiers;
        const arr = [...soldiers];
        arr.sort((a, b) => {
            if (sortBy === "ho_ten") {
                return (a.ho_ten || "").localeCompare(b.ho_ten || "", "vi");
            }
            if (sortBy === "don_vi") {
                const uA = allUnitLookup.get(a.ma_don_vi) || "";
                const uB = allUnitLookup.get(b.ma_don_vi) || "";
                return uA.localeCompare(uB, "vi");
            }
            if (sortBy === "tinh_trang") {
                const sA = phieuMap[a.ma_quan_nhan]?.trang_thai || "";
                const sB = phieuMap[b.ma_quan_nhan]?.trang_thai || "";
                return sA.localeCompare(sB);
            }
            if (sortBy === "ma_lay_mau") {
                const mA = phieuMap[a.ma_quan_nhan]?.ma_lay_mau || "";
                const mB = phieuMap[b.ma_quan_nhan]?.ma_lay_mau || "";
                if (!mA) return mB ? 1 : 0;
                if (!mB) return -1;
                return mA.localeCompare(mB);
            }
            return 0;
        });
        return arr;
    }, [soldiers, sortBy, phieuMap, allUnitLookup]);

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
                    <Stack direction="row" spacing={1}>
                        <StatusFilter
                            value={statusFilter}
                            onChange={onStatusFilterChange}
                            statusMap={TRANG_THAI_STATUS_FILTER}
                            label="Trạng thái"
                            minWidth={160}
                        />
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel id="sort-filter-label">
                                Sắp xếp
                            </InputLabel>
                            <Select
                                labelId="sort-filter-label"
                                value={sortBy}
                                label="Sắp xếp"
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <MenuItem value="ho_ten">Theo tên</MenuItem>
                                <MenuItem value="don_vi">Theo đơn vị</MenuItem>
                                <MenuItem value="tinh_trang">
                                    Theo tình trạng
                                </MenuItem>
                                <MenuItem value="ma_lay_mau">
                                    Theo mã lấy máu
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
                <DataTable
                    columns={columns}
                    rows={sortedSoldiers}
                    loading={loading}
                    emptyMessage="Không có quân nhân nào."
                    getRowKey={(qn) => qn.ma_quan_nhan}
                    minWidth={800}
                >
                    <SoldierRows
                        soldiers={sortedSoldiers}
                        phieuMap={phieuMap}
                        allUnitLookup={allUnitLookup}
                        onEdit={onEdit}
                        onViewHistory={onViewHistory}
                        onGenerateBloodCode={onGenerateBloodCode}
                        onConfirmBloodDraw={onConfirmBloodDraw}
                        generatingCodes={generatingCodes}
                        isXetNghiem={isXetNghiem}
                        isLayMauWindow={isLayMauWindow}
                        isKhamWindow={isKhamWindow}
                    />
                </DataTable>
            </CardContent>
        </Card>
    );
}
