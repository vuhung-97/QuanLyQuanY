import { memo, useCallback, useMemo } from "react";
import { Box, Chip, Grid, TextField, Typography } from "@mui/material";
import symptoms from "@/data/trieu_chung.json";

const CHIP_LIMIT = 30;

const ChipList = memo(function ChipList({
    filteredSymptoms,
    trieuChungWords,
    onChipClick,
}) {
    const handleChipClick = useCallback(
        (e) => onChipClick(e.currentTarget.dataset.symptom),
        [onChipClick],
    );
    const hasMore = filteredSymptoms.length > CHIP_LIMIT;
    const visible = hasMore
        ? filteredSymptoms.slice(0, CHIP_LIMIT)
        : filteredSymptoms;
    return (
        <>
            {visible.map((s) => {
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
            })}
            {hasMore && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ alignSelf: "center" }}
                >
                    +{filteredSymptoms.length - CHIP_LIMIT} khác...
                </Typography>
            )}
        </>
    );
});

export default memo(function SymptomsSection({
    trieuChung,
    onTrieuChungChange,
    onChipClick,
    readOnly,
}) {
    const trieuChungWords = useMemo(
        () => trieuChung.split(/[,;]\s*/).filter(Boolean),
        [trieuChung],
    );

    const filteredSymptoms = useMemo(() => {
        const segments = trieuChung.split(/[,;]\s*/);
        const last = segments[segments.length - 1] || "";
        if (!last.trim()) return symptoms;
        const q = last.toLowerCase();
        return symptoms.filter((s) => s.toLowerCase().includes(q));
    }, [trieuChung]);

    const handleTextFieldChange = useCallback(
        (e) => onTrieuChungChange(e.target.value),
        [onTrieuChungChange],
    );

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" sx={{ mb: 1.5, color: "text.primary" }}>
                Triệu chứng
            </Typography>
            <TextField
                multiline
                minRows={4}
                fullWidth
                value={trieuChung}
                onChange={handleTextFieldChange}
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
                    filteredSymptoms={filteredSymptoms}
                    trieuChungWords={trieuChungWords}
                    onChipClick={onChipClick}
                />
            </Box>
        </Grid>
    );
});
