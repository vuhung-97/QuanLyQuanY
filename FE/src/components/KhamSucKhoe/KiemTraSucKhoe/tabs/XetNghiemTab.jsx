import { forwardRef, memo, useCallback, useState } from "react";
import {
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import useFormTab from "@/hooks/useFormTab";
import { fieldRanges, isOutOfRange } from "./fieldRanges";
import PhanLoaiSelect from "../common/PhanLoaiSelect.jsx";
import RangeFieldSM from "../common/RangeFieldSM.jsx";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";

const xetNghiemMauFields = [
    { name: "hong_cau", step: 0.01, label: "Hồng cầu", unit: "T/L" },
    { name: "bach_cau", step: 0.01, label: "Bạch cầu", unit: "G/L" },
    { name: "tieu_cau", step: 1, label: "Tiểu cầu", unit: "G/L" },
    { name: "glucose_mau", step: 0.01, label: "Glucose", unit: "mmol/l" },
    { name: "ure", step: 0.1, label: "Ure", unit: "mmol/l" },
    { name: "creatinin", step: 0.1, label: "Creatinin", unit: "umol/l" },
    { name: "ast", step: 0.1, label: "AST", unit: "U/L" },
    { name: "alt", step: 0.1, label: "ALT", unit: "U/L" },
];

const xetNghiemNuocTieuFields = [
    {
        name: "nuoc_tieu_glucose",
        label: "Glucose nước tiểu",
        type: "select",
        options: ["Âm tính", "Dương tính"],
    },
    {
        name: "nuoc_tieu_protein",
        label: "Protein nước tiểu",
        type: "select",
        options: ["Âm tính", "Dương tính"],
    },
    { name: "nuoc_tieu_te_bao", label: "Tế bào nước tiểu" },
];

const SelectFieldSM = memo(({ name, label, dataRef, readOnly, options }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

    const handleChange = useCallback(
        (e) => {
            const v = e.target.value;
            setVal(v);
            dataRef.current[name] = v;
        },
        [name, dataRef],
    );

    const outOfRange = isOutOfRange(name, val);

    return (
        <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
                select
                name={name}
                label={label}
                value={val}
                onChange={handleChange}
                fullWidth
                size="medium"
                error={outOfRange}
                disabled={readOnly}
            >
                <MenuItem value="">-- Chọn --</MenuItem>
                {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                        {opt}
                    </MenuItem>
                ))}
            </TextField>
        </Grid>
    );
});

const XetNghiemTab = memo(
    forwardRef(function XetNghiemTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const { dataRef } = useFormTab(initialData, ref);

        return (
            <>
                <Card sx={cardStyle}>
                    <CardContent>
                        <SectionTitle>Xét nghiệm máu</SectionTitle>
                        <Grid container spacing={2}>
                            {xetNghiemMauFields.map((f) => (
                                <RangeFieldSM
                                    key={f.name}
                                    name={f.name}
                                    label={f.label}
                                    dataRef={dataRef}
                                    readOnly={readOnly}
                                    unit={f.unit}
                                    step={f.step}
                                    xs={12}
                                    sm={3}
                                    md={3}
                                />
                            ))}

                            <PhanLoaiSelect
                                name="xn_mau_loai"
                                label="Phân loại xét nghiệm máu"
                                dataRef={dataRef}
                                readOnly={readOnly}
                            />
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ ...cardStyle, mt: 2 }}>
                    <CardContent>
                        <SectionTitle>Xét nghiệm nước tiểu</SectionTitle>
                        <Grid container spacing={2}>
                            {xetNghiemNuocTieuFields.map((f) => {
                                if (f.type === "select") {
                                    return (
                                        <SelectFieldSM
                                            key={f.name}
                                            name={f.name}
                                            label={f.label}
                                            dataRef={dataRef}
                                            readOnly={readOnly}
                                            options={f.options}
                                        />
                                    );
                                }
                                return (
                                    <RangeFieldSM
                                        key={f.name}
                                        name={f.name}
                                        label={f.label}
                                        dataRef={dataRef}
                                        readOnly={readOnly}
                                        xs={12}
                                        sm={4}
                                        md={4}
                                    />
                                );
                            })}

                            <PhanLoaiSelect
                                name="xn_nuoc_tieu_loai"
                                label="Phân loại xét nghiệm nước tiểu"
                                dataRef={dataRef}
                                readOnly={readOnly}
                            />
                        </Grid>
                    </CardContent>
                </Card>
            </>
        );
    }),
);

export default XetNghiemTab;
