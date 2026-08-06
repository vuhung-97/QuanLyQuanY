import { Card, CardContent } from "@mui/material";
import StatCardGrid from "@/components/common/StatCardGrid.jsx";
import SearchBarDebounced from "@/components/common/SearchBarDebounced.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import PaginationWidget from "@/components/common/PaginationWidget.jsx";

export default function ExamListPage({
    statItems,
    loading,
    refreshing,
    toolbar,
    searchPlaceholder,
    onSearch,
    columns,
    rows,
    emptyMessage,
    rowExtra,
    showPagination,
    page,
    totalRecords,
    rowsPerPage,
    onPageChange,
    children,
}) {
    return (
        <>
            <StatCardGrid items={statItems} loading={loading} />

            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    {toolbar}

                    <SearchBarDebounced
                        onSearch={onSearch}
                        placeholder={searchPlaceholder}
                    />

                    <DataTable
                        columns={columns}
                        rows={rows}
                        loading={loading || refreshing}
                        emptyMessage={emptyMessage}
                        rowExtra={rowExtra}
                    />

                    {showPagination && (
                        <PaginationWidget
                            page={page}
                            totalRecords={totalRecords}
                            rowsPerPage={rowsPerPage}
                            onChange={onPageChange}
                            sx={{ mt: 2 }}
                        />
                    )}
                </CardContent>
            </Card>

            {children}
        </>
    );
}
