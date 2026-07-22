import { forwardRef, memo, useCallback, useState } from "react";
import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import useFormTab from "@/hooks/useFormTab";
import NormalToggleField from "@/components/common/NormalToggleField";
import PhanLoaiSelect from "../common/PhanLoaiSelect.jsx";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";

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

    const [noteVal, setNoteVal] = useState(
        () => dataRef.current?.[noteName] ?? "",
    );

    const handleNoteChange = useCallback(
        (e) => {
            const v = e.target.value;
            setNoteVal(v);
            dataRef.current[noteName] = v;
        },
        [noteName, dataRef],
    );

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
                        multiline
                    />
                </Grid>
                <PhanLoaiSelect
                    name={`${sp.id}_loai`}
                    label={`Phân loại ${sp.label}`}
                    dataRef={dataRef}
                    readOnly={readOnly}
                    gridProps={{ xs: 12, sm: 3 }}
                />
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
