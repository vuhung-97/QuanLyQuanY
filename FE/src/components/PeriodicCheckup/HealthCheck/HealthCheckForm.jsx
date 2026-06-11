import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, Tab, Tabs, Typography } from "@mui/material";
import { Biotech as BiotechIcon } from "@mui/icons-material";
import HistoryIcon from "@mui/icons-material/History";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import useHealthCheckForm from "../../../hooks/useHealthCheckForm";
import { cardStyle } from "./healthCheckFormUtils";
import TienSuTab from "./tabs/TienSuTab";
import LamSangTab from "./tabs/LamSangTab";
import CanLamSangTab from "./tabs/CanLamSangTab";
import KetLuanTab from "./tabs/KetLuanTab";

function FormHeader({ quanNhan }) {
    return (
        <DialogTitle
            component="div"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            <Typography fontWeight="bold" color="#0B3B60"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Phiếu khám sức khỏe định kỳ (MB02)
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="600">
                {quanNhan?.ho_ten} ({quanNhan?.ma_quan_nhan})
            </Typography>
        </DialogTitle>
    );
}

const itemSx = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 56,
};

function FormInfoCard({ quanNhan, ngayNhapNgu, unitLookup = new Map() }) {
    const infoFields = [
        {
            label: "Họ và tên",
            value: `${quanNhan?.ho_ten || "—"} (${quanNhan?.ma_quan_nhan || "N/A"})`,
        },
        {
            label: "Đơn vị",
            value: unitLookup.get(quanNhan?.ma_don_vi) || quanNhan?.ma_don_vi || "—",
        },
        {
            label: "Cấp bậc / Chức vụ",
            value: `${quanNhan?.cap_bac || "—"} / ${quanNhan?.chuc_vu || "—"}`,
        },
        { label: "Ngày sinh", value: quanNhan?.ngay_sinh || quanNhan?.nam_sinh || "—" },
        { label: "Ngày nhập ngũ", value: ngayNhapNgu || "—" },
    ];
    return (
        <Box sx={{ ...cardStyle, mb: 3 }}>
            <Box sx={{ py: 2, px: 3 }}>
                <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                    {infoFields.map((field, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index} sx={itemSx}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    {field.label}
                                </Typography>
                                <Typography variant="body2" fontWeight="600"
                                    color={index === 0 ? "primary" : "text.primary"}>
                                    {field.value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

const tabConfigs = [
    { icon: <HistoryIcon />, label: "Tiền sử" },
    { icon: <MonitorHeartIcon />, label: "Lâm sàng" },
    { icon: <BiotechIcon />, label: "Cận lâm sàng" },
    { icon: <AssignmentTurnedInIcon />, label: "Kết luận" },
];

function FormTabBar({ activeTab, onTabChange }) {
    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={onTabChange} variant="fullWidth"
                sx={{
                    "& .MuiTabs-indicator": { backgroundColor: "#00B4D8", height: 3 },
                    "& .MuiTab-root": {
                        color: "#0B3B60", fontWeight: "bold",
                        "&.Mui-selected": { color: "#00B4D8" },
                    },
                }}>
                {tabConfigs.map((t) => (
                    <Tab key={t.label} icon={t.icon} iconPosition="start" label={t.label} />
                ))}
            </Tabs>
        </Box>
    );
}

function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index}
            id={`health-check-tabpanel-${index}`} {...other}>
            {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
        </div>
    );
}

export default function HealthCheckForm({
    open, onClose, onSaved, quanNhan, existingPhieu, unitLookup, nam, readOnly = false,
}) {
    const {
        activeTab, setActiveTab, ngayNhapNgu, saving, error,
        ts, ls, cls, kl,
        handleTsChange, handleLsChange, handleClsChange, handleKlChange, handleSubmit,
    } = useHealthCheckForm({ open, quanNhan, existingPhieu, nam, onSaved, onClose });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg"
            slotProps={{ paper: { sx: { bgcolor: "#F4F7F9" } } }}>
            <Box component="form" onSubmit={handleSubmit}>
                <FormHeader quanNhan={quanNhan} />

                <DialogContent sx={{ mt: 2, px: 3 }}>
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <FormInfoCard quanNhan={quanNhan} ngayNhapNgu={ngayNhapNgu}
                        unitLookup={unitLookup} />

                    <FormTabBar activeTab={activeTab}
                        onTabChange={(_, val) => setActiveTab(val)} />

                    <TabPanel value={activeTab} index={0}>
                        <TienSuTab ts={ts} onTsChange={handleTsChange}
                            cardStyle={cardStyle} readOnly={readOnly} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <LamSangTab ls={ls} onLsChange={handleLsChange}
                            cardStyle={cardStyle} readOnly={readOnly} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={2}>
                        <CanLamSangTab cls={cls} onClsChange={handleClsChange}
                            cardStyle={cardStyle} readOnly={readOnly} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={3}>
                        <KetLuanTab kl={kl} onKlChange={handleKlChange}
                            cardStyle={cardStyle} readOnly={readOnly} />
                    </TabPanel>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5,
                    borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                    <Button onClick={onClose} variant="outlined" color="inherit">Hủy</Button>
                    <Button type="submit" variant="contained" color="primary"
                        disabled={saving || readOnly}>
                        {readOnly ? "Đã xem" : saving ? "Đang lưu..." : "Lưu phiếu khám"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
