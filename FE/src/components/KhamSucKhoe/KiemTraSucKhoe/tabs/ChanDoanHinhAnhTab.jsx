import { forwardRef, memo, useCallback, useState } from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import useFormTab from "@/hooks/useFormTab";
import PhanLoaiSelect from "../common/PhanLoaiSelect.jsx";
import NormalToggleFieldSM from "../common/NormalToggleFieldSM.jsx";
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
        const { dataRef } = useFormTab(initialData, ref);

        return (
            <Card sx={cardStyle}>
                <CardContent>
                    <SectionTitle>Chẩn đoán hình ảnh & Khác</SectionTitle>
                    <Grid container spacing={3}>
                        {cdhaFields.map((f) => (
                            <Grid key={f.name} size={{ xs: 12, sm: 6 }}>
                                <Grid container direction="column" spacing={2}>
                                    <NormalToggleFieldSM
                                        name={f.name}
                                        label={f.label}
                                        dataRef={dataRef}
                                        readOnly={readOnly}
                                        multiline
                                        grid={12}
                                        minRows={4}
                                        maxRows={4}
                                    />
                                    <PhanLoaiSelect
                                        name={`${f.name}_loai`}
                                        label={`Phân loại ${f.label}`}
                                        dataRef={dataRef}
                                        readOnly={readOnly}
                                        gridProps={12}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        );
    }),
);

export default ChanDoanHinhAnhTab;
