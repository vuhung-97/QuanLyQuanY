import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { danhMucService } from "@/services/danhMucService.js";
import useDebounce from "@/hooks/useDebounce.jsx";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

const _cache = new Map();

export default memo(function ChanDoanAutocomplete({
    chanDoan,
    onChanDoanChange,
    onSelectDisease,
    readOnly = false,
}) {
    const [inputValue, setInputValue] = useState(chanDoan ?? "");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const seqRef = useRef(0);
    const debouncedInput = useDebounce(inputValue, DEBOUNCE_MS);

    useEffect(() => {
        setInputValue((prev) => (prev === chanDoan ? prev : chanDoan ?? ""));
    }, [chanDoan]);

    useEffect(() => {
        onChanDoanChange(debouncedInput);
    }, [debouncedInput, onChanDoanChange]);

    useEffect(() => {
        if (readOnly) return;
        const q = debouncedInput.trim();
        if (q.length < MIN_QUERY_LENGTH) {
            setOptions([]);
            return;
        }
        const cached = _cache.get(q);
        if (cached) {
            setOptions(cached);
            return;
        }
        const seq = ++seqRef.current;
        setLoading(true);
        danhMucService
            .suggestDisease(q)
            .then((res) => {
                if (seq !== seqRef.current) return;
                const items = res.data || [];
                _cache.set(q, items);
                setOptions(items);
            })
            .catch(() => {
                if (seq !== seqRef.current) return;
                setOptions([]);
            })
            .finally(() => {
                if (seq === seqRef.current) setLoading(false);
            });
    }, [debouncedInput, readOnly]);

    const getOptionLabel = useCallback(
        (o) => (typeof o === "string" ? o : o.ten_benh),
        [],
    );

    const handleInputChange = useCallback((_, value, reason) => {
        if (reason === "reset") return;
        setInputValue(value);
    }, []);

    const handleChange = useCallback(
        (_, value) => {
            if (value && typeof value === "object") {
                setInputValue(value.ten_benh);
                onSelectDisease(value);
            }
        },
        [onSelectDisease],
    );

    const renderOption = useCallback((props, option) => {
        const { key, ...optionProps } = props;
        return (
            <Box component="li" key={option.ma_benh} {...optionProps}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {option.ten_benh}
                </Typography>
                {option.mo_ta && option.mo_ta !== option.ten_benh && (
                    <Typography variant="caption" color="text.secondary">
                        {option.mo_ta}
                    </Typography>
                )}
            </Box>
        );
    }, []);

    return (
        <Autocomplete
            freeSolo
            fullWidth
            value={null}
            inputValue={inputValue}
            options={options}
            loading={loading}
            disabled={readOnly}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(o, v) =>
                v && typeof v === "object"
                    ? o.ma_benh === v.ma_benh
                    : o.ten_benh === v
            }
            filterOptions={(x) => x}
            onInputChange={handleInputChange}
            onChange={handleChange}
            renderOption={renderOption}
            clearOnBlur={false}
            noOptionsText="Không tìm thấy bệnh nào"
            loadingText="Đang tìm..."
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Chẩn đoán bệnh"
                    placeholder="Nhập tên bệnh..."
                    disabled={readOnly}
                />
            )}
        />
    );
});
