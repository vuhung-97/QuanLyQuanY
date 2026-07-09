import api from "./api.js";

export const danhMucService = {
    listNhomBenh: (params) => api.get("/dm_nhom_benh", { params }),
    getNhomBenh: (id) => api.get(`/dm_nhom_benh/${id}`),
    createNhomBenh: (data) => api.post("/dm_nhom_benh", data),
    updateNhomBenh: (id, data) => api.patch(`/dm_nhom_benh/${id}`, data),
    deleteNhomBenh: (id) => api.delete(`/dm_nhom_benh/${id}`),

    listTrieuChung: (params) => api.get("/dm_trieu_chung", { params }),
    getTrieuChung: (id) => api.get(`/dm_trieu_chung/${id}`),
    createTrieuChung: (data) => api.post("/dm_trieu_chung", data),
    updateTrieuChung: (id, data) => api.patch(`/dm_trieu_chung/${id}`, data),
    deleteTrieuChung: (id) => api.delete(`/dm_trieu_chung/${id}`),
};
