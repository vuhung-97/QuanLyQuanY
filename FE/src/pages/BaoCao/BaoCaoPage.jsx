import { useState, useMemo } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import BaoCaoThangMain from "../../components/BaoCao/BaoCaoThang/BaoCaoThangMain.jsx";
import BaoCaoQuanSoKhoeMain from "../../components/BaoCao/BaoCaoQSKhoe/BaoCaoQuanSoKhoeMain.jsx";
import BaoCaoQuanNhanMain from "../../components/BaoCao/BaoCaoQuanNhan/BaoCaoQuanNhanMain.jsx";
import { decodeJWT } from "../../services/api.js";
import { STORAGE_KEYS } from "../../components/layout/common/constants.js";

export default function BaoCaoPage() {
    const [tab, setTab] = useState(0);

    const jwtPayload = useMemo(() => {
        const token = localStorage.getItem(STORAGE_KEYS.token);
        return token ? decodeJWT(token) : null;
    }, []);

    const role = jwtPayload?.role || "";
    const id_quan_nhan = jwtPayload?.id_quan_nhan || "";

    return (
        <Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Quân y tháng" />
                <Tab label="Quân số khỏe" />
                <Tab label="Quân nhân" />
            </Tabs>
            {tab === 0 && <BaoCaoThangMain hidePrint={role === "ROLE_QN"} />}
            {tab === 1 && <BaoCaoQuanSoKhoeMain hidePrint={role === "ROLE_QN"} />}
            {tab === 2 && (
                <BaoCaoQuanNhanMain
                    maQuanNhan={role === "ROLE_QN" ? id_quan_nhan : undefined}
                />
            )}
        </Box>
    );
}
