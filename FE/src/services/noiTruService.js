import api from "./api.js";

export const noiTruService = {
    getDanhSachNoiTru: (params) =>
        api.get("/benh_an/noi-tru", { params }),

    getDanhSachNhapVien: (params) =>
        api.get("/kham_benh/nhap-vien", { params }),

    getBenhAn: (id) => api.get(`/benh_an/${id}`),
    getBenhAnChiTiet: (id) => api.get(`/benh_an/${id}/chi-tiet`),
    getBenhAnByKhamBenh: (maKhamBenh) =>
        api.get(`/benh_an/kham-benh/${maKhamBenh}`),
    createBenhAn: (data) => api.post("/benh_an", data),
    updateBenhAn: (id, data) => api.patch(`/benh_an/${id}`, data),

    raVien: (id, data) => api.post(`/benh_an/${id}/ra-vien`, data),

    getPhieuChamSoc: (maBenhAn, params) =>
        api.get(`/benh_an/${maBenhAn}/phieu-cham-soc`, { params }),
    createPhieuChamSoc: (data) => api.post("/phieu_cham_soc", data),
    updatePhieuChamSoc: (id, data) =>
        api.patch(`/phieu_cham_soc/${id}`, data),

    searchThuoc: (keyword, limit) =>
        api.get(`/thuoc_vtyt/search/value`, {
            params: { search: keyword, limit },
        }),

    getBuong: (params) => api.get("/buong", { params }),
    getBuongCoGiuongTrong: () => api.get("/buong/list/co-giuong-trong"),
    getGiuongTrong: (maBuong) => api.get("/giuong/trong", { params: { ma_buong: maBuong } }),

    createBuong: (data) => api.post("/buong", data),
    updateBuong: (id, data) => api.patch(`/buong/${id}`, data),
    deleteBuong: (id) => api.delete(`/buong/${id}`),

    getGiuongQuanLy: (params) => api.get("/giuong/quan-ly/phong", { params }),
    createGiuong: (data) => api.post("/giuong", data),
    updateGiuong: (id, data) => api.patch(`/giuong/${id}`, data),
    deleteGiuong: (id) => api.delete(`/giuong/${id}`),

    chuyenGiuong: (maGiuong, data) => api.post(`/giuong/${maGiuong}/chuyen`, data),
};
