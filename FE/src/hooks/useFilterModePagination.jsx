import { useCallback, useMemo, useState } from "react";

const ROWS_PER_PAGE = 100;

export default function useFilterModePagination() {
    const [filterMode, setFilterMode] = useState("theo_ngay");
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const handleFilterModeChange = useCallback(() => {
        setFilterMode(prev => prev === "tat_ca" ? "theo_ngay" : "tat_ca");
        setPage(1);
    }, []);

    const offset = useMemo(
        () => (filterMode === "tat_ca" ? (page - 1) * ROWS_PER_PAGE : 0),
        [filterMode, page],
    );

    return {
        filterMode,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        setTotalRecords,
        ROWS_PER_PAGE,
        offset,
    };
}
