import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import BaoCaoThangMain from "../../components/BaoCao/BaoCaoThang/BaoCaoThangMain.jsx";
import BaoCaoQuanSoKhoeMain from "../../components/BaoCao/BaoCaoQSKhoe/BaoCaoQuanSoKhoeMain.jsx";
import BaoCaoQuanNhanMain from "../../components/BaoCao/BaoCaoQuanNhan/BaoCaoQuanNhanMain.jsx";

export default function BaoCaoPage() {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Quân y tháng" />
                <Tab label="Quân số khỏe" />
                <Tab label="Quân nhân" />
            </Tabs>
            {tab === 0 && <BaoCaoThangMain />}
            {tab === 1 && <BaoCaoQuanSoKhoeMain />}
            {tab === 2 && <BaoCaoQuanNhanMain />}
        </Box>
    );
}
