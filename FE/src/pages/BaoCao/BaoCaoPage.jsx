import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import BaoCaoThangMain from "../../components/BaoCao/BaoCaoThangMain.jsx";
import BaoCaoQuanSoKhoeMain from "../../components/BaoCao/BaoCaoQuanSoKhoeMain.jsx";

export default function BaoCaoPage() {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Quân y tháng" />
                <Tab label="Quân số khỏe" />
            </Tabs>
            {tab === 0 && <BaoCaoThangMain />}
            {tab === 1 && <BaoCaoQuanSoKhoeMain />}
        </Box>
    );
}
