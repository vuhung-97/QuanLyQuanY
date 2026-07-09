import { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import BaoCaoThangMain from "../../components/BaoCao/BaoCaoThangMain.jsx";
import BaoCaoTonKhoMain from "../../components/BaoCao/BaoCaoTonKhoMain.jsx";

export default function BaoCaoPage() {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Báo cáo tháng" />
                <Tab label="Tồn kho" />
            </Tabs>
            {tab === 0 && <BaoCaoThangMain />}
            {tab === 1 && <BaoCaoTonKhoMain />}
        </Box>
    );
}
