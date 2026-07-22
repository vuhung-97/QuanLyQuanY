import { useMemo } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
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
import { ALL_TABS, cardStyle } from "@/constants/khamSucKhoeConstants.js";
import TongQuanTab from "./tabs/TongQuanTab";
import LamSangTab from "./tabs/LamSangTab";
import XetNghiemTab from "./tabs/XetNghiemTab";
import ChanDoanHinhAnhTab from "./tabs/ChanDoanHinhAnhTab";
import DialogTitleWrapper from "@/components/common/DialogTitleWrapper";
import PatientInfoCard from "@/components/common/PatientInfoCard";
import KetLuanTab from "./tabs/KetLuanTab";

function FormHeader({ quanNhan }) {
    return <DialogTitleWrapper>Phiếu khám sức khỏe định kỳ</DialogTitleWrapper>;
}

const CARD_FIELDS = [
    "ho_ten",
    "ma_quan_nhan",
    "ten_don_vi",
    "cap_bac",
    "chuc_vu",
    "ngay_sinh",
    "gioi_tinh",
    "ngay_nhap_ngu",
    "ma_lay_mau",
];

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
                        variant="h4"
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

    const cardData = useMemo(
        () => ({
            ...quanNhan,
            ten_don_vi:
                unitLookup?.get(quanNhan?.ma_don_vi) ||
                quanNhan?.ma_don_vi ||
                undefined,
            ma_lay_mau: existingPhieu?.ma_lay_mau,
        }),
        [quanNhan, unitLookup, existingPhieu],
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: (theme) => theme.palette.background.paper,
                    },
                },
            }}
            sx={{ "& .MuiDialog-paper": { height: "90vh" } }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <FormHeader quanNhan={quanNhan} />

                <DialogContent dividers sx={{ px: 3 }}>
                    {error && (
                        <Typography
                            color="error"
                            variant="body2"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Typography>
                    )}

                    <PatientInfoCard
                        data={cardData}
                        fields={CARD_FIELDS}
                        columnsPerRow={6}
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
                                gioiTinh={quanNhan?.gioi_tinh}
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
                        p: 2,
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
