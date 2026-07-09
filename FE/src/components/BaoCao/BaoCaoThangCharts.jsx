import { Card, CardContent, Grid, Typography } from "@mui/material";
import PhanLoaiBenhChart from "./PhanLoaiBenhChart.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import { PHAN_LOAI_COLUMNS } from "@/constants/bao_cao.js";

function ChartSection({ title, data }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    {title}
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <PhanLoaiBenhChart data={data} title={title} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DataTable
                            columns={PHAN_LOAI_COLUMNS}
                            rows={data}
                            minWidth={300}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default function BaoCaoThangCharts({ data }) {
    return (
        <>
            <ChartSection
                title="Phân loại bệnh khám ngoại trú"
                data={data.phan_loai_benh_kham}
            />
            <ChartSection
                title="Bệnh nội trú (nằm bệnh xá)"
                data={data.phan_loai_benh_noi_tru}
            />
        </>
    );
}
