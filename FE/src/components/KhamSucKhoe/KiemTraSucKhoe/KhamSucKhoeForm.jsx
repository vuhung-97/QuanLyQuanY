import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { Biotech as BiotechIcon } from "@mui/icons-material";
import HistoryIcon from "@mui/icons-material/History";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import useKhamSucKhoeForm from "../../../hooks/useKhamSucKhoeForm";
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
            <Typography
                fontWeight="bold"
                color="primary"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                Phiếu khám sức khỏe định kỳ
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
            value:
                unitLookup.get(quanNhan?.ma_don_vi) ||
                quanNhan?.ma_don_vi ||
                "—",
        },
        {
            label: "Cấp bậc / Chức vụ",
            value: `${quanNhan?.cap_bac || "—"} / ${quanNhan?.chuc_vu || "—"}`,
        },
        {
            label: "Ngày sinh",
            value: quanNhan?.ngay_sinh || quanNhan?.nam_sinh || "—",
        },
        { label: "Ngày nhập ngũ", value: ngayNhapNgu || "—" },
    ];
    return (
        <Box sx={{ ...cardStyle, mb: 3 }}>
            <Box sx={{ py: 2, px: 3 }}>
                <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                    {infoFields.map((field, index) => (
                        <Grid
                            size={{ xs: 12, sm: 6, md: 2.4 }}
                            key={index}
                            sx={itemSx}
                        >
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {field.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight="600"
                                    color={
                                        index === 0 ? "primary" : "text.primary"
                                    }
                                >
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
            <Tabs
                value={activeTab}
                onChange={onTabChange}
                variant="fullWidth"
                sx={(theme) => ({
                    "& .MuiTabs-indicator": {
                        backgroundColor: theme.palette.secondary.main,
                        height: 3,
                    },
                    "& .MuiTab-root": {
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        "&.Mui-selected": { color: theme.palette.secondary.main },
                    },
                })}
            >
                {tabConfigs.map((t) => (
                    <Tab
                        key={t.label}
                        icon={t.icon}
                        iconPosition="start"
                        label={t.label}
                    />
                ))}
            </Tabs>
        </Box>
    );
}

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`health-check-tabpanel-${index}`}
            {...other}
        >
            <Box sx={{ pt: 1, display: value !== index ? "none" : undefined }}>
                {children}
            </Box>
        </div>
    );
}

export default function KhamSucKhoeForm({
    open,
    onClose,
    onSaved,
    quanNhan,
    existingPhieu,
    unitLookup,
    nam,
    readOnly = false,
}) {
    const {
        activeTab,
        setActiveTab,
        ngayNhapNgu,
        saving,
        error,
        tsRef,
        lsRef,
        clsRef,
        klRef,
        initialTS,
        initialLS,
        initialCLS,
        initialKL,
        handleSubmit,
    } = useKhamSucKhoeForm({
        open,
        quanNhan,
        existingPhieu,
        nam,
        onSaved,
        onClose,
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            slotProps={{ paper: { sx: { bgcolor: (theme) => theme.palette.background.default } } }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <FormHeader quanNhan={quanNhan} />

                <DialogContent sx={{ mt: 2, px: 3 }}>
                    {error && (
                        <Typography
                            color="error"
                            variant="body2"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Typography>
                    )}

                    <FormInfoCard
                        quanNhan={quanNhan}
                        ngayNhapNgu={ngayNhapNgu}
                        unitLookup={unitLookup}
                    />

                    <FormTabBar
                        activeTab={activeTab}
                        onTabChange={(_, val) => setActiveTab(val)}
                    />

                    <TabPanel value={activeTab} index={0}>
                        <TienSuTab
                            ref={tsRef}
                            initialData={initialTS}
                            cardStyle={cardStyle}
                            readOnly={readOnly}
                        />
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <LamSangTab
                            ref={lsRef}
                            initialData={initialLS}
                            cardStyle={cardStyle}
                            readOnly={readOnly}
                        />
                    </TabPanel>
                    <TabPanel value={activeTab} index={2}>
                        <CanLamSangTab
                            ref={clsRef}
                            initialData={initialCLS}
                            cardStyle={cardStyle}
                            readOnly={readOnly}
                        />
                    </TabPanel>
                    <TabPanel value={activeTab} index={3}>
                        <KetLuanTab
                            ref={klRef}
                            initialData={initialKL}
                            cardStyle={cardStyle}
                            readOnly={readOnly}
                        />
                    </TabPanel>
                </DialogContent>

                <DialogActions
                    sx={{
                        pt: 1.5,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="inherit"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={saving || readOnly}
                    >
                        {readOnly
                            ? "Đã xem"
                            : saving
                              ? "Đang lưu..."
                              : "Lưu phiếu khám"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
