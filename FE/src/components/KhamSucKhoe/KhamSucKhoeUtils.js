export const fallbackSchedules = [
    {
        ma_lich_kham: "LK2026001",
        thoi_gian_bat_dau: "2026-06-10",
        thoi_gian_ket_thuc: "2026-06-18",
    },
    {
        ma_lich_kham: "LK2026002",
        thoi_gian_bat_dau: "2026-07-02",
        thoi_gian_ket_thuc: "2026-07-08",
    },
    {
        ma_lich_kham: "LK2026003",
        thoi_gian_bat_dau: "2026-05-12",
        thoi_gian_ket_thuc: "2026-05-20",
    },
];

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

export { formatDate, formatDateTime } from "@/utils/date.js";

export function statusColor(status) {
    if (status === "Đã kết thúc")
        return { bgcolor: "rgba(16, 185, 129, 0.12)", color: "success.main" };
    if (status === "Sắp diễn ra")
        return { bgcolor: "rgba(0, 180, 216, 0.12)", color: "secondary.main" };
    return { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" };
}

export const filterTabs = ["Tất cả", "Chưa khám", "Đang khám", "Đã khám"];

export function getTrangThai(phieu) {
    if (!phieu) return "Chưa khám";
    if (!phieu.ket_luan) return "Đang khám";
    try {
        const parsed = JSON.parse(phieu.ket_luan);
        if (typeof parsed === "object" && parsed !== null) {
            const hasData = Object.values(parsed).some(v => v && v !== "Loại 1");
            if (!hasData) return "Đang khám";
        }
    } catch {}
    return "Đã khám";
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

export function statusChipColor(tt) {
    if (tt === "Đã khám") return { bgcolor: "rgba(16, 185, 129, 0.12)", color: "success.main" };
    if (tt === "Đang khám") return { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" };
    return { bgcolor: "rgba(100, 116, 139, 0.12)", color: "text.secondary" };
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

export function filterSoldiers(soldiers, phieuMap, filterTab, searchText, getTrangThai) {
    return soldiers.filter((qn) => {
        const tt = getTrangThai(phieuMap[qn.ma_quan_nhan]);
        if (filterTab === 0) return true;
        if (filterTab === 1) return tt === "Chưa khám";
        if (filterTab === 2) return tt === "Đang khám";
        if (filterTab === 3) return tt === "Đã khám";
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
