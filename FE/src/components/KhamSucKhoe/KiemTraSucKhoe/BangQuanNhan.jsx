import { memo } from "react";
import {
    Button,
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
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import SearchBar from "@/components/common/SearchBar.jsx";
import DataTable from "@/components/common/DataTable.jsx";

const TRANG_THAI_LABEL = {
    chua_kham: "Chưa khám",
    dang_kham: "Đang khám",
    da_kham: "Đã khám",
};

function getStatus(phieu) {
    if (!phieu) return "Chưa khám";
    return TRANG_THAI_LABEL[phieu.trang_thai] || "Chưa khám";
}

const STATUS_CHIP = {
    "Chưa khám": {
        bgcolor: "rgba(100, 116, 139, 0.12)",
        color: "text.secondary",
    },
    "Đang khám": { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" },
    "Đã khám": { bgcolor: "rgba(16, 185, 129, 0.12)", color: "success.main" },
};

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
                        <Button
                            size="small"
                            variant="outlined"
                            disabled
                            sx={{ fontWeight: 700, minWidth: 90 }}
                        >
                            {maCode}
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            disabled={isGenerating}
                            onClick={() => onGenerateBloodCode(qn)}
                        >
                            {isGenerating ? "Đang tạo" : "Tạo mã"}
                        </Button>
                    )}
                </TableCell>
                <TableCell>
                    {tt === "Chưa khám" && maCode && (
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                                document.activeElement?.blur();
                                onEdit(qn);
                            }}
                        >
                            Khám
                        </Button>
                    )}
                    {(tt === "Đang khám" || tt === "Đã khám") && (
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                                document.activeElement?.blur();
                                onEdit(qn);
                            }}
                        >
                            {tt === "Đã khám" ? "Xem" : "Tiếp tục"}
                        </Button>
                    )}
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
    searchText,
    onSearchChange,
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
                    <SearchBar
                        value={searchText}
                        onChange={onSearchChange}
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
