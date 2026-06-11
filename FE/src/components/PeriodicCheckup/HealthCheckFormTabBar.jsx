import { Box, Tab, Tabs } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import BiotechIcon from "@mui/icons-material/Biotech";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const tabs = [
    { icon: <HistoryIcon />, label: "Tiền sử" },
    { icon: <MonitorHeartIcon />, label: "Lâm sàng" },
    { icon: <BiotechIcon />, label: "Cận lâm sàng" },
    { icon: <AssignmentTurnedInIcon />, label: "Kết luận" },
];

export default function HealthCheckFormTabBar({ activeTab, onTabChange }) {
    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
                value={activeTab}
                onChange={onTabChange}
                variant="fullWidth"
                sx={{
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#00B4D8",
                        height: 3,
                    },
                    "& .MuiTab-root": {
                        color: "#0B3B60",
                        fontWeight: "bold",
                        "&.Mui-selected": { color: "#00B4D8" },
                    },
                }}
            >
                {tabs.map((t) => (
                    <Tab key={t.label} icon={t.icon} iconPosition="start" label={t.label} />
                ))}
            </Tabs>
        </Box>
    );
}
