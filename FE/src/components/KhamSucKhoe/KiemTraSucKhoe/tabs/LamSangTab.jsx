import { forwardRef, memo, useCallback, useState } from "react";
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

const ChuyenKhoaRow = memo(({ sp, dataRef, readOnly }) => {
    const noteName = `${sp.id}_note`;
    const loaiName = `${sp.id}_loai`;

    const [noteVal, setNoteVal] = useState(() => dataRef.current?.[noteName] ?? "");
    const [loaiVal, setLoaiVal] = useState(() => dataRef.current?.[loaiName] ?? PHAN_LOAI_OPTIONS[0]);

    const handleNoteChange = useCallback((e) => {
        const v = e.target.value;
        setNoteVal(v);
        dataRef.current[noteName] = v;
    }, [noteName, dataRef]);

    const handleLoaiChange = useCallback((e) => {
        const v = e.target.value;
        setLoaiVal(v);
        dataRef.current[loaiName] = v;
    }, [loaiName, dataRef]);

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
                        name={noteName}
                        label="Kết quả khám"
                        value={noteVal}
                        onChange={handleNoteChange}
                        readOnly={readOnly}
                        size="small"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Phân loại</InputLabel>
                        <Select
                            name={loaiName}
                            value={loaiVal}
                            onChange={handleLoaiChange}
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
});

const LamSangTab = memo(
    forwardRef(function LamSangTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const { dataRef } = useFormTab(initialData, ref);

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
                                    dataRef={dataRef}
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
