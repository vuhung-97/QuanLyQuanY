import { forwardRef, memo, useCallback, useState } from "react";
import {
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import useFormTab from "@/hooks/useFormTab";
import NormalToggleField from "@/components/common/NormalToggleField";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";
import { DEFAULT_PHAN_LOAI, PHAN_LOAI_SUC_KHOE } from "@/constants/khamSucKhoeConstants.js";

const SelectFieldSM = memo(({ name, label, dataRef, readOnly, options }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? DEFAULT_PHAN_LOAI);

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setVal(v);
        dataRef.current[name] = v;
    }, [name, dataRef]);

    return (
        <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                    name={name}
                    value={val}
                    onChange={handleChange}
                    label={label}
                    disabled={readOnly}
                >
                    {options.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                            {o.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
});

const TextFieldSM = memo(({ name, label, dataRef, readOnly, multiline, minRows, grid }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setVal(v);
        dataRef.current[name] = v;
    }, [name, dataRef]);

    return (
        <Grid size={grid}>
            <TextField
                label={label}
                name={name}
                value={val}
                onChange={handleChange}
                multiline={multiline}
                minRows={minRows}
                fullWidth
                size="small"
                disabled={readOnly}
            />
        </Grid>
    );
});

const NormalToggleFieldSM = memo(({ name, label, dataRef, readOnly, multiline, minRows, normalText, helperText }) => {
    const [val, setVal] = useState(() => dataRef.current?.[name] ?? "");

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setVal(v);
        dataRef.current[name] = v;
    }, [name, dataRef]);

    return (
        <Grid size={12}>
            <NormalToggleField
                label={label}
                name={name}
                value={val}
                onChange={handleChange}
                readOnly={readOnly}
                size="small"
                normalText={normalText}
                multiline={multiline}
                minRows={minRows}
                helperText={helperText}
            />
        </Grid>
    );
});

const KetLuanTab = memo(
    forwardRef(function KetLuanTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const { dataRef } = useFormTab(
            {
                phan_loai_suc_khoe: initialData?.phan_loai_suc_khoe ?? DEFAULT_PHAN_LOAI,
                ly_do: initialData?.ly_do ?? "",
                benh_tat_theo_doi: initialData?.benh_tat_theo_doi ?? "",
                chi_dan_khac: initialData?.chi_dan_khac ?? "",
            },
            ref,
        );

        return (
            <Card sx={cardStyle}>
                <CardContent>
                    <SectionTitle>
                        Đánh giá & Phân loại sức khỏe chung
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <SelectFieldSM
                            name="phan_loai_suc_khoe"
                            label="Phân loại sức khỏe chung"
                            dataRef={dataRef}
                            readOnly={readOnly}
                            options={PHAN_LOAI_SUC_KHOE}
                        />
                        <TextFieldSM
                            name="ly_do"
                            label="Lý do phân loại / Đánh giá chung"
                            dataRef={dataRef}
                            readOnly={readOnly}
                            multiline
                            minRows={4}
                            grid={{ xs: 12, sm: 8 }}
                        />
                        <NormalToggleFieldSM
                            name="benh_tat_theo_doi"
                            label="Bệnh tật cần theo dõi dự phòng"
                            dataRef={dataRef}
                            readOnly={readOnly}
                            normalText="Không"
                            multiline
                            minRows={4}
                        />
                        <NormalToggleFieldSM
                            name="chi_dan_khac"
                            label="Chỉ dẫn cần thiết khác"
                            dataRef={dataRef}
                            readOnly={readOnly}
                            normalText="Không"
                            multiline
                            minRows={4}
                            helperText="Chỉ dẫn chế độ ăn uống, sinh hoạt, tập luyện hoặc đề nghị chuyển viện điều trị."
                        />
                    </Grid>
                </CardContent>
            </Card>
        );
    }),
);

export default KetLuanTab;
