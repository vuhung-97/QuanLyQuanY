import { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Tabs,
    Tab,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import BiotechIcon from "@mui/icons-material/Biotech";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import api from "../../services/api.js";
import TienSuTab from "./tabs/TienSuTab";
import LamSangTab from "./tabs/LamSangTab";
import CanLamSangTab from "./tabs/CanLamSangTab";
import KetLuanTab from "./tabs/KetLuanTab";
import HeaderCard from "./HeaderCardHealthCheckForm.jsx";

const DEFAULT_TS = { ban_than: "", gia_dinh: "", di_ung: "", khac: "" };

const DEFAULT_LS = {
    chieu_cao: "", can_nang: "", vong_nguc: "",
    mach: "", huyet_ap_tam_thu: "", huyet_ap_tam_truong: "", bmi: "",
    tim_mach_note: "", tim_mach_loai: "Loại 1",
    ho_hap_note: "", ho_hap_loai: "Loại 1",
    tieu_hoa_note: "", tieu_hoa_loai: "Loại 1",
    than_tiet_nieu_sinh_duc_nam_note: "", than_tiet_nieu_sinh_duc_nam_loai: "Loại 1",
    tam_than_than_kinh_note: "", tam_than_than_kinh_loai: "Loại 1",
    co_xuong_khop_note: "", co_xuong_khop_loai: "Loại 1",
    noi_tiet_chuyen_hoa_mien_dich_note: "", noi_tiet_chuyen_hoa_mien_dich_loai: "Loại 1",
    benh_mau_note: "", benh_mau_loai: "Loại 1",
    ngoai_khoa_note: "", ngoai_khoa_loai: "Loại 1",
    da_lieu_note: "", da_lieu_loai: "Loại 1",
    phu_san_note: "", phu_san_loai: "Loại 1",
    tai_mui_hong_note: "", tai_mui_hong_loai: "Loại 1",
    rang_ham_mat_note: "", rang_ham_mat_loai: "Loại 1",
    mat_khong_kinh_trai: "", mat_khong_kinh_phai: "",
    mat_co_kinh_trai: "", mat_co_kinh_phai: "",
    mat_loai: "Loại 1",
    khac: "",
};

const DEFAULT_CLS = {
    hong_cau: "", bach_cau: "", tieu_cau: "",
    glucose_mau: "", ure: "", creatinin: "", ast: "", alt: "",
    nuoc_tieu_glucose: "", nuoc_tieu_protein: "", nuoc_tieu_te_bao: "",
    dien_tim: "", x_quang: "", sieu_am: "", khac: "",
};

const DEFAULT_KL = {
    phan_loai_suc_khoe: "Loại 1",
    ly_do: "",
    benh_tat_theo_doi: "",
    chi_dan_khac: "",
};

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

const parseTienSu = (str) => {
    if (!str) return { ...DEFAULT_TS };
    try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === "object") {
            return { ...DEFAULT_TS, ...parsed };
        }
    } catch (e) {
        return { ...DEFAULT_TS, ban_than: str };
    }
    return { ...DEFAULT_TS };
};

const parseLamSang = (str) => {
    if (!str) return { ...DEFAULT_LS };
    try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === "object") {
            const mapped = { ...DEFAULT_LS, ...parsed };
            Object.keys(DEFAULT_LS)
                .filter((k) => k.endsWith("_loai"))
                .forEach((k) => {
                    if (!mapped[k]) mapped[k] = "Loại 1";
                });
            if (parsed.tuan_hoan && !parsed.tim_mach_note)
                mapped.tim_mach_note = parsed.tuan_hoan;
            if (parsed.ho_hap && !parsed.ho_hap_note)
                mapped.ho_hap_note = parsed.ho_hap;
            if (parsed.tieu_hoa && !parsed.tieu_hoa_note)
                mapped.tieu_hoa_note = parsed.tieu_hoa;
            if (parsed.than_tiet_nieu && !parsed.than_tiet_nieu_sinh_duc_nam_note)
                mapped.than_tiet_nieu_sinh_duc_nam_note = parsed.than_tiet_nieu;
            if (parsed.than_kinh_tam_than && !parsed.tam_than_than_kinh_note)
                mapped.tam_than_than_kinh_note = parsed.than_kinh_tam_than;
            if (parsed.co_xuong_khop && !parsed.co_xuong_khop_note)
                mapped.co_xuong_khop_note = parsed.co_xuong_khop;
            if (parsed.tai_mui_hong && !parsed.tai_mui_hong_note)
                mapped.tai_mui_hong_note = parsed.tai_mui_hong;
            if (parsed.rang_ham_mat && !parsed.rang_ham_mat_note)
                mapped.rang_ham_mat_note = parsed.rang_ham_mat;
            if (parsed.mat && !parsed.mat_loai) mapped.mat_loai = parsed.mat;
            return mapped;
        }
    } catch (e) {
        return { ...DEFAULT_LS, khac: str };
    }
    return { ...DEFAULT_LS };
};

const parseCanLamSang = (str) => {
    if (!str) return { ...DEFAULT_CLS };
    try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === "object") {
            const mapped = { ...DEFAULT_CLS, ...parsed };
            if (parsed.cong_thuc_mau && !parsed.hong_cau)
                mapped.hong_cau = parsed.cong_thuc_mau;
            if (parsed.sinh_hoa_mau && !parsed.glucose_mau)
                mapped.glucose_mau = parsed.sinh_hoa_mau;
            if (parsed.nuoc_tieu && !parsed.nuoc_tieu_protein)
                mapped.nuoc_tieu_protein = parsed.nuoc_tieu;
            if (parsed.sieu_am_o_bung && !parsed.sieu_am)
                mapped.sieu_am = parsed.sieu_am_o_bung;
            if (parsed.x_quang_tim_phoi && !parsed.x_quang)
                mapped.x_quang = parsed.x_quang_tim_phoi;
            return mapped;
        }
    } catch (e) {
        return { ...DEFAULT_CLS, khac: str };
    }
    return { ...DEFAULT_CLS };
};

const parseKetLuan = (str) => {
    if (!str) return { ...DEFAULT_KL };
    try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === "object") {
            const mapped = { ...DEFAULT_KL, ...parsed };
            if (parsed.cac_benh_chinh && !parsed.benh_tat_theo_doi)
                mapped.benh_tat_theo_doi = parsed.cac_benh_chinh;
            if (parsed.danh_gia_chung && !parsed.ly_do)
                mapped.ly_do = parsed.danh_gia_chung;
            return mapped;
        }
    } catch (e) {
        return { ...DEFAULT_KL, benh_tat_theo_doi: str };
    }
    return { ...DEFAULT_KL };
};

const cardStyle = {
    borderRadius: 2,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid",
    borderColor: "divider",
    mb: 3,
    bgcolor: "background.paper",
};

export default function HealthCheckForm({
    open,
    onClose,
    onSaved,
    quanNhan,
    existingPhieu,
    unitLookup,
    nam,
}) {
    const [activeTab, setActiveTab] = useState(0);
    const [ngayNhapNgu, setNgayNhapNgu] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [ts, setTs] = useState({ ...DEFAULT_TS });
    const [ls, setLs] = useState({ ...DEFAULT_LS });
    const [cls, setCls] = useState({ ...DEFAULT_CLS });
    const [kl, setKl] = useState({ ...DEFAULT_KL });

    const isEdit = Boolean(existingPhieu);

    useEffect(() => {
        if (open && quanNhan) {
            setNgayNhapNgu(quanNhan.ngay_nhap_ngu || "");
            if (existingPhieu) {
                setTs(parseTienSu(existingPhieu.tien_su_benh_tat));
                setLs(parseLamSang(existingPhieu.kham_lam_sang));
                setCls(parseCanLamSang(existingPhieu.kham_can_lam_sang));
                setKl(parseKetLuan(existingPhieu.ket_luan));
            } else {
                setTs({ ...DEFAULT_TS });
                setLs({ ...DEFAULT_LS });
                setCls({ ...DEFAULT_CLS });
                setKl({ ...DEFAULT_KL });
            }
            setError("");
            setActiveTab(0);
        }
    }, [open, quanNhan, existingPhieu]);

    const handleTsChange = useCallback((e) => {
        const { name, value } = e.target;
        setTs((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleLsChange = useCallback((e) => {
        const { name, value } = e.target;
        setLs((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "chieu_cao" || name === "can_nang") {
                const h = parseFloat(
                    name === "chieu_cao" ? value : prev.chieu_cao,
                );
                const w = parseFloat(
                    name === "can_nang" ? value : prev.can_nang,
                );
                if (h > 0 && w > 0) {
                    updated.bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
                } else {
                    updated.bmi = "";
                }
            }
            return updated;
        });
    }, []);

    const handleClsChange = useCallback((e) => {
        const { name, value } = e.target;
        setCls((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleKlChange = useCallback((e) => {
        const { name, value } = e.target;
        setKl((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const phieuData = {
                ma_quan_nhan: quanNhan.ma_quan_nhan,
                nam: nam || null,
                tien_su_benh_tat: JSON.stringify(ts),
                kham_lam_sang: JSON.stringify(ls),
                kham_can_lam_sang: JSON.stringify(cls),
                ket_luan: Object.values(kl).some(v => v && v !== "Loại 1") ? JSON.stringify(kl) : "",
            };

            let saved;
            if (isEdit) {
                saved = await api.patch(
                    `/phieu_kham_suc_khoe/${existingPhieu.ma_phieu_kham}`,
                    phieuData,
                );
            } else {
                saved = await api.post("/phieu_kham_suc_khoe", phieuData);
            }
            onSaved(saved.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || "Không thể lưu phiếu khám.");
        } finally {
            setSaving(false);
        }
    };

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
                        color="#0B3B60"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        Phiếu khám sức khỏe định kỳ (MB02)
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="600"
                    >
                        {quanNhan?.ho_ten} ({quanNhan?.ma_quan_nhan})
                    </Typography>
                </DialogTitle>

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

                    <HeaderCard
                        quanNhan={quanNhan}
                        ngayNhapNgu={ngayNhapNgu}
                        cardStyle={cardStyle}
                        unitLookup={unitLookup}
                    />

                    <Box
                        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={(_, val) => setActiveTab(val)}
                            variant="fullWidth"
                            sx={{
                                "& .MuiTabs-indicator": {
                                    backgroundColor: "#00B4D8",
                                    height: 3,
                                },
                                "& .MuiTab-root": {
                                    color: "#0B3B60",
                                    fontWeight: "bold",
                                    "&.Mui-selected": {
                                        color: "#00B4D8",
                                    },
                                },
                            }}
                        >
                            <Tab
                                icon={<HistoryIcon />}
                                iconPosition="start"
                                label="Tiền sử"
                            />
                            <Tab
                                icon={<MonitorHeartIcon />}
                                iconPosition="start"
                                label="Lâm sàng"
                            />
                            <Tab
                                icon={<BiotechIcon />}
                                iconPosition="start"
                                label="Cận lâm sàng"
                            />
                            <Tab
                                icon={<AssignmentTurnedInIcon />}
                                iconPosition="start"
                                label="Kết luận"
                            />
                        </Tabs>
                    </Box>

                    <TabPanel value={activeTab} index={0}>
                        <TienSuTab
                            ts={ts}
                            onTsChange={handleTsChange}
                            cardStyle={cardStyle}
                        />
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <LamSangTab
                            ls={ls}
                            onLsChange={handleLsChange}
                            cardStyle={cardStyle}
                        />
                    </TabPanel>
                    <TabPanel value={activeTab} index={2}>
                        <CanLamSangTab
                            cls={cls}
                            onClsChange={handleClsChange}
                            cardStyle={cardStyle}
                        />
                    </TabPanel>
                    <TabPanel value={activeTab} index={3}>
                        <KetLuanTab
                            kl={kl}
                            onKlChange={handleKlChange}
                            cardStyle={cardStyle}
                        />
                    </TabPanel>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
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
                        disabled={saving}
                    >
                        {saving ? "Đang lưu..." : "Lưu phiếu khám"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
