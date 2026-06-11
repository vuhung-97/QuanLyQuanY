export const DEFAULT_TS = { ban_than: "", gia_dinh: "", di_ung: "", khac: "" };

export const DEFAULT_LS = {
    chieu_cao: "", can_nang: "", vong_nguc: "", vong_bung: "",
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

export const DEFAULT_CLS = {
    hong_cau: "", bach_cau: "", tieu_cau: "",
    glucose_mau: "", ure: "", creatinin: "", ast: "", alt: "",
    nuoc_tieu_glucose: "", nuoc_tieu_protein: "", nuoc_tieu_te_bao: "",
    dien_tim: "", x_quang: "", sieu_am: "", khac: "",
};

export const DEFAULT_KL = {
    phan_loai_suc_khoe: "Loại 1",
    ly_do: "",
    benh_tat_theo_doi: "",
    chi_dan_khac: "",
};

export const cardStyle = {
    borderRadius: 2,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid",
    borderColor: "divider",
    mb: 3,
    bgcolor: "background.paper",
};

function parseWithDefault(str, defaultObj, fallbackKey) {
    if (!str) return { ...defaultObj };
    try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === "object") {
            const mapped = { ...defaultObj, ...parsed };
            Object.keys(defaultObj)
                .filter((k) => k.endsWith("_loai"))
                .forEach((k) => {
                    if (!mapped[k]) mapped[k] = "Loại 1";
                });
            return mapped;
        }
    } catch {}
    return { ...defaultObj, [fallbackKey]: str };
}

export const parseTienSu = (str) => parseWithDefault(str, DEFAULT_TS, "ban_than");
export const parseLamSang = (str) => parseWithDefault(str, DEFAULT_LS, "khac");
export const parseCanLamSang = (str) => parseWithDefault(str, DEFAULT_CLS, "khac");
export const parseKetLuan = (str) => parseWithDefault(str, DEFAULT_KL, "benh_tat_theo_doi");
