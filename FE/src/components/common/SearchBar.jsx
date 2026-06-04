import { TextField } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function SearchBar({ value, onChange, placeholder, sx }) {
    return (
        <TextField
            size="small"
            placeholder={placeholder || "Tìm kiếm..."}
            value={value}
            onChange={onChange}
            slotProps={{
                input: {
                    startAdornment: (
                        <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                },
            }}
            sx={{ minWidth: { xs: "100%", md: 320 }, ...sx }}
        />
    );
}
