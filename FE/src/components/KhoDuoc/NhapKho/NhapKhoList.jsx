import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, CardContent, Chip, Stack } from "@mui/material";
import ActionIcon from "@/components/common/ActionIcon.jsx";
import {
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    Edit as EditIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Inventory as InventoryIcon,
    Refresh as RefreshIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import DataTable from "@/components/common/DataTable.jsx";
import FilterModeToggle from "@/components/common/FilterModeToggle.jsx";
import YearMonthFilter from "@/components/common/YearMonthFilter.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import { khoDuocService } from "@/services/khoDuocService.js";
import {
    NHAP_KHO_STATUS_CHIP,
    NHAP_KHO_ROWS_PER_PAGE,
    NHAP_KHO_EMPTY_STATS,
} from "@/constants/khoConstant.js";
import TaoPhieuNhapDialog from "./TaoPhieuNhapDialog.jsx";
import dayjs from "dayjs";

export default function NhapKhoList() {
    const location = useLocation();
    const initialOpenPhieuId = location.state?.openNhapKhoPhieuId || null;

    const [isLeft, setIsLeft] = useState(false);
    const [nam, setNam] = useState(null);
    const [thang, setThang] = useState(null);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(NHAP_KHO_EMPTY_STATS);
    const [statsLoading, setStatsLoading] = useState(false);

    const [dialogState, setDialogState] = useState({
        open: !!initialOpenPhieuId,
        mode: "create",
        phieuId: null,
        maPhieuDuTru: initialOpenPhieuId,
    });

    const handleFilterModeChange = useCallback(() => {
        setIsLeft((prev) => !prev);
        setPage(1);
    }, []);

    const handleFilterThangChange = useCallback((value) => {
        setThang(value || null);
        setPage(1);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                limit: NHAP_KHO_ROWS_PER_PAGE,
                offset: (page - 1) * NHAP_KHO_ROWS_PER_PAGE,
                trang_thai: isLeft ? "da_nhap" : "chua_nhap",
            };
            if (nam) params.nam = nam;
            if (thang) params.thang = thang;
            const res = await khoDuocService.getDanhSachPhieuNhap(params);
            const body = res.data || {};
            setRows(body.data || []);
            setTotal(body.total ?? (body.data || []).length);
        } catch {
            setRows([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, isLeft, nam, thang]);

    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const params = {};
            if (nam) params.nam = nam;
            if (thang) params.thang = thang;
            const res = await khoDuocService.getThongKePhieuNhap(params);
            const d = res.data || {};
            setStats({
                tong: d.tong || 0,
                choNhap: d.cho_nhap || 0,
                daNhap: d.da_nhap || 0,
            });
        } catch {
            setStats(NHAP_KHO_EMPTY_STATS);
        } finally {
            setStatsLoading(false);
        }
    }, [nam, thang]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const statItems = useMemo(
        () => [
            {
                label: "Chờ nhập",
                value: stats.choNhap,
                icon: <HourglassEmptyIcon />,
                color: "#F59E0B",
                bg: "#FEF3C7",
            },
            {
                label: "Đã nhập",
                value: stats.daNhap,
                icon: <CheckCircleIcon />,
                color: "#10B981",
                bg: "#D1FAE5",
            },
        ],
        [stats],
    );

    const columns = useMemo(
        () => [
            {
                key: "ma_phieu_nhap",
                label: "Mã phiếu nhập",
                render: (row) => row.ma_phieu_nhap || "—",
            },
            {
                key: "ma_phieu_du_tru",
                label: "Mã phiếu dự trù",
                render: (row) => row.ma_phieu_du_tru || "—",
            },
            {
                key: "ngay_nhap",
                label: "Ngày lập / nhập",
                render: (row) =>
                    row.ngay_nhap
                        ? dayjs(row.ngay_nhap).format("DD/MM/YYYY")
                        : "—",
            },
            {
                key: "trang_thai",
                label: "Trạng thái",
                render: (row) => {
                    const chip = NHAP_KHO_STATUS_CHIP[row.trang_thai];
                    return chip ? (
                        <Chip
                            label={chip.label}
                            color={chip.color}
                            size="small"
                        />
                    ) : (
                        row.trang_thai
                    );
                },
            },
            {
                key: "nguoi_nhap_ho_ten",
                label: "Người lập / nhập",
                render: (row) => row.nguoi_nhap_ho_ten || row.nguoi_nhap || "—",
            },
            {
                key: "actions",
                label: "Thao tác",
                render: (row) =>
                    row.trang_thai === "da_duyet" ? (
                        <ActionIcon
                            title="Nhập kho"
                            icon={<InventoryIcon />}
                            color="info"
                            onClick={() =>
                                setDialogState({
                                    open: true,
                                    mode: "create",
                                    phieuId: null,
                                    maPhieuDuTru: row.ma_phieu_du_tru,
                                })
                            }
                        />
                    ) : (
                        <Stack direction="row" spacing={0.5}>
                            <ActionIcon
                                title="Xem"
                                icon={<VisibilityIcon />}
                                onClick={() =>
                                    setDialogState({
                                        open: true,
                                        mode: "view",
                                        phieuId:
                                            row.ma_phieu_nhap ||
                                            row.ma_phieu_du_tru,
                                        maPhieuDuTru: null,
                                    })
                                }
                            />
                            {row.cho_phep_sua !== false && (
                                <ActionIcon
                                    title="Sửa"
                                    icon={<EditIcon />}
                                    color="warning"
                                    onClick={() =>
                                        setDialogState({
                                            open: true,
                                            mode: "edit",
                                            phieuId:
                                                row.ma_phieu_nhap ||
                                                row.ma_phieu_du_tru,
                                            maPhieuDuTru: null,
                                        })
                                    }
                                />
                            )}
                        </Stack>
                    ),
            },
        ],
        [],
    );

    const emptyMessage = !isLeft
        ? "Không có phiếu dự trù nào chờ nhập kho."
        : "Không có phiếu nhập kho nào.";

    return (
        <>
            <StatCardGrid items={statItems} loading={statsLoading} />

            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack
                        direction="row"
                        sx={{
                            mb: 2,
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Stack
                            direction="row"
                            sx={{ alignItems: "center", flexWrap: "wrap", gap: 1.5 }}
                        >
                            <FilterModeToggle
                                isLeft={isLeft}
                                onChange={handleFilterModeChange}
                                selectedDate={null}
                                onDateChange={() => {}}
                                labelLeft="Đã nhập"
                                labelRight="Chưa nhập"
                                showDatePicker={false}
                            />
                            <YearMonthFilter
                                nam={nam}
                                onNamChange={(v) => {
                                    setNam(v);
                                    setPage(1);
                                }}
                                thang={thang}
                                onThangChange={handleFilterThangChange}
                            />
                        </Stack>
                        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() =>
                                    setDialogState({
                                        open: true,
                                        mode: "create",
                                        phieuId: null,
                                        maPhieuDuTru: null,
                                    })
                                }
                            >
                                Tạo phiếu nhập
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={() => {
                                    fetchData();
                                    fetchStats();
                                }}
                            >
                                Refresh
                            </Button>
                        </Stack>
                    </Stack>
                    <Stack spacing={2.5}>
                        <DataTable
                            columns={columns}
                            rows={rows}
                            loading={loading}
                            minWidth={700}
                            emptyMessage={emptyMessage}
                        />
                        {total > NHAP_KHO_ROWS_PER_PAGE && (
                            <PaginationWidget
                                page={page}
                                totalRecords={total}
                                rowsPerPage={NHAP_KHO_ROWS_PER_PAGE}
                                onChange={setPage}
                            />
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <TaoPhieuNhapDialog
                open={dialogState.open}
                mode={dialogState.mode}
                phieuId={dialogState.phieuId}
                maPhieuDuTru={dialogState.maPhieuDuTru}
                onClose={() =>
                    setDialogState((prev) => ({ ...prev, open: false }))
                }
                onSaved={() => {
                    fetchData();
                    fetchStats();
                }}
            />
        </>
    );
}
