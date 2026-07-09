import { useCallback, useEffect, useMemo, useState } from "react";
import useStaticList from "@/hooks/useStaticList.js";
import {
    Autocomplete,
    Dialog,
    DialogContent,
    Stack,
    TablePagination,
    TextField,
} from "@mui/material";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import DataTable from "@/components/common/DataTable.jsx";
import { formatDate } from "@/utils/date.js";
import { buildTree, flattenTree } from "@/utils/treeUtils.js";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";

const ROWS_PER_PAGE = 50;

const QN_COLUMNS = [
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

export default function ChonQuanNhanDialog({
    open,
    onClose,
    onSelected,
    title = "Danh sách quân nhân",
    fetchFn,
}) {
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUnit, setSelectedUnit] = useState(null);

    const allSoldiers = useStaticList("/quan_nhan/list", {
        params: { show_all: 1 },
        pageSize: 500,
    });
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (allSoldiers.length > 0) setLoaded(true);
    }, [allSoldiers]);
    const loadingQN = !loaded && allSoldiers.length === 0;

    const [pendingConfirmQn, setPendingConfirmQn] = useState(null);

    const donViFull = useStaticList("/don_vi", { pageSize: 200 });

    const donViFlat = useMemo(() => {
        if (!donViFull.length) return [];
        const tree = buildTree(donViFull);
        return flattenTree(tree);
    }, [donViFull]);

    const getTenDonVi = useCallback(
        (ma) =>
            donViFlat.find((d) => d.ma_don_vi === ma)?.ten_don_vi || ma || "--",
        [donViFlat],
    );

    useEffect(() => {
        if (!open) return;
        setPage(0);
        setSearchTerm("");
        setSelectedUnit(null);
    }, [open]);

    const filtered = useMemo(() => {
        let list = allSoldiers;
        if (selectedUnit) {
            list = list.filter((qn) => qn.ma_don_vi === selectedUnit.ma_don_vi);
        }
        if (searchTerm) {
            const q = searchTerm.toLowerCase().trim();
            list = list.filter(
                (qn) =>
                    (qn.ho_ten || "").toLowerCase().includes(q) ||
                    (qn.ma_quan_nhan || "").toLowerCase().includes(q),
            );
        }
        return list;
    }, [allSoldiers, selectedUnit, searchTerm]);

    const totalCount = filtered.length;

    const rows = useMemo(() => {
        const pageData = filtered.slice(
            page * ROWS_PER_PAGE,
            (page + 1) * ROWS_PER_PAGE,
        );
        return pageData.map((qn, idx) => ({
            ...qn,
            stt: page * ROWS_PER_PAGE + idx + 1,
            ngay_sinh: formatDate(qn.ngay_sinh),
            don_vi: getTenDonVi(qn.ma_don_vi),
            ngay_nhap_ngu: formatDate(qn.ngay_nhap_ngu),
        }));
    }, [filtered, page, getTenDonVi]);

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleUnitChange = useCallback((event, value) => {
        setSelectedUnit(value);
        setPage(0);
    }, []);

    const handleRowClick = useCallback(
        (qn) => {
            if (qn.is_dang_dieu_tri || qn.is_da_chuyen_tuyen) {
                setPendingConfirmQn(qn);
            } else {
                onSelected?.(qn);
            }
        },
        [onSelected],
    );

    const handleConfirmProceed = useCallback(() => {
        if (pendingConfirmQn) onSelected?.(pendingConfirmQn);
        setPendingConfirmQn(null);
    }, [onSelected, pendingConfirmQn]);

    const handleConfirmClose = useCallback(() => {
        setPendingConfirmQn(null);
    }, []);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sx"
            fullWidth
            slotProps={{ paper: { sx: { height: "90vh", width: "70%" } } }}
        >
            <DialogTitleWrapper wrap={false}>{title}</DialogTitleWrapper>
            <DialogContent dividers>
                <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 2 }}>
                    <Autocomplete
                        loading={!donViFull.length}
                        options={donViFlat}
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
                        renderOption={({ key, ...rest }, option) => (
                            <li
                                key={key}
                                {...props}
                                style={{ paddingLeft: option.level * 16 + 8 }}
                            >
                                {option.level > 0
                                    ? "– ".repeat(option.level)
                                    : ""}
                                {option.ten_don_vi}
                            </li>
                        )}
                        sx={{ minWidth: 280 }}
                        size="small"
                    />
                    <SearchBarDebounced
                        key={open}
                        onSearch={setSearchTerm}
                        placeholder="Tìm theo họ tên / mã QN..."
                        sx={{ minWidth: 220 }}
                    />
                </Stack>
                <DataTable
                    columns={QN_COLUMNS}
                    rows={rows}
                    loading={loadingQN}
                    emptyMessage="Không tìm thấy quân nhân."
                    onRowClick={handleRowClick}
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

            <ConfirmDialog
                open={Boolean(pendingConfirmQn)}
                title="Cảnh báo"
                message={
                    pendingConfirmQn
                        ? `Quân nhân ${pendingConfirmQn.ho_ten} (${pendingConfirmQn.ma_quan_nhan}) hiện đang ${[
                              pendingConfirmQn.is_dang_dieu_tri
                                  ? "điều trị nội trú"
                                  : "",
                              pendingConfirmQn.is_da_chuyen_tuyen
                                  ? "chuyển tuyến"
                                  : "",
                          ]
                              .filter(Boolean)
                              .join(" và ")}. Bạn có chắc chắn muốn chọn?`
                        : ""
                }
                confirmLabel="Vẫn chọn"
                confirmColor="warning"
                onConfirm={handleConfirmProceed}
                onClose={handleConfirmClose}
            />
        </Dialog>
    );
}
