import api from "./api.js";

export const adminService = {
    getUserList: (params) =>
        api.get("/nguoi_dung", { params: { limit: 100, offset: 0, ...params } }),

    createUser: (data) => api.post("/nguoi_dung", data),

    updateUser: (id, data) => api.patch(`/nguoi_dung/${id}`, data),

    deleteUser: (id) => api.delete(`/nguoi_dung/${id}`),

    getRoleList: (params) =>
        api.get("/vai_tro", { params: { limit: 100, offset: 0, ...params } }),

    createRole: (data) => api.post("/vai_tro", data),

    updateRole: (id, data) => api.patch(`/vai_tro/${id}`, data),

    getPermissionList: (params) =>
        api.get("/quyen", { params: { limit: 200, offset: 0, ...params } }),

    getRolePermissionMapping: (params) =>
        api.get("/vai_tro_quyen", { params: { limit: 200, offset: 0, ...params } }),

    createRolePermission: (data) => api.post("/vai_tro_quyen", data),

    deleteRolePermission: (roleId, permId) =>
        api.delete(`/vai_tro_quyen/${roleId},${permId}`),

    getAuditLog: (endpoint, params) => api.get(endpoint, { params }),

    getBackupList: () => api.get("/backup"),

    downloadBackup: (filename) =>
        api.get(`/backup/download/${filename}`, { responseType: "blob" }),

    createBackup: () => api.post("/backup"),
};
