import { memo, useCallback, useMemo } from "react";
import {
    Box,
    Button,
    Grid,
    LinearProgress,
    Slider,
    Typography,
} from "@mui/material";

export default memo(function PredictionPanel({
    predictions,
    predicting,
    threshold,
    onThresholdChange,
    onDiagnose,
    onSelectPrediction,
    readOnly,
    disabled,
}) {
    const filtered = useMemo(
        () => predictions.filter((p) => p.probability >= threshold),
        [predictions, threshold],
    );

    const handleSliderChange = useCallback(
        (_, v) => onThresholdChange(v),
        [onThresholdChange],
    );

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" sx={{ mb: 1.5, color: "text.primary" }}>
                Kết quả chẩn đoán AI
            </Typography>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
                onClick={onDiagnose}
                disabled={disabled || predicting || readOnly}
            >
                {predicting ? "Đang dự đoán..." : "Chẩn đoán AI"}
            </Button>

            {predictions.length > 0 && (
                <Box
                    sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        bgcolor: "grey.50",
                    }}
                >
                    <Box sx={{ px: 1, mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            Tỷ lệ % tối thiểu: {threshold}%
                        </Typography>
                        <Slider
                            value={threshold}
                            onChange={handleSliderChange}
                            min={5}
                            max={100}
                            step={1}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(v) => `${v}%`}
                            disabled={readOnly}
                            size="small"
                        />
                    </Box>

                    {filtered.length === 0 ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: "center", py: 1 }}
                        >
                            Không có kết quả nào đạt ngưỡng {threshold}%
                        </Typography>
                    ) : (
                        filtered.map((p, i) => (
                            <Button
                                key={i}
                                fullWidth
                                variant="text"
                                onClick={() => onSelectPrediction(p.disease)}
                                sx={{
                                    textTransform: "none",
                                    p: 1,
                                    mb: 0.5,
                                    borderRadius: 1,
                                    display: "block",
                                    textAlign: "left",
                                    "&:hover": { bgcolor: "action.hover" },
                                }}
                                disabled={readOnly}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500, mb: 0.5 }}
                                >
                                    {p.disease}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min(p.probability, 100)}
                                        sx={{
                                            flex: 1,
                                            height: 8,
                                            borderRadius: 4,
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            minWidth: 40,
                                            textAlign: "right",
                                        }}
                                    >
                                        {p.probability}%
                                    </Typography>
                                </Box>
                            </Button>
                        ))
                    )}

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", textAlign: "right", mt: 0.5 }}
                    >
                        Click vào bệnh để điền vào chẩn đoán
                    </Typography>
                </Box>
            )}
        </Grid>
    );
});
