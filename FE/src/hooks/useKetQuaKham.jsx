import { useState, useEffect, useCallback, useMemo } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import { fetchAllPages } from "@/utils/fetchAll.js";

const PHAN_LOAI_LABELS = ["Loại 1", "Loại 2", "Loại 3", "Loại 4", "Loại 5"];

function countBy(arr, keyFn) {
    const map = {};
    arr.forEach((item) => {
        const k = keyFn(item);
        map[k] = (map[k] || 0) + 1;
    });
    return map;
}

function avg(values) {
    const nums = values.filter((v) => v !== "" && v !== null && v !== undefined).map(Number);
    if (nums.length === 0) return null;
    return nums.reduce((s, v) => s + v, 0) / nums.length;
}

function parseJsonField(val) {
    if (!val) return {};
    if (typeof val === "object") return val;
    try {
        return JSON.parse(val);
    } catch {
        return {};
    }
}

export default function useKetQuaKham() {
    const [nam, setNam] = useState("Tất cả");
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [soldiers, setSoldiers] = useState([]);
    const [phieuMap, setPhieuMap] = useState({});
    const [stats, setStats] = useState(null);

    useEffect(() => {
        khamSucKhoeService.getScheduleList().then((res) => {
            const list = res.data || res;
            setSchedules(list);
        }).catch(() => {});
    }, []);

    const yearOptions = useMemo(() => {
        const years = new Set();
        schedules.forEach((s) => {
            const y = new Date(s.thoi_gian_bat_dau).getFullYear();
            if (!isNaN(y)) years.add(y);
        });
        return ["Tất cả", ...Array.from(years).sort()];
    }, [schedules]);

    const filteredSchedules = useMemo(() => {
        if (nam === "Tất cả") return schedules;
        return schedules.filter((s) => new Date(s.thoi_gian_bat_dau).getFullYear() === Number(nam));
    }, [schedules, nam]);

    useEffect(() => {
        if (filteredSchedules.length > 0) {
            setSelectedSchedule((prev) => {
                if (prev && filteredSchedules.some((s) => s.ma_lich_kham === prev)) return prev;
                return filteredSchedules[0].ma_lich_kham;
            });
        } else {
            setSelectedSchedule(null);
        }
    }, [filteredSchedules]);

    const scheduleId = useMemo(() => {
        if (filteredSchedules.length === 0) return "";
        if (selectedSchedule && filteredSchedules.some((s) => s.ma_lich_kham === selectedSchedule))
            return selectedSchedule;
        return filteredSchedules[0]?.ma_lich_kham || "";
    }, [filteredSchedules, selectedSchedule]);

    const fetchData = useCallback(async (id) => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const [soldiersData, phieuData, statsRes] = await Promise.all([
                fetchAllPages(`/quan_nhan/lich-kham/${id}`),
                fetchAllPages(`/phieu_kham_suc_khoe/lich-kham/${id}`),
                khamSucKhoeService.getScheduleStats(id),
            ]);
            const statsData = statsRes.data || statsRes;

            const phieuMapData = {};
            phieuData.forEach((p) => {
                phieuMapData[p.ma_quan_nhan] = {
                    ...p,
                    tong_quan: parseJsonField(p.tong_quan),
                    kham_lam_sang: parseJsonField(p.kham_lam_sang),
                    xet_nghiem: parseJsonField(p.xet_nghiem),
                    chan_doan_hinh_anh: parseJsonField(p.chan_doan_hinh_anh),
                    ket_luan: parseJsonField(p.ket_luan),
                };
            });

            setSoldiers(soldiersData);
            setPhieuMap(phieuMapData);
            setStats(statsData);
        } catch (err) {
            setError(err.response?.data?.detail || "Lỗi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(scheduleId);
    }, [scheduleId, fetchData]);

    const daKhamPhieu = useMemo(() => {
        return Object.values(phieuMap).filter((p) => p.trang_thai === "da_kham");
    }, [phieuMap]);

    const tienDo = useMemo(() => {
        const total = soldiers.length;
        const countDaKham = Object.values(phieuMap).filter((p) => p.trang_thai === "da_kham").length;
        const countDangKham = Object.values(phieuMap).filter((p) => p.trang_thai === "dang_kham").length;
        const conLai = total - countDaKham - countDangKham;
        return [
            { name: "Đã khám", value: countDaKham, color: "#10B981" },
            { name: "Đang khám", value: countDangKham, color: "#F59E0B" },
            { name: "Chưa khám", value: conLai, color: "#94A3B8" },
        ];
    }, [soldiers, phieuMap]);

    const phanBoPhanLoai = useMemo(() => {
        const counts = {};
        PHAN_LOAI_LABELS.forEach((l) => (counts[l] = 0));
        daKhamPhieu.forEach((p) => {
            const kl = p.ket_luan || {};
            const loai = kl.phan_loai_suc_khoe || "Loại 1";
            if (counts[loai] !== undefined) counts[loai]++;
        });
        const total = daKhamPhieu.length || 1;
        return PHAN_LOAI_LABELS.map((l, i) => ({
            name: l,
            value: counts[l],
            ty_le: ((counts[l] / total) * 100).toFixed(1),
            color: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"][i],
        }));
    }, [daKhamPhieu]);

    const theLucTrungBinh = useMemo(() => {
        const tqList = daKhamPhieu.map((p) => p.tong_quan || {});
        return {
            chieu_cao: avg(tqList.map((t) => t.chieu_cao)),
            can_nang: avg(tqList.map((t) => t.can_nang)),
            bmi: avg(tqList.map((t) => t.bmi)),
            mach: avg(tqList.map((t) => t.mach)),
            huyet_ap_tam_thu: avg(tqList.map((t) => t.huyet_ap_tam_thu)),
            huyet_ap_tam_truong: avg(tqList.map((t) => t.huyet_ap_tam_truong)),
        };
    }, [daKhamPhieu]);

    const XN_FIELDS = [
        { key: "hong_cau", label: "Hồng cầu", unit: "T/L", normalRange: [3.8, 5.8] },
        { key: "bach_cau", label: "Bạch cầu", unit: "G/L", normalRange: [4, 10] },
        { key: "tieu_cau", label: "Tiểu cầu", unit: "G/L", normalRange: [150, 400] },
        { key: "glucose_mau", label: "Glucose máu", unit: "mmol/L", normalRange: [3.9, 6.4] },
        { key: "ure", label: "Urê", unit: "mmol/L", normalRange: [2.5, 7.5] },
        { key: "creatinin", label: "Creatinin", unit: "μmol/L", normalRange: [62, 120] },
        { key: "ast", label: "AST", unit: "U/L", normalRange: [0, 40] },
        { key: "alt", label: "ALT", unit: "U/L", normalRange: [0, 40] },
    ];

    const xetNghiemTrungBinh = useMemo(() => {
        const xnList = daKhamPhieu.map((p) => p.xet_nghiem || {});
        return XN_FIELDS.map((f) => ({
            ...f,
            avgValue: avg(xnList.map((x) => x[f.key])),
        }));
    }, [daKhamPhieu]);

    const benhTat = useMemo(() => {
        const diseaseMap = {};
        daKhamPhieu.forEach((p) => {
            const kl = p.ket_luan || {};
            const benh = kl.benh_tat_theo_doi;
            if (benh && typeof benh === "string") {
                benh.split(",").forEach((b) => {
                    const trimmed = b.trim();
                    if (trimmed) diseaseMap[trimmed] = (diseaseMap[trimmed] || 0) + 1;
                });
            }
        });
        return Object.entries(diseaseMap)
            .map(([ten, so_luong]) => ({ ten, so_luong }))
            .sort((a, b) => b.so_luong - a.so_luong)
            .slice(0, 10);
    }, [daKhamPhieu]);

    const lamSangBatThuong = useMemo(() => {
        const fields = [
            { key: "tim_mach_loai", label: "Tim mạch" },
            { key: "ho_hap_loai", label: "Hô hấp" },
            { key: "tieu_hoa_loai", label: "Tiêu hóa" },
            { key: "than_tiet_nieu_sinh_duc_nam_loai", label: "Thận tiết niệu - SD Nam" },
            { key: "tam_than_than_kinh_loai", label: "Tâm thần - Thần kinh" },
            { key: "co_xuong_khop_loai", label: "Cơ xương khớp" },
            { key: "noi_tiet_chuyen_hoa_mien_dich_loai", label: "Nội tiết - Chuyển hóa" },
            { key: "benh_mau_loai", label: "Bệnh máu" },
            { key: "ngoai_khoa_loai", label: "Ngoại khoa" },
            { key: "da_lieu_loai", label: "Da liễu" },
            { key: "phu_san_loai", label: "Phụ sản" },
            { key: "tai_mui_hong_loai", label: "Tai Mũi Họng" },
            { key: "rang_ham_mat_loai", label: "Răng Hàm Mặt" },
        ];
        const counts = {};
        fields.forEach((f) => (counts[f.label] = 0));
        daKhamPhieu.forEach((p) => {
            const ls = p.kham_lam_sang || {};
            fields.forEach((f) => {
                if (ls[f.key] && ls[f.key] !== "Loại 1") counts[f.label]++;
            });
        });
        return Object.entries(counts)
            .filter(([, v]) => v > 0)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);
    }, [daKhamPhieu]);

    const donViData = useMemo(() => {
        const dvList = stats?.danh_sach_don_vi || [];
        return dvList.map((dv) => {
            const total = dv.tong_quan_so || 0;
            const daK = dv.da_kham || 0;
            return {
                ...dv,
                ty_le_da_kham: total ? ((daK / total) * 100).toFixed(1) : "0",
            };
        });
    }, [stats]);

    return {
        nam, setNam,
        schedules: filteredSchedules,
        yearOptions,
        selectedSchedule,
        setSelectedSchedule,
        scheduleId,
        loading,
        error,
        fetchData,
        soldiers,
        phieuMap,
        stats,
        tienDo,
        phanBoPhanLoai,
        theLucTrungBinh,
        xetNghiemTrungBinh,
        benhTat,
        lamSangBatThuong,
        donViData,
        XN_FIELDS,
    };
}
