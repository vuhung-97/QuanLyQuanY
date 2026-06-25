import api from "./api.js";

export const noiTruService = {
    getDanhSachNoiTru: (params) =>
        api.get("/benh_an/noi-tru/danh-sach", { params }),

    getDanhSachNhapVien: (params) =>
        api.get("/kham_benh/nhap-vien/danh-sach", { params }),

    getBenhAn: (id) => api.get(`/benh_an/${id}`),
    getBenhAnByKhamBenh: (maKhamBenh) =>
        api.get(`/benh_an/by-kham-benh/${maKhamBenh}`),
    createBenhAn: (data) => api.post("/benh_an", data),
    updateBenhAn: (id, data) => api.patch(`/benh_an/${id}`, data),

    raVien: (id, data) => api.post(`/benh_an/${id}/ra-vien`, data),

    getPhieuChamSoc: (maBenhAn) =>
        api.get(`/benh_an/${maBenhAn}/phieu-cham-soc`),
    createPhieuChamSoc: (data) => api.post("/phieu_cham_soc", data),
    updatePhieuChamSoc: (id, data) =>
        api.patch(`/phieu_cham_soc/${id}`, data),

    searchThuoc: (keyword, limit) =>
        api.get(`/thuoc_vtyt/search/value`, {
            params: { search: keyword, limit },
        }),
};
