import { Card, CardContent, Grid, Typography } from "@mui/material";
import PhanLoaiBenhChart from "./PhanLoaiBenhChart.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import { PHAN_LOAI_COLUMNS } from "@/constants/bao_cao.js";

function ChartSection({ title, data }) {
    return (
        <Card
            sx={{
                width: "100%",
                height: "500px",
            }}
        >
            <CardContent>
                <Typography variant="h3" sx={{ mb: 2, color: "primary.main" }}>
                    {title}
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <PhanLoaiBenhChart data={data} title={title} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <DataTable
                            columns={PHAN_LOAI_COLUMNS}
                            rows={data}
                            minWidth={300}
                            sx={{ maxHeight: 400, overflow: "auto" }}
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
                title="Khám chữa bệnh ngoại trú"
                data={data.phan_loai_benh_kham}
            />
            <ChartSection
                title="Khám chữa bệnh nội trú"
                data={data.phan_loai_benh_noi_tru}
            />
        </>
    );
}
