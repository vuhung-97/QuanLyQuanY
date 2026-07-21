import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Grid, TextField, Typography } from "@mui/material";
import useStaticList from "@/hooks/useStaticList.js";
import useDebounce from "@/hooks/useDebounce.jsx";

const LIMIT = 50;

const ChipList = memo(function ChipList({
    filteredSymptoms,
    trieuChungWords,
    onChipClick,
}) {
    const handleChipClick = useCallback(
        (e) => onChipClick(e.currentTarget.dataset.symptom),
        [onChipClick],
    );
    return filteredSymptoms.map((s) => {
        const selected = trieuChungWords.includes(s);
        return (
            <Chip
                key={s}
                data-symptom={s}
                label={s}
                size="small"
                variant={selected ? "filled" : "outlined"}
                color={selected ? "primary" : "default"}
                onClick={handleChipClick}
                sx={{ cursor: "pointer" }}
            />
        );
    });
});

export default memo(function SymptomsSection({
    trieuChung,
    onTrieuChungChange,
    onChipClick,
    readOnly,
}) {
    const [showAll, setShowAll] = useState(false);
    const [searchText, setSearchText] = useState(trieuChung);
    const debouncedText = useDebounce(searchText, 200);
    const symptoms = useStaticList("/dm_trieu_chung", {
        pageSize: 200,
        transform: (s) => s.ten_trieu_chung,
    });

    useEffect(() => {
        onTrieuChungChange(debouncedText);
    }, [debouncedText]);

    useEffect(() => {
        setSearchText(trieuChung);
    }, [trieuChung]);

    const trieuChungWords = useMemo(
        () => trieuChung.split(/[,;]\s*/).filter(Boolean),
        [trieuChung],
    );

    const filteredSymptoms = useMemo(() => {
        const segments = searchText.split(/[,;]\s*/);
        const last = segments[segments.length - 1] || "";
        if (!last.trim()) return symptoms;
        const q = last.toLowerCase();
        return symptoms.filter((s) => s.toLowerCase().includes(q));
    }, [symptoms, searchText]);

    const isSearching = useMemo(() => {
        const segments = searchText.split(/[,;]\s*/);
        const last = segments[segments.length - 1] || "";
        return last.trim().length > 0;
    }, [searchText]);

    const visibleSymptoms = useMemo(
        () => (isSearching || showAll) ? filteredSymptoms : filteredSymptoms.slice(0, LIMIT),
        [filteredSymptoms, showAll, isSearching],
    );

    const hasMore = filteredSymptoms.length > LIMIT;

    const handleToggleShow = useCallback(() => setShowAll((s) => !s), []);

    const handleChange = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" sx={{ mb: 1.5, color: "text.primary" }}>
                Triệu chứng
            </Typography>
            <TextField
                value={searchText}
                onChange={handleChange}
                multiline
                minRows={4}
                fullWidth
                placeholder="Nhập triệu chứng..."
                disabled={readOnly}
            />
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, mb: 1 }}
            >
                Triệu chứng có sẵn:
            </Typography>
            <Box
                sx={{
                    maxHeight: 160,
                    overflowY: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                }}
            >
                <ChipList
                    filteredSymptoms={visibleSymptoms}
                    trieuChungWords={trieuChungWords}
                    onChipClick={onChipClick}
                />
            </Box>
            {!isSearching && hasMore && (
                <Button size="small" onClick={handleToggleShow} sx={{ mt: 0.5 }}>
                    {showAll ? "Thu gọn" : `Xem thêm (${filteredSymptoms.length - LIMIT})`}
                </Button>
            )}
        </Grid>
    );
});
