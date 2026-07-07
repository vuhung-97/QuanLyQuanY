import { forwardRef, memo } from "react";
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

const KetLuanTab = memo(
    forwardRef(function KetLuanTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const { data, handleChange } = useFormTab(
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
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>
                                    Phân loại sức khỏe chung
                                </InputLabel>
                                <Select
                                    name="phan_loai_suc_khoe"
                                    value={data.phan_loai_suc_khoe}
                                    onChange={handleChange}
                                    label="Phân loại sức khỏe chung"
                                    disabled={readOnly}
                                >
                                    {PHAN_LOAI_SUC_KHOE.map((o) => (
                                        <MenuItem key={o.value} value={o.value}>
                                            {o.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <TextField
                                label="Lý do phân loại / Đánh giá chung"
                                name="ly_do"
                                value={data.ly_do}
                                onChange={handleChange}
                                multiline
                                minRows={4}
                                fullWidth
                                size="small"
                                disabled={readOnly}
                            />
                        </Grid>
                        <Grid size={12}>
                            <NormalToggleField
                                label="Bệnh tật cần theo dõi dự phòng"
                                name="benh_tat_theo_doi"
                                value={data.benh_tat_theo_doi}
                                onChange={handleChange}
                                readOnly={readOnly}
                                size="small"
                                normalText="Không"
                                multiline
                                minRows={4}
                            />
                        </Grid>
                        <Grid size={12}>
                            <NormalToggleField
                                label="Chỉ dẫn cần thiết khác"
                                name="chi_dan_khac"
                                value={data.chi_dan_khac}
                                onChange={handleChange}
                                readOnly={readOnly}
                                size="small"
                                normalText="Không"
                                multiline
                                minRows={4}
                                helperText="Chỉ dẫn chế độ ăn uống, sinh hoạt, tập luyện hoặc đề nghị chuyển viện điều trị."
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }),
);

export default KetLuanTab;
