import api from "./api.js";

export const khamSucKhoeService = {
    getDonViList: (params) =>
        api.get("/thong-ke/don-vi", { params: { limit: 100, ...params } }),

    getScheduleList: (params) =>
        api.get("/lich_kham_sk_nam", {
            params: {
                limit: 100,
                offset: 0,
                sort_by: "thoi_gian_bat_dau",
                ...params,
            },
        }),

    getScheduleStats: (scheduleId) =>
        api.get(`/thong-ke/lich-kham/${scheduleId}`),

    getScheduleDetail: (scheduleId) =>
        api.get(`/lich_kham_sk_nam/${scheduleId}/chi-tiet`),

    getSoldiersBySchedule: (scheduleId) =>
        api.get(`/quan_nhan/by-lich-kham/${scheduleId}`),

    getPhieuBySchedule: (scheduleId) =>
        api.get(`/phieu_kham_suc_khoe/by-lich-kham/${scheduleId}`),

    taoMaLayMau: (data) => api.post("/phieu_kham_suc_khoe/tao-ma-lay-mau", data),

    getPhieuByMaQuanNhan: (maQuanNhan) =>
        api.get(`/phieu_kham_suc_khoe/by-ma-quan-nhan/${maQuanNhan}`),

    createPhieu: (data) => api.post("/phieu_kham_suc_khoe", data),

    updatePhieu: (id, data) => api.patch(`/phieu_kham_suc_khoe/${id}`, data),

    createSchedule: (data) => api.post("/lich_kham_sk_nam", data),

    updateSchedule: (id, data) => api.patch(`/lich_kham_sk_nam/${id}`, data),

    deleteSchedule: (id) => api.delete(`/lich_kham_sk_nam/${id}`),

    createScheduleDetail: (scheduleId, data) =>
        api.post(`/lich_kham_sk_nam/${scheduleId}/chi-tiet`, data),

    updateScheduleDetail: (scheduleId, maDonVi, data) =>
        api.patch(`/lich_kham_sk_nam/${scheduleId}/chi-tiet/${maDonVi}`, data),

    deleteScheduleDetail: (scheduleId, maDonVi) =>
        api.delete(`/lich_kham_sk_nam/${scheduleId}/chi-tiet/${maDonVi}`),

    // Phân công nhiệm vụ
    getAssignments: (scheduleId) =>
        api.get(`/lich_kham_sk_nam/${scheduleId}/phan-cong`),

    createAssignment: (scheduleId, data) =>
        api.post(`/lich_kham_sk_nam/${scheduleId}/phan-cong`, data),

    updateAssignment: (scheduleId, id, data) =>
        api.patch(`/lich_kham_sk_nam/${scheduleId}/phan-cong/${id}`, data),

    deleteAssignment: (scheduleId, id) =>
        api.delete(`/lich_kham_sk_nam/${scheduleId}/phan-cong/${id}`),

    getMyAssignment: (scheduleId) =>
        api.get("/auth/me/phan-cong", { params: { ma_lich_kham: scheduleId } }),

    // Vai trò tạm thời
    getVaiTroList: () =>
        api.get("/vai_tro_tam_thoi", { params: { limit: 50 } }),

    getNguoiDungList: () => api.get("/nguoi_dung", { params: { limit: 500 } }),
};
