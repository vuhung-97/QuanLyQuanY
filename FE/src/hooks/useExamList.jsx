import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function useExamList({
    rowsPerPage = 100,
    statusField = "trang_thai",
    hasDateMode = true,
    initialIsLeft = false,
    initialStatus = "",
    loadErrorMessage = "Lỗi tải danh sách.",
    fetchData,
    subset = (list) => list,
}) {
    const [examinations, setExaminations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [nam, setNam] = useState(null);
    const [thang, setThang] = useState(null);
    const [isLeft, setIsLeft] = useState(initialIsLeft);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchDataRef = useRef(fetchData);
    const subsetRef = useRef(subset);
    useEffect(() => {
        fetchDataRef.current = fetchData;
        subsetRef.current = subset;
    });

    const offset = useMemo(
        () =>
            hasDateMode
                ? isLeft
                    ? (page - 1) * rowsPerPage
                    : 0
                : (page - 1) * rowsPerPage,
        [hasDateMode, isLeft, page, rowsPerPage],
    );

    const handleFilterModeChange = useCallback(() => {
        setIsLeft((prev) => !prev);
        setPage(1);
    }, []);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            const res = await fetchDataRef.current({
                isLeft,
                selectedDate,
                offset,
                limit: rowsPerPage,
                nam,
                thang,
            });
            setExaminations(res.list || []);
            setTotalRecords(res.total || 0);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.detail || loadErrorMessage,
                severity: "error",
            });
        } finally {
            setRefreshing(false);
            setInitialLoading(false);
        }
    }, [
        isLeft,
        selectedDate,
        offset,
        rowsPerPage,
        nam,
        thang,
        loadErrorMessage,
    ]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const baseList = useMemo(
        () => subsetRef.current(examinations, isLeft),
        [examinations, isLeft],
    );

    const filtered = useMemo(() => {
        let result = baseList;
        if (statusFilter) {
            result = result.filter((e) => e[statusField] === statusFilter);
        }
        if (searchText) {
            const q = searchText.toLowerCase();
            result = result.filter(
                (e) =>
                    (e.ma_kham_benh || "").toLowerCase().includes(q) ||
                    (e.ho_ten || "").toLowerCase().includes(q) ||
                    (e.ten_don_vi || "").toLowerCase().includes(q),
            );
        }
        return result;
    }, [baseList, statusFilter, statusField, searchText]);

    const handleFilterThangChange = useCallback((value) => {
        setThang(value || null);
        setPage(1);
    }, []);

    return {
        examinations,
        baseList,
        initialLoading,
        refreshing,
        selectedDate,
        setSelectedDate,
        searchText,
        setSearchText,
        statusFilter,
        setStatusFilter,
        filtered,
        snackbar,
        setSnackbar,
        loadData,
        isLeft,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        setTotalRecords,
        ROWS_PER_PAGE: rowsPerPage,
        offset,
        nam,
        setNam,
        thang,
        setThang,
        handleFilterThangChange,
    };
}
