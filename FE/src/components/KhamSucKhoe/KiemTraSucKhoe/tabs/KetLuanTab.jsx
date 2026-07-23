import { forwardRef, memo } from "react";
import { Card, CardContent, Grid } from "@mui/material";
import useFormTab from "@/hooks/useFormTab";
import PhanLoaiSelect from "../common/PhanLoaiSelect.jsx";
import NormalToggleFieldSM from "../common/NormalToggleFieldSM.jsx";
import SectionTitle from "@/components/KhamSucKhoe/common/SectionTitle.jsx";
import {
    DEFAULT_PHAN_LOAI,
    PHAN_LOAI_OPTIONS,
} from "@/constants/khamSucKhoeConstants.js";

const KetLuanTab = memo(
    forwardRef(function KetLuanTab(
        { initialData, cardStyle, readOnly = false },
        ref,
    ) {
        const { dataRef } = useFormTab(
            {
                phan_loai_suc_khoe:
                    initialData?.phan_loai_suc_khoe ?? DEFAULT_PHAN_LOAI,
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
                        <PhanLoaiSelect
                            name="phan_loai_suc_khoe"
                            label="Phân loại sức khỏe chung"
                            dataRef={dataRef}
                            readOnly={readOnly}
                            options={PHAN_LOAI_OPTIONS}
                            gridProps={{ xs: 12, sm: 4 }}
                        />
                        <NormalToggleFieldSM
                            name="ly_do"
                            label="Lý do phân loại / Đánh giá chung"
                            dataRef={dataRef}
                            readOnly={readOnly}
                            multiline
                            minRows={4}
                            maxRows={4}
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
                            maxRows={4}
                        />
                        <NormalToggleFieldSM
                            name="chi_dan_khac"
                            label="Chỉ dẫn cần thiết khác"
                            dataRef={dataRef}
                            readOnly={readOnly}
                            normalText="Không"
                            multiline
                            minRows={4}
                            maxRows={4}
                            helperText="Chỉ dẫn chế độ ăn uống, sinh hoạt, tập luyện hoặc đề nghị chuyển viện điều trị."
                        />
                    </Grid>
                </CardContent>
            </Card>
        );
    }),
);

export default KetLuanTab;
