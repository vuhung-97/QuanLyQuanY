import { THOI_DIEM_OPTIONS, CACH_SU_DUNG_OPTIONS } from "@/constants/khamBenhConstants.js";

export function genKey() {
    return Math.random().toString(36).slice(2, 11);
}

export const THOI_DIEM_LABEL_TO_VALUE = {
    "Sau ăn": "sau_an",
    "Trước ăn": "truoc_an",
    "Trước khi ngủ": "truoc_khi_ngu",
    "Sau khi thức dậy": "sau_khi_thuc_day",
    Không: "khong",
};

export const CACH_DUNG_LABEL_TO_VALUE = {
    Uống: "uong",
    Bôi: "boi",
    Tiêm: "tiem",
    Xông: "xong",
    Ngậm: "ngam",
    "Nhỏ mắt": "nhot",
    Khác: "khac",
};

export function parseHuongDieuTri(str) {
    if (!str)
        return {
            sang: 0,
            trua: 0,
            toi: 0,
            thoi_diem_dung: "sau_an",
            cach_su_dung: "uong",
            ghi_chu: "",
        };
    const parts = str.split(" | ");
    const lieu = parts[0] || "";
    const thoiDiemLabel = parts[1] || "";
    const cachDungLabel = parts[2] || "";
    const ghi_chu = parts.slice(3).join(" | ") || "";
    const lieuParts = lieu.split(" - ");
    const sang = parseInt(lieuParts[0]?.replace("Sáng: ", "")) || 0;
    const trua = parseInt(lieuParts[1]?.replace("Trưa: ", "")) || 0;
    const toi = parseInt(lieuParts[2]?.replace("Tối: ", "")) || 0;
    const thoi_diem_dung = THOI_DIEM_LABEL_TO_VALUE[thoiDiemLabel] || "sau_an";
    const cach_su_dung = CACH_DUNG_LABEL_TO_VALUE[cachDungLabel] || "uong";
    return { sang, trua, toi, thoi_diem_dung, cach_su_dung, ghi_chu };
}

export function parseDonThuocToRows(examDetail) {
    if (!examDetail?.don_thuoc) return [];
    const rows = [];
    for (const dt of examDetail.don_thuoc) {
        for (const ct of dt.chi_tiet_don_thuoc || []) {
            const hdt = ct.huong_dieu_tri || "";
            const parts = hdt.split(" | ");
            rows.push({
                ten_thuoc: ct.ten_thuoc_vtyt || ct.ma_thuoc_vtyt,
                so_luong: ct.so_luong,
                don_vi_tinh: ct.don_vi_tinh || "",
                lieu: parts[0] || "",
                thoi_diem: parts[1] || "",
                cach_dung: parts[2] || "",
                ghi_chu: parts.slice(3).join(" | "),
            });
        }
    }
    return rows;
}

export function buildHuongDieuTri(item) {
    const lieu = `Sáng: ${item.sang} - Trưa: ${item.trua} - Tối: ${item.toi}`;
    const td = THOI_DIEM_OPTIONS.find((o) => o.value === item.thoi_diem_dung);
    const cd = CACH_SU_DUNG_OPTIONS.find((o) => o.value === item.cach_su_dung);
    const cachDung = cd?.label || "Uống";
    const thoiDiem = td?.label || "Sau ăn";
    let result = `${lieu} | ${thoiDiem} | ${cachDung}`;
    if (item.ghi_chu) result += ` | ${item.ghi_chu}`;
    return result;
}
