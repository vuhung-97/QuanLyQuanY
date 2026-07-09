import { forwardRef, memo, useCallback, useState } from "react";
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

const NormalToggleFieldSM = memo(({ name, label, dataRef, readOnly, multiline, minRows }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setVal(v);
        dataRef.current[name] = v;
    }, [name, dataRef]);

    return (
        <Grid size={{ xs: 12, sm: 6 }}>
            <NormalToggleField
                label={label}
                name={name}
                value={val}
                onChange={handleChange}
                readOnly={readOnly}
                size="small"
                multiline={multiline}
                minRows={minRows}
            />
        </Grid>
    );
});

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
                    <Grid container spacing={2}>
                        {cdhaFields.map((f) => (
                            <NormalToggleFieldSM
                                key={f.name}
                                name={f.name}
                                label={f.label}
                                dataRef={dataRef}
                                readOnly={readOnly}
                                multiline
                                minRows={7}
                            />
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        );
    }),
);

export default ChanDoanHinhAnhTab;
