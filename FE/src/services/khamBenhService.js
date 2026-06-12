import api from "./api.js";

export const khamBenhService = {
    getHomNay: (params) => api.get("/kham_benh/hom-nay/danh-sach", { params }),
    getById: (id) => api.get(`/kham_benh/${id}`),
    create: (data) => api.post("/kham_benh", data),
    update: (id, data) => api.patch(`/kham_benh/${id}`, data),
    receiveMedicine: (id) => api.post(`/kham_benh/${id}/nhan-thuoc`),
    referPatient: (id, data) => api.post(`/kham_benh/${id}/chuyen-tuyen`, data),
    admitPatient: (id, data) => api.post(`/kham_benh/${id}/nhap-vien`, data),
    searchThuoc: (keyword) => api.get("/thuoc_vtyt/search", { params: { search: keyword } }),
    getPatientHistory: (qnId) => api.get(`/quan_nhan/${qnId}/lich-su-kham`),
    getQuanNhanDanhSach: (params) => api.get("/quan_nhan/danh-sach/list", { params }),
    getDonViList: (params) => api.get("/don_vi", { params }),
    delete: (id) => api.delete(`/kham_benh/${id}`),
    getQuanNhan: (id) => api.get(`/quan_nhan/${id}`),
};
