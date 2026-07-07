export function getScheduleStatus(row) {
    const now = new Date();
    const start = row.thoi_gian_bat_dau
        ? new Date(row.thoi_gian_bat_dau)
        : null;
    const end = row.thoi_gian_ket_thuc
        ? new Date(row.thoi_gian_ket_thuc)
        : null;
    if (end && end < now) return "Đã kết thúc";
    if (start && start > now) return "Sắp diễn ra";
    return "Đang thực hiện";
}

export function statusColor(status) {
    if (status === "Đã kết thúc")
        return { bgcolor: "rgba(16, 185, 129, 0.12)", color: "success.main" };
    if (status === "Sắp diễn ra")
        return { bgcolor: "rgba(0, 180, 216, 0.12)", color: "secondary.main" };
    return { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" };
}

export function getPhanLoai(phieu) {
    if (!phieu?.ket_luan) return "";
    try {
        const parsed = JSON.parse(phieu.ket_luan);
        return parsed.phan_loai_suc_khoe || "";
    } catch {
        return "";
    }
}

export function findNearestDetail(details) {
    if (!details || details.length === 0) return null;
    const now = new Date();
    let nearest = null;
    let minDiff = Infinity;
    for (const d of details) {
        if (!d.thoi_gian_bat_dau) continue;
        const diff = Math.abs(new Date(d.thoi_gian_bat_dau) - now);
        if (diff < minDiff) {
            minDiff = diff;
            nearest = d;
        }
    }
    return nearest;
}

import {
    DEFAULT_TS, DEFAULT_LS, DEFAULT_XN, DEFAULT_CDHA, DEFAULT_KL,
    DEFAULT_PHAN_LOAI, TRANG_THAI_LABEL,
} from "@/constants/khamSucKhoeConstants.js";

export function getStatus(phieu) {
    if (!phieu) return "Chưa khám";
    return TRANG_THAI_LABEL[phieu.trang_thai] || "Chưa khám";
}

function parseWithDefault(str, defaultObj, fallbackKey) {
    if (!str) return { ...defaultObj };
    try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === "object") {
            const mapped = { ...defaultObj, ...parsed };
            Object.keys(defaultObj)
                .filter((k) => k.endsWith("_loai"))
                .forEach((k) => {
                    if (!mapped[k]) mapped[k] = DEFAULT_PHAN_LOAI;
                });
            return mapped;
        }
    } catch {}
    return { ...defaultObj };
}

export const parseTienSu = (str) =>
    parseWithDefault(str, DEFAULT_TS, "ban_than");
export const parseLamSang = (str) => parseWithDefault(str, DEFAULT_LS, "khac");
export const parseXetNghiem = (str) =>
    parseWithDefault(str, DEFAULT_XN, "nuoc_tieu_te_bao");
export const parseChanDoanHinhAnh = (str) =>
    parseWithDefault(str, DEFAULT_CDHA, "khac");
export const parseKetLuan = (str) =>
    parseWithDefault(str, DEFAULT_KL, "benh_tat_theo_doi");

export function filterSoldiers(soldiers, phieuMap, filterTab, searchText) {
    return soldiers.filter((qn) => {
        const phieu = phieuMap[qn.ma_quan_nhan];
        const tt = phieu?.trang_thai || "chua_kham";
        if (filterTab === 0) return true;
        if (filterTab === 1) return tt === "chua_kham";
        if (filterTab === 2) return tt === "dang_kham";
        if (filterTab === 3) return tt === "da_kham";
        return true;
    }).filter((qn) => {
        if (!searchText) return true;
        const keyword = searchText.toLowerCase().trim();
        return (
            qn.ho_ten?.toLowerCase().includes(keyword) ||
            qn.ma_quan_nhan?.toLowerCase().includes(keyword)
        );
    }).sort((a, b) => {
        const uA = a.ma_don_vi || "";
        const uB = b.ma_don_vi || "";
        if (uA < uB) return -1;
        if (uA > uB) return 1;
        return (a.ho_ten || "").localeCompare(b.ho_ten || "", "vi");
    });
}
