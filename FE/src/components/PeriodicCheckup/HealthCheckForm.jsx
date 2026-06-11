import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import useHealthCheckForm from "../../hooks/useHealthCheckForm";
import { cardStyle } from "./healthCheckFormUtils";
import HealthCheckFormHeader from "./HealthCheckFormHeader";
import HealthCheckFormTabBar from "./HealthCheckFormTabBar";
import HeaderCard from "./HealthCheckFormInfoCard";
import TienSuTab from "./tabs/TienSuTab";
import LamSangTab from "./tabs/LamSangTab";
import CanLamSangTab from "./tabs/CanLamSangTab";
import KetLuanTab from "./tabs/KetLuanTab";

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`health-check-tabpanel-${index}`}
            aria-labelledby={`health-check-tab-${index}`}
            {...other}
        >
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
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            slotProps={{
                paper: { sx: { bgcolor: "#F4F7F9" } },
            }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <HealthCheckFormHeader quanNhan={quanNhan} />

                <DialogContent sx={{ mt: 2, px: 3 }}>
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <HeaderCard
                        quanNhan={quanNhan}
                        ngayNhapNgu={ngayNhapNgu}
                        cardStyle={cardStyle}
                        unitLookup={unitLookup}
                    />

                    <HealthCheckFormTabBar
                        activeTab={activeTab}
                        onTabChange={(_, val) => setActiveTab(val)}
                    />

                    <TabPanel value={activeTab} index={0}>
                        <TienSuTab ts={ts} onTsChange={handleTsChange} cardStyle={cardStyle} readOnly={readOnly} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <LamSangTab ls={ls} onLsChange={handleLsChange} cardStyle={cardStyle} readOnly={readOnly} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={2}>
                        <CanLamSangTab cls={cls} onClsChange={handleClsChange} cardStyle={cardStyle} readOnly={readOnly} />
                    </TabPanel>
                    <TabPanel value={activeTab} index={3}>
                        <KetLuanTab kl={kl} onKlChange={handleKlChange} cardStyle={cardStyle} readOnly={readOnly} />
                    </TabPanel>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3, pb: 2.5, pt: 1.5,
                        borderTop: "1px solid", borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <Button onClick={onClose} variant="outlined" color="inherit">
                        Hủy
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={saving || readOnly}>
                        {readOnly ? "Đã xem" : saving ? "Đang lưu..." : "Lưu phiếu khám"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
