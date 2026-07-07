import { useEffect, useState } from "react";
import SearchBar from "./SearchBar.jsx";
import useDebounce from "@/hooks/useDebounce.jsx";

export default function SearchBarDebounced({ onSearch, placeholder, sx, debounceMs = 300 }) {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, debounceMs);

    useEffect(() => {
        onSearch?.(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <SearchBar
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            sx={sx}
        />
    );
}
