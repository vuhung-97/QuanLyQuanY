import api from "./api.js";

export const danhMucService = {
    listNhomBenh: (params) => api.get("/dm_nhom_benh", { params }),
    getNhomBenh: (id) => api.get(`/dm_nhom_benh/${id}`),
    createNhomBenh: (data) => api.post("/dm_nhom_benh", data),
    updateNhomBenh: (id, data) => api.patch(`/dm_nhom_benh/${id}`, data),
    deleteNhomBenh: (id) => api.delete(`/dm_nhom_benh/${id}`),

    searchDisease: (keyword) => api.get("/dm_benh/search", { params: { q: keyword } }),
};
