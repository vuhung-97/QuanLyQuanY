import { forwardRef, memo } from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import useFormTab from "@/hooks/useFormTab";
import NormalToggleField from "@/components/common/NormalToggleField";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";

const cdhaFields = [
    { name: "dien_tim", label: "Điện tim (ECG)" },
    { name: "x_quang", label: "X-Quang tim phổi" },
    { name: "sieu_am", label: "Siêu âm ổ bụng" },
    { name: "khac", label: "Cận lâm sàng khác" },
];

const ChanDoanHinhAnhTab = memo(
    forwardRef(function ChanDoanHinhAnhTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const { data, handleChange } = useFormTab(initialData, ref);

        return (
            <Card sx={cardStyle}>
                <CardContent>
                    <SectionTitle>Chẩn đoán hình ảnh & Khác</SectionTitle>
                    <Grid container spacing={2}>
                        {cdhaFields.map((f) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={f.name}>
                                <NormalToggleField
                                    label={f.label}
                                    name={f.name}
                                    value={data[f.name]}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    size="small"
                                    multiline
                                    minRows={7}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        );
    }),
);

export default ChanDoanHinhAnhTab;
