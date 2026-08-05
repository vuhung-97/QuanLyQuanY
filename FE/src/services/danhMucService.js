import api from "./api.js";

export const danhMucService = {
    listNhomBenh: (params) => api.get("/dm_nhom_benh", { params }),
    getNhomBenh: (id) => api.get(`/dm_nhom_benh/${id}`),
    createNhomBenh: (data) => api.post("/dm_nhom_benh", data),
    updateNhomBenh: (id, data) => api.patch(`/dm_nhom_benh/${id}`, data),
    deleteNhomBenh: (id) => api.delete(`/dm_nhom_benh/${id}`),

    listBenh: (params) => api.get("/dm_benh", { params }),
    getBenh: (id) => api.get(`/dm_benh/${id}`),
    createBenh: (data) => api.post("/dm_benh", data),
    updateBenh: (id, data) => api.patch(`/dm_benh/${id}`, data),
    deleteBenh: (id) => api.delete(`/dm_benh/${id}`),

    listTrieuChung: (params) => api.get("/dm_trieu_chung", { params }),
    getTrieuChung: (id) => api.get(`/dm_trieu_chung/${id}`),
    createTrieuChung: (data) => api.post("/dm_trieu_chung", data),
    updateTrieuChung: (id, data) => api.patch(`/dm_trieu_chung/${id}`, data),
    deleteTrieuChung: (id) => api.delete(`/dm_trieu_chung/${id}`),

    searchDisease: (keyword) => api.get("/dm_benh/search", { params: { q: keyword } }),
    suggestDisease: (keyword, limit = 20) =>
        api.get("/dm_benh/suggest", { params: { q: keyword, limit } }),
};
