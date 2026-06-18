import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Autocomplete,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    TablePagination,
    TextField,
} from "@mui/material";
import { khamBenhService } from "../../services/khamBenhService.js";
import DataTable from "../common/DataTable.jsx";

const ROWS_PER_PAGE = 50;

const qnColumns = [
    { key: "stt", label: "STT", sx: { width: 60 } },
    {
        key: "ma_quan_nhan",
        label: "Mã QN",
        sx: { fontWeight: 700, color: "primary.main" },
    },
    { key: "ho_ten", label: "Họ tên" },
    { key: "ngay_sinh", label: "Ngày sinh" },
    { key: "don_vi", label: "Đơn vị" },
    { key: "cap_bac", label: "Cấp bậc" },
    { key: "chuc_vu", label: "Chức vụ" },
    { key: "ngay_nhap_ngu", label: "Nhập ngũ" },
    { key: "so_the_bhyt", label: "Mã thẻ BHYT" },
];

function fmtDate(d) {
    return d ? new Date(d).toLocaleDateString("vi-VN") : "--";
}

export default function ReceiveQnDialog({ open, onClose, onSelected }) {
    const [quanNhanData, setQuanNhanData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [filterText, setFilterText] = useState("");
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [donViList, setDonViList] = useState([]);
    const [loadingQN, setLoadingQN] = useState(false);

    const fetchQuanNhan = useCallback(async (p, unit, filter) => {
        setLoadingQN(true);
        try {
            const params = { limit: ROWS_PER_PAGE, offset: p * ROWS_PER_PAGE };
            if (unit) params.ma_don_vi = unit.ma_don_vi;
            if (filter) params.search = filter;
            const res = await khamBenhService.getQuanNhanDanhSach(params);
            setQuanNhanData(res.data?.data || []);
            setTotalCount(res.data?.total || 0);
        } catch {
            setQuanNhanData([]);
            setTotalCount(0);
        } finally {
            setLoadingQN(false);
        }
    }, []);

    const loadDonVi = useCallback(async () => {
        try {
            const res = await khamBenhService.getDonViList({ limit: 200 });
            const list = res.data || [];
            const parents = list.filter((d) => !d.ma_don_vi_truc_thuoc);
            const children = list.filter((d) => d.ma_don_vi_truc_thuoc);
            const sorted = [];
            for (const p of parents) {
                sorted.push(p);
                sorted.push(
                    ...children.filter(
                        (c) => c.ma_don_vi_truc_thuoc === p.ma_don_vi,
                    ),
                );
            }
            setDonViList(sorted);
        } catch {
            setDonViList([]);
        }
    }, []);

    const getTenDonVi = useCallback(
        (ma) =>
            donViList.find((d) => d.ma_don_vi === ma)?.ten_don_vi || ma || "--",
        [donViList],
    );

    useEffect(() => {
        if (!open) return;
        setPage(0);
        setFilterText("");
        setSelectedUnit(null);
        loadDonVi();
        fetchQuanNhan(0, null, "");
    }, [open, loadDonVi, fetchQuanNhan]);

    const rows = useMemo(
        () =>
            quanNhanData.map((qn, idx) => ({
                ...qn,
                stt: page * ROWS_PER_PAGE + idx + 1,
                ngay_sinh: fmtDate(qn.ngay_sinh),
                don_vi: getTenDonVi(qn.ma_don_vi),
                ngay_nhap_ngu: fmtDate(qn.ngay_nhap_ngu),
            })),
        [quanNhanData, page, getTenDonVi],
    );

    const handlePageChange = useCallback(
        (event, newPage) => {
            setPage(newPage);
            fetchQuanNhan(newPage, selectedUnit, filterText);
        },
        [selectedUnit, filterText, fetchQuanNhan],
    );

    const handleUnitChange = useCallback(
        (event, value) => {
            setSelectedUnit(value);
            setPage(0);
            fetchQuanNhan(0, value, filterText);
        },
        [filterText, fetchQuanNhan],
    );

    const handleFilterTextChange = useCallback(
        (e) => {
            const val = e.target.value;
            setFilterText(val);
            setPage(0);
            fetchQuanNhan(0, selectedUnit, val);
        },
        [selectedUnit, fetchQuanNhan],
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{ paper: { sx: { height: "90vh" } } }}
        >
            <DialogTitle sx={{ textAlign: "center" }}>
                Danh sách quân nhân
            </DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 2 }}>
                    <Autocomplete
                        options={donViList}
                        value={selectedUnit}
                        onChange={handleUnitChange}
                        getOptionLabel={(o) => o.ten_don_vi || ""}
                        isOptionEqualToValue={(o, v) =>
                            o?.ma_don_vi === v?.ma_don_vi
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Đơn vị"
                                size="small"
                            />
                        )}
                        sx={{ minWidth: 280 }}
                        size="small"
                    />
                    <TextField
                        value={filterText}
                        onChange={handleFilterTextChange}
                        placeholder="Tìm theo họ tên / mã QN..."
                        size="small"
                        sx={{ minWidth: 220 }}
                    />
                </Stack>
                <DataTable
                    columns={qnColumns}
                    rows={rows}
                    loading={loadingQN}
                    emptyMessage="Không tìm thấy quân nhân."
                    onRowClick={onSelected}
                    minWidth={900}
                />
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={ROWS_PER_PAGE}
                    rowsPerPageOptions={[ROWS_PER_PAGE]}
                />
            </DialogContent>
        </Dialog>
    );
}
