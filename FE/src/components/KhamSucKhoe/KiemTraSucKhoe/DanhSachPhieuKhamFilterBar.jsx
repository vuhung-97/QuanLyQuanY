import { useState } from "react";
import { Button, Card, CardContent, Menu, MenuItem, Stack, TextField } from "@mui/material";
import { Print as PrintIcon } from "@mui/icons-material";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";

export default function DanhSachPhieuKhamFilterBar({
    filterModeLeft,
    onFilterModeChange,
    filteredSchedules,
    selectedSchedule,
    onScheduleChange,
    units,
    selectedUnit,
    onUnitChange,
    exportEnabled,
    onExport,
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ alignItems: { sm: "center" } }}
                >
                    <FilterModeToggle
                        isLeft={filterModeLeft}
                        onChange={onFilterModeChange}
                        labelLeft="Tất cả"
                        labelRight="Đang thực hiện"
                        showDatePicker={false}
                    />
                    <TextField
                        select
                        size="small"
                        label="Chọn lịch khám"
                        value={selectedSchedule}
                        onChange={(e) => onScheduleChange(e.target.value)}
                        sx={{ minWidth: 250 }}
                    >
                        <MenuItem value="">-- Chọn lịch --</MenuItem>
                        {filteredSchedules.map((s) => (
                            <MenuItem
                                key={s.ma_lich_kham}
                                value={s.ma_lich_kham}
                            >
                                {s.ma_lich_kham} ({s.thoi_gian_bat_dau || ""} -{" "}
                                {s.thoi_gian_ket_thuc || ""})
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Chọn đơn vị"
                        value={selectedUnit}
                        onChange={(e) => onUnitChange(e.target.value)}
                        sx={{ minWidth: 250 }}
                        disabled={!selectedSchedule}
                    >
                        <MenuItem value="__ALL__">-- Tất cả đơn vị --</MenuItem>
                        {units.map((u) => (
                            <MenuItem key={u.ma_don_vi} value={u.ma_don_vi}>
                                {u.ten_don_vi} ({u.tong_quan_so} QN)
                            </MenuItem>
                        ))}
                    </TextField>
                    {exportEnabled && (
                        <>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<PrintIcon />}
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                sx={{ whiteSpace: "nowrap" }}
                            >
                                In danh sách
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                <MenuItem onClick={() => { onExport("chua_hoan_thanh"); setAnchorEl(null); }}>
                                    DS chưa hoàn thành
                                </MenuItem>
                                <MenuItem onClick={() => { onExport("chua_lay_mau"); setAnchorEl(null); }}>
                                    DS chưa lấy máu
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
