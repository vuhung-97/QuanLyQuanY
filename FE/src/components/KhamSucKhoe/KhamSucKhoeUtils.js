export function getScheduleStatus(row) {
    if (row.trang_thai && row.trang_thai !== "da_duyet") {
        const statusMap = {
            "cho_gui": "Chờ gửi",
            "cho_duyet": "Chờ duyệt",
            "tu_choi": "Từ chối",
        };
        return statusMap[row.trang_thai] || row.trang_thai;
    }
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
    if (status === "Chờ gửi")
        return { bgcolor: "rgba(148, 163, 184, 0.14)", color: "text.secondary" };
    if (status === "Chờ duyệt")
        return { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" };
    if (status === "Từ chối")
        return { bgcolor: "rgba(239, 68, 68, 0.12)", color: "error.main" };
    if (status === "Đã kết thúc")
        return { bgcolor: "rgba(16, 185, 129, 0.12)", color: "success.main" };
    if (status === "Sắp diễn ra")
        return { bgcolor: "rgba(0, 180, 216, 0.12)", color: "secondary.main" };
    return { bgcolor: "rgba(245, 158, 11, 0.14)", color: "warning.main" };
}

export function getPhanLoai(phieu) {
    if (!phieu?.ket_luan) return "";
    try {
        const parsed = typeof phieu.ket_luan === "string"
            ? JSON.parse(phieu.ket_luan)
            : phieu.ket_luan;
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

function parseWithDefault(data, defaultObj, fallbackKey) {
    if (!data) return { ...defaultObj };
    try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
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

/* ─── Thể lực helpers ─── */

function loaiTuCao(cm, isNam) {
    const v = parseFloat(cm);
    if (isNaN(v) || v <= 0) return 1;
    if (isNam) {
        if (v >= 163) return 1;
        if (v >= 160) return 2;
        if (v >= 157) return 3;
        if (v >= 155) return 4;
        if (v >= 153) return 5;
        return 6;
    }
    if (v >= 154) return 1;
    if (v >= 152) return 2;
    if (v >= 150) return 3;
    if (v >= 148) return 4;
    if (v >= 147) return 5;
    return 6;
}

function loaiTuNang(kg, isNam) {
    const v = parseFloat(kg);
    if (isNaN(v) || v <= 0) return 1;
    if (isNam) {
        if (v >= 51) return 1;
        if (v >= 47) return 2;
        if (v >= 43) return 3;
        if (v >= 41) return 4;
        if (v >= 40) return 5;
        return 6;
    }
    if (v >= 48) return 1;
    if (v >= 44) return 2;
    if (v >= 42) return 3;
    if (v >= 40) return 4;
    if (v >= 38) return 5;
    return 6;
}

function loaiTuVongNguc(vn) {
    const v = parseFloat(vn);
    if (isNaN(v) || v <= 0) return 1;
    if (v >= 81) return 1;
    if (v >= 78) return 2;
    if (v >= 75) return 3;
    if (v >= 73) return 4;
    if (v >= 71) return 5;
    return 6;
}

function loaiTuBMI(bmi) {
    const v = parseFloat(bmi);
    if (isNaN(v) || v <= 0) return 1;
    if (v >= 40) return 6;
    if (v >= 35) return 5;
    if (v >= 30) return 4;
    if (v >= 27) return 3;
    if (v >= 25) return 2;
    if (v >= 18.5) return 1;
    return 4;
}

export function classifyTheLuc(data, gioiTinh) {
    const isNam = gioiTinh !== false;
    const loaiCC = loaiTuCao(data?.chieu_cao, isNam);
    const loaiCN = loaiTuNang(data?.can_nang, isNam);
    const loaiVN = isNam ? loaiTuVongNguc(data?.vong_nguc) : 1;
    const h = parseFloat(data?.chieu_cao);
    const w = parseFloat(data?.can_nang);
    let bmi = "";
    if (h > 0 && w > 0) bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
    const loaiBMI = loaiTuBMI(bmi);
    return `Loại ${Math.max(loaiCC, loaiCN, loaiVN, loaiBMI)}`;
}

/* ─── Sinh tồn helpers ─── */

function diemHATT(v) {
    if (isNaN(v)) return 1;
    if (v >= 160) return 6;
    if (v >= 150) return 5;
    if (v >= 140) return 4;
    if (v >= 131) return 3;
    if (v >= 121) return 2;
    if (v >= 110) return 1;
    if (v >= 100) return 2;
    if (v >= 90) return 3;
    return 4;
}

function diemHATTr(v) {
    if (isNaN(v)) return 1;
    if (v >= 100) return 5;
    if (v >= 90) return 4;
    if (v >= 86) return 3;
    if (v >= 81) return 2;
    return 1;
}

function diemMach(v) {
    if (isNaN(v)) return 1;
    if (v > 100 || v < 50) return 6;
    if (v >= 91) return 4;
    if (v >= 86) return 3;
    if (v >= 81) return 2;
    if (v >= 60) return 1;
    if (v >= 57) return 2;
    if (v >= 55) return 3;
    if (v >= 50) return 4;
    return 6;
}

export function classifySinhTon(data) {
    const maxDiem = Math.max(
        diemHATT(parseFloat(data?.huyet_ap_tam_thu)),
        diemHATTr(parseFloat(data?.huyet_ap_tam_truong)),
        diemMach(parseFloat(data?.mach)),
    );
    return `Loại ${maxDiem}`;
}

/* ─── Mắt helpers ─── */

function diemMatPhai(phai) {
    if (isNaN(phai) || phai <= 0) return 1;
    if (phai >= 10) return 1;
    if (phai >= 9) return 3;
    if (phai >= 8) return 4;
    if (phai >= 6) return 5;
    return 6;
}

function diemMatTong(tong) {
    if (isNaN(tong) || tong <= 0) return 1;
    if (tong >= 19) return 1;
    if (tong >= 18) return 2;
    if (tong >= 17) return 3;
    if (tong >= 16) return 4;
    if (tong >= 13) return 5;
    return 6;
}

export function classifyMat(data) {
    const phai = parseFloat(data?.mat_khong_kinh_phai);
    const trai = parseFloat(data?.mat_khong_kinh_trai);
    const tong = (isNaN(phai) ? 0 : phai) + (isNaN(trai) ? 0 : trai);
    return `Loại ${Math.max(diemMatPhai(phai), diemMatTong(tong))}`;
}

export function computeHighestClassification(ts, ls, xn, cdha) {
    const nums = [];
    const all = { ...ts, ...ls, ...xn, ...cdha };
    for (const [key, val] of Object.entries(all)) {
        if (key.endsWith("_loai") && key !== "phan_loai_suc_khoe" && val) {
            const m = String(val).match(/Loại\s*(\d+)/);
            if (m) nums.push(parseInt(m[1], 10));
        }
    }
    if (nums.length === 0) return DEFAULT_PHAN_LOAI;
    return `Loại ${Math.max(...nums)}`;
}

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
