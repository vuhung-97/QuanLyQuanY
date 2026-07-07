import { forwardRef, memo } from "react";
import {
    Card,
    CardContent,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import useFormTab from "@/hooks/useFormTab";
import NormalToggleField from "@/components/common/NormalToggleField";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";
import { PHAN_LOAI_OPTIONS } from "@/constants/khamSucKhoeConstants.js";

const specialities = [
    { id: "tim_mach", label: "Tim mạch" },
    { id: "ho_hap", label: "Hô hấp" },
    { id: "tieu_hoa", label: "Tiêu hóa" },
    {
        id: "than_tiet_nieu_sinh_duc_nam",
        label: "Thận, tiết niệu - sinh dục nam",
    },
    { id: "tam_than_than_kinh", label: "Tâm thần - thần kinh" },
    { id: "co_xuong_khop", label: "Cơ, xương khớp" },
    {
        id: "noi_tiet_chuyen_hoa_mien_dich",
        label: "Nội tiết, chuyển hóa, miễn dịch",
    },
    { id: "benh_mau", label: "Bệnh máu" },
    { id: "ngoai_khoa", label: "Ngoại khoa" },
    { id: "da_lieu", label: "Da liễu" },
    { id: "phu_san", label: "Phụ sản" },
    { id: "tai_mui_hong", label: "Tai mũi họng" },
    { id: "rang_ham_mat", label: "Răng hàm mặt" },
];

const ChuyenKhoaRow = memo(
    ({ sp, noteValue, loaiValue, onChange, readOnly }) => {
        return (
            <Grid size={12}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography
                            variant="body2"
                            fontWeight="600"
                            color="primary"
                        >
                            {sp.label}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <NormalToggleField
                            name={`${sp.id}_note`}
                            label="Kết quả khám"
                            value={noteValue}
                            onChange={onChange}
                            readOnly={readOnly}
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Phân loại</InputLabel>
                            <Select
                                name={`${sp.id}_loai`}
                                value={loaiValue}
                                onChange={onChange}
                                label="Phân loại"
                                disabled={readOnly}
                            >
                                {PHAN_LOAI_OPTIONS.map((loai) => (
                                    <MenuItem key={loai} value={loai}>
                                        {loai}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <Divider sx={{ opacity: 0.5 }} />
                    </Grid>
                </Grid>
            </Grid>
        );
    },
);

const LamSangTab = memo(
    forwardRef(function LamSangTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const { data, handleChange } = useFormTab(initialData, ref);

        return (
            <>
                <Card sx={cardStyle}>
                    <CardContent>
                        <SectionTitle>Khám chuyên khoa</SectionTitle>
                        <Grid container spacing={2}>
                            {specialities.map((sp) => (
                                <ChuyenKhoaRow
                                    key={sp.id}
                                    sp={sp}
                                    noteValue={data[`${sp.id}_note`]}
                                    loaiValue={data[`${sp.id}_loai`]}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </>
        );
    }),
);

export default LamSangTab;
