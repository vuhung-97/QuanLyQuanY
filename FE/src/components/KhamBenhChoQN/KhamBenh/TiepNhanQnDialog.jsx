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
import useDebounce from "@/hooks/useDebounce.jsx";
import { khamBenhService } from "@/services/khamBenhService.js";
import DataTable from "@/components/common/DataTable.jsx";

const ROWS_PER_PAGE = 50;
const BATCH = 500;

const qnColumns = [
    { key: "stt", label: "STT", sx: { width: 60 } },
    {
        key: "ma_quan_nhan",
        label: "Mã QN",
        sx: { color: "primary.main" },
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

export default function TiepNhanQnDialog({ open, onClose, onSelected }) {
    const [allSoldiers, setAllSoldiers] = useState([]);
    const [page, setPage] = useState(0);
    const [filterText, setFilterText] = useState("");
    const debouncedFilterText = useDebounce(filterText);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [donViList, setDonViList] = useState([]);
    const [loadingQN, setLoadingQN] = useState(false);

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
        let ignore = false;
        async function loadAll() {
            setLoadingQN(true);
            try {
                const first = await khamBenhService.getQuanNhanDanhSach({
                    limit: BATCH,
                    offset: 0,
                });
                if (ignore) return;
                const all = [...(first.data?.data || [])];
                const total = first.data?.total || 0;
                if (total > BATCH) {
                    const pages = [];
                    for (let off = BATCH; off < total; off += BATCH) {
                        pages.push(
                            khamBenhService.getQuanNhanDanhSach({
                                limit: BATCH,
                                offset: off,
                            }),
                        );
                    }
                    const results = await Promise.all(pages);
                    for (const r of results) {
                        all.push(...(r.data?.data || []));
                    }
                }
                if (!ignore) setAllSoldiers(all);
            } catch {
                if (!ignore) setAllSoldiers([]);
            } finally {
                if (!ignore) setLoadingQN(false);
            }
        }
        loadAll();
        setPage(0);
        setFilterText("");
        setSelectedUnit(null);
        loadDonVi();
        return () => {
            ignore = true;
        };
    }, [open, loadDonVi]);

    const filtered = useMemo(() => {
        let list = allSoldiers;
        if (selectedUnit) {
            list = list.filter((qn) => qn.ma_don_vi === selectedUnit.ma_don_vi);
        }
        if (debouncedFilterText) {
            const q = debouncedFilterText.toLowerCase().trim();
            list = list.filter(
                (qn) =>
                    (qn.ho_ten || "").toLowerCase().includes(q) ||
                    (qn.ma_quan_nhan || "").toLowerCase().includes(q),
            );
        }
        return list;
    }, [allSoldiers, selectedUnit, debouncedFilterText]);

    const totalCount = filtered.length;

    const rows = useMemo(() => {
        const pageData = filtered.slice(
            page * ROWS_PER_PAGE,
            (page + 1) * ROWS_PER_PAGE,
        );
        return pageData.map((qn, idx) => ({
            ...qn,
            stt: page * ROWS_PER_PAGE + idx + 1,
            ngay_sinh: fmtDate(qn.ngay_sinh),
            don_vi: getTenDonVi(qn.ma_don_vi),
            ngay_nhap_ngu: fmtDate(qn.ngay_nhap_ngu),
        }));
    }, [filtered, page, getTenDonVi]);

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleUnitChange = useCallback((event, value) => {
        setSelectedUnit(value);
        setPage(0);
    }, []);

    const handleFilterTextChange = useCallback((e) => {
        setFilterText(e.target.value);
        setPage(0);
    }, []);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sx"
            fullWidth
            slotProps={{ paper: { sx: { height: "90vh", width: "70%" } } }}
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
