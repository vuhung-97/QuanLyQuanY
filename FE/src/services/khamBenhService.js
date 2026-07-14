import api from "./api.js";

export const khamBenhService = {
    getHomNay: (ngay, params) =>
        api.get("/kham_benh/hom-nay", {
            params: { ...(ngay && { ngay }), ...params },
        }),
    getById: (id) => api.get(`/kham_benh/${id}`),
    getDetail: (id) => api.get(`/kham_benh/${id}/detail`),
    create: (data) => api.post("/kham_benh", data),
    update: (id, data) => api.patch(`/kham_benh/${id}`, data),
    receiveMedicine: (id) => api.post(`/kham_benh/${id}/nhan-thuoc`),
    referPatient: (id, data) => api.post(`/kham_benh/${id}/chuyen-tuyen`, data),
    admitPatient: (id, data) => api.post(`/kham_benh/${id}/nhap-vien`, data),
    searchThuoc: (keyword, limit) =>
        api.get(`/thuoc_vtyt/search/value`, { params: { search: keyword, limit } }),
    listThuoc: (params) => api.get("/thuoc_vtyt", { params }),
    getPatientHistory: (qnId) => api.get(`/quan_nhan/${qnId}/lich-su-kham`),
    getQuanNhanDanhSach: (params) =>
        api.get("/quan_nhan/list", { params }),
    getDonViList: (params) => api.get("/don_vi", { params }),
    getAll: (params) => api.get("/kham_benh/danh-sach", { params }),
    list: (params) => api.get("/kham_benh", { params }),
    delete: (id) => api.delete(`/kham_benh/${id}`),
    getQuanNhan: (id) => api.get(`/quan_nhan/${id}`),
    completeExamination: (id, data) =>
        api.post(`/kham_benh/${id}/hoan-tat`, data),

    getChuyenTuyenList: (params) => api.get("/kham_benh/chuyen-tuyen", { params }),
    getChiTietChuyenTuyen: (maKhamBenh) =>
        api.get(`/kham_benh/${maKhamBenh}/chuyen-tuyen/chi-tiet`),
    approveChuyenTuyen: (maKhamBenh) =>
        api.post(`/kham_benh/${maKhamBenh}/duyet-chuyen-tuyen`),
    rejectChuyenTuyen: (maKhamBenh) =>
        api.post(`/kham_benh/${maKhamBenh}/khong-duyet-chuyen-tuyen`),

    getGiayGioiThieu: (params) => api.get("/giay_gioi_thieu", { params }),
    getGiayGioiThieuByKhamBenh: (maKhamBenh) =>
        api.get(`/giay_gioi_thieu/kham-benh/${maKhamBenh}`),
    createGiayGioiThieu: (data) => api.post("/giay_gioi_thieu", data),
    updateGiayGioiThieu: (id, data) =>
        api.patch(`/giay_gioi_thieu/${id}`, data),

    getDiTuyenSauDieuTri: (params) =>
        api.get("/di_tuyen_sau_dieu_tri", { params }),
    createDiTuyenSauDieuTri: (data) => api.post("/di_tuyen_sau_dieu_tri", data),
    updateDiTuyenSauDieuTri: (id, data) =>
        api.patch(`/di_tuyen_sau_dieu_tri/${id}`, data),
};
