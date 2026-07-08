import { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import BaoCaoThang from "../../components/BaoCao/BaoCaoThang.jsx";
import BaoCaoTonKho from "../../components/BaoCao/BaoCaoTonKho.jsx";

export default function BaoCaoPage() {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: "#0B3B60" }}>
                Báo cáo thống kê
            </Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Báo cáo tháng" />
                <Tab label="Tồn kho" />
            </Tabs>
            {tab === 0 && <BaoCaoThang />}
            {tab === 1 && <BaoCaoTonKho />}
        </Box>
    );
}
