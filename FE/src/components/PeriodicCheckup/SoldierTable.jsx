import { Button, Card, CardContent, Chip, LinearProgress, Stack,
    Tab, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Tabs, Typography } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import SearchBar from "../common/SearchBar.jsx";

const headerLabels = ["STT", "Mã QN", "Họ tên", "Đơn vị", "Cấp bậc", "Chức vụ", "Tình trạng khám", "Thao tác"];

export default function SoldierTable({
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
    getTrangThai,
    statusChipColor,
    filterTabs,
}) {
    return (
        <Card sx={{ borderRadius: 3 }}>
            {loading && <LinearProgress />}
            <CardContent sx={{ p: "24px !important" }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}
                    sx={{ mb: 2, justifyContent: "space-between", alignItems: { md: "center" } }}>
                    <Typography variant="h2">Danh sách quân nhân</Typography>
                    <SearchBar
                        value={searchText}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm quân nhân..."
                    />
                    <Tabs value={filterTab} onChange={onFilterTabChange}
                        sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, py: 0.5 } }}>
                        {filterTabs.map((t) => (
                            <Tab key={t} label={t}
                                sx={{ textTransform: "none", fontSize: 14 }} />
                        ))}
                    </Tabs>
                </Stack>
                <TableContainer>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                {headerLabels.map((l) => (
                                    <TableCell key={l} sx={{ fontWeight: 700, color: "text.primary" }}>{l}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {soldiers.map((qn, idx) => {
                                const phieu = phieuMap[qn.ma_quan_nhan];
                                const tt = getTrangThai(phieu);
                                return (
                                    <TableRow key={qn.ma_quan_nhan} hover>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                                            {qn.ma_quan_nhan}
                                        </TableCell>
                                        <TableCell
                                            sx={{ cursor: "pointer", fontWeight: 600, color: "primary.main",
                                                "&:hover": { textDecoration: "underline" } }}
                                            onClick={() => onViewHistory(qn)}
                                        >
                                            {qn.ho_ten || "--"}
                                        </TableCell>
                                        <TableCell>{allUnitLookup.get(qn.ma_don_vi) || qn.ma_don_vi || "--"}</TableCell>
                                        <TableCell>{qn.cap_bac || "--"}</TableCell>
                                        <TableCell>{qn.chuc_vu || "--"}</TableCell>
                                        <TableCell>
                                            <Chip size="small" label={tt}
                                                sx={{ ...statusChipColor(tt), fontWeight: 700, minWidth: 90 }} />
                                        </TableCell>
                                        <TableCell>
                                            {tt === "Chưa khám" && (
                                                <Button size="small" variant="contained"
                                                    onClick={() => { document.activeElement?.blur(); onEdit(qn); }}>
                                                    Khám
                                                </Button>
                                            )}
                                            {(tt === "Đang khám" || tt === "Đã khám") && (
                                                <Button size="small" variant="outlined"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => { document.activeElement?.blur(); onEdit(qn); }}>
                                                    {tt === "Đã khám" ? "Xem" : "Tiếp tục"}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {!loading && soldiers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                                        Không có quân nhân nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
