import { Box, Pagination } from "@mui/material";

export default function PaginationWidget({
    page,
    totalRecords,
    rowsPerPage,
    onChange,
    sx,
    ...rest
}) {
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", ...sx }}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => onChange(value)}
                color="primary"
                {...rest}
            />
        </Box>
    );
}
