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
import {
    Biotech as BiotechIcon,
    DocumentScanner as DocumentScannerIcon,
} from "@mui/icons-material";
import HistoryIcon from "@mui/icons-material/History";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import useKhamSucKhoeForm from "@/hooks/useKhamSucKhoeForm";
import {
    ALL_TABS,
    cardStyle,
    ROLE_TAB_ACCESS,
} from "@/constants/khamSucKhoeConstants.js";
import TongQuanTab from "./tabs/TongQuanTab";
import LamSangTab from "./tabs/LamSangTab";
import XetNghiemTab from "./tabs/XetNghiemTab";
import ChanDoanHinhAnhTab from "./tabs/ChanDoanHinhAnhTab";
import KetLuanTab from "./tabs/KetLuanTab";

function FormHeader({ quanNhan }) {
    return (
        <DialogTitle
            component="div"
            sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                textAlign: "center",
            }}
        >
            <Typography
                fontWeight="bold"
                color="primary"
                sx={{
                    fontSize: 20,
                    fontWeight: 700,
                    textAlign: "center",
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

function FormInfoCard({
    quanNhan,
    ngayNhapNgu,
    phieu,
    unitLookup = new Map(),
}) {
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
        { label: "Mã lấy máu", value: phieu?.ma_lay_mau || "—" },
    ];
    return (
        <Box sx={{ ...cardStyle, mb: 3 }}>
            <Box sx={{ py: 2, px: 3 }}>
                <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                    {infoFields.map((field, index) => (
                        <Grid
                            size={{ xs: 12, sm: 6, md: 2 }}
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
    { icon: <HistoryIcon />, label: "Tổng quan" },
    { icon: <MonitorHeartIcon />, label: "Lâm sàng" },
    { icon: <BiotechIcon />, label: "Xét nghiệm" },
    { icon: <DocumentScannerIcon />, label: "Chẩn đoán hình ảnh" },
    { icon: <AssignmentTurnedInIcon />, label: "Kết luận" },
];

function FormTabBar({ activeTab, onTabChange, allowedTabs }) {
    const filtered = tabConfigs.filter((_, i) => allowedTabs.includes(i));
    const handleChange = (_, filteredIdx) =>
        onTabChange(_, allowedTabs[filteredIdx]);
    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
                value={allowedTabs.indexOf(activeTab)}
                onChange={handleChange}
                variant="fullWidth"
                sx={(theme) => ({
                    "& .MuiTabs-indicator": {
                        backgroundColor: theme.palette.secondary.main,
                        height: 3,
                    },
                    "& .MuiTab-root": {
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        "&.Mui-selected": {
                            color: theme.palette.secondary.main,
                        },
                    },
                })}
            >
                {filtered.map((t) => (
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
    maLichKham,
    nam,
    readOnly = false,
    allowedTabs: allowedTabsProp,
    editableTabs: editableTabsProp,
}) {
    const allowedTabs = allowedTabsProp ?? ALL_TABS;
    const editableTabs = editableTabsProp ?? ALL_TABS;
    const {
        activeTab,
        setActiveTab,
        ngayNhapNgu,
        saving,
        error,
        tsRef,
        lsRef,
        xnRef,
        cdhaRef,
        klRef,
        initialTS,
        initialLS,
        initialXN,
        initialCDHA,
        initialKL,
        handleSubmit,
    } = useKhamSucKhoeForm({
        open,
        quanNhan,
        existingPhieu,
        maLichKham,
        nam,
        onSaved,
        onClose,
        allowedTabs,
        editableTabs,
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: (theme) => theme.palette.background.default,
                    },
                },
            }}
            sx={{ "& .MuiDialog-paper": { height: "90vh" } }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <FormHeader quanNhan={quanNhan} />

                <DialogContent dividers sx={{ mt: 2, px: 3 }}>
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
                        phieu={existingPhieu}
                        unitLookup={unitLookup}
                    />

                    <FormTabBar
                        activeTab={activeTab}
                        onTabChange={(_, val) => setActiveTab(val)}
                        allowedTabs={allowedTabs}
                    />

                    {allowedTabs.includes(0) && (
                        <TabPanel value={activeTab} index={0}>
                            <TongQuanTab
                                ref={tsRef}
                                initialData={initialTS}
                                cardStyle={cardStyle}
                                readOnly={readOnly || !editableTabs.includes(0)}
                            />
                        </TabPanel>
                    )}
                    {allowedTabs.includes(1) && (
                        <TabPanel value={activeTab} index={1}>
                            <LamSangTab
                                ref={lsRef}
                                initialData={initialLS}
                                cardStyle={cardStyle}
                                readOnly={readOnly || !editableTabs.includes(1)}
                            />
                        </TabPanel>
                    )}
                    {allowedTabs.includes(2) && (
                        <TabPanel value={activeTab} index={2}>
                            <XetNghiemTab
                                ref={xnRef}
                                initialData={initialXN}
                                cardStyle={cardStyle}
                                readOnly={readOnly || !editableTabs.includes(2)}
                            />
                        </TabPanel>
                    )}
                    {allowedTabs.includes(3) && (
                        <TabPanel value={activeTab} index={3}>
                            <ChanDoanHinhAnhTab
                                ref={cdhaRef}
                                initialData={initialCDHA}
                                cardStyle={cardStyle}
                                readOnly={readOnly || !editableTabs.includes(3)}
                            />
                        </TabPanel>
                    )}
                    {allowedTabs.includes(4) && (
                        <TabPanel value={activeTab} index={4}>
                            <KetLuanTab
                                ref={klRef}
                                initialData={initialKL}
                                cardStyle={cardStyle}
                                readOnly={readOnly || !editableTabs.includes(4)}
                            />
                        </TabPanel>
                    )}
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
