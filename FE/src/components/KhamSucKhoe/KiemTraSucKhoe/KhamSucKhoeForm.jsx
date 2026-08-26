import { useMemo } from "react";
import {
    Box,
    Button,
    CircularProgress,
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
import FeedbackSnackbar from "@/components/common/FeedbackSnackbar.jsx";
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
    const idx = allowedTabs.indexOf(activeTab);
    const value = idx === -1 ? 0 : idx;
    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
                value={value}
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
    initialTab,
}) {
    const allowedTabs = allowedTabsProp ?? ALL_TABS;
    const editableTabs = editableTabsProp ?? ALL_TABS;
    const {
        activeTab,
        setActiveTab,
        ngayNhapNgu,
        saving,
        loadingPhieu,
        currentPhieu,
        snackbar,
        handleCloseSnackbar,
        errors,
        tsRef,
        lsRef,
        xnRef,
        cdhaRef,
        klRef,
        initialTS,
        initialLS,
        initialXN,
        initialXNPhanLoai,
        initialCDHA,
        initialKL,
        klVersion,
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
        initialTab,
    });

    const examYear =
        nam || currentPhieu?.nam || new Date().getFullYear();

    const cardData = useMemo(
        () => ({
            ...quanNhan,
            ten_don_vi:
                unitLookup?.get(quanNhan?.ma_don_vi) ||
                quanNhan?.ma_don_vi ||
                undefined,
            ma_lay_mau: currentPhieu?.ma_lay_mau,
        }),
        [quanNhan, unitLookup, currentPhieu],
    );

    const tabPanels = [
        {
            index: 0,
            Component: TongQuanTab,
            tabRef: tsRef,
            initialData: initialTS,
            gioiTinh: quanNhan?.gioi_tinh,
        },
        { index: 1, Component: LamSangTab, tabRef: lsRef, initialData: initialLS },
        {
            index: 2,
            Component: XetNghiemTab,
            tabRef: xnRef,
            initialData: initialXN,
            phanLoai: initialXNPhanLoai,
        },
        {
            index: 3,
            Component: ChanDoanHinhAnhTab,
            tabRef: cdhaRef,
            initialData: initialCDHA,
            nam: examYear,
        },
        {
            index: 4,
            Component: KetLuanTab,
            tabRef: klRef,
            initialData: initialKL,
            innerKey: klVersion,
        },
    ];

    return (
        <>
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
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden", // Ngăn form tràn ra ngoài làm xuất hiện scrollbar ở Dialog container
                    }}
                >
                    <FormHeader quanNhan={quanNhan} />

                    <DialogContent dividers sx={{ px: 3 }}>
                        <PatientInfoCard
                            data={cardData}
                            fields={CARD_FIELDS}
                            columnsPerRow={6}
                        />

                        {loadingPhieu ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    py: 10,
                                    gap: 2,
                                }}
                            >
                                <CircularProgress />
                                <Typography color="text.secondary">
                                    Đang tải dữ liệu phiếu khám mới nhất...
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <FormTabBar
                                    activeTab={activeTab}
                                    onTabChange={(_, val) =>
                                        setActiveTab(val)
                                    }
                                    allowedTabs={allowedTabs}
                                />

                                {tabPanels.map(
                                    ({
                                        index,
                                        Component,
                                        tabRef,
                                        initialData,
                                        gioiTinh,
                                        innerKey,
                                        phanLoai,
                                        nam: cdhaNam,
                                    }) =>
                                        allowedTabs.includes(index) && (
                                            <TabPanel
                                                key={index}
                                                value={activeTab}
                                                index={index}
                                            >
                                                <Component
                                                    key={`${innerKey || 0}`}
                                                    ref={tabRef}
                                                    initialData={initialData}
                                                    cardStyle={cardStyle}
                                                    readOnly={
                                                        readOnly ||
                                                        !editableTabs.includes(
                                                            index,
                                                        )
                                                    }
                                                    {...(index === 0 ? { errors } : {})}
                                                    {...(gioiTinh !== undefined
                                                        ? { gioiTinh }
                                                        : {})}
                                                    {...(phanLoai !== undefined
                                                        ? { phanLoai }
                                                        : {})}
                                                    {...(cdhaNam !== undefined
                                                        ? { nam: cdhaNam }
                                                        : {})}
                                                />
                                            </TabPanel>
                                        ),
                                )}
                            </>
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
                            disabled={saving || readOnly || loadingPhieu}
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

            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </>
    );
}
