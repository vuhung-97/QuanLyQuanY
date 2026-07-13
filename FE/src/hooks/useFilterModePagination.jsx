import { useCallback, useMemo, useState } from "react";

const ROWS_PER_PAGE = 100;

export default function useFilterModePagination() {
    const [isLeft, setIsLeft] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const handleFilterModeChange = useCallback(() => {
        setIsLeft(prev => !prev);
        setPage(1);
    }, []);

    const offset = useMemo(
        () => (isLeft ? (page - 1) * ROWS_PER_PAGE : 0),
        [isLeft, page],
    );

    return {
        isLeft,
        handleFilterModeChange,
        page,
        setPage,
        totalRecords,
        setTotalRecords,
        ROWS_PER_PAGE,
        offset,
    };
}