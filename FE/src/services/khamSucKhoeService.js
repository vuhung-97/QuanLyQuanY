import api from "./api.js";

export const khamSucKhoeService = {
    getDonViList: (params) =>
        api.get("/thong-ke/don-vi", { params: { limit: 500, ...params } }),

    getScheduleList: (params) =>
        api.get("/lich_kham_sk_nam", {
            params: {
                limit: 500,
                offset: 0,
                sort_by: "thoi_gian_bat_dau",
                sort_desc: true,
                ...params,
            },
        }),

    getScheduleStats: (scheduleId) =>
        api.get(`/thong-ke/lich-kham/${scheduleId}`),

    getScheduleDetail: (scheduleId) =>
        api.get(`/lich_kham_sk_nam/${scheduleId}/chi-tiet`),

    getSoldiersBySchedule: (scheduleId) =>
        api.get(`/quan_nhan/lich-kham/${scheduleId}`),

    getPhieuBySchedule: (scheduleId) =>
        api.get(`/phieu_kham_suc_khoe/lich-kham/${scheduleId}`),

    taoMaLayMau: (data) => api.post("/phieu_kham_suc_khoe/tao-ma-lay-mau", data),

    xacNhanLayMau: (data) => api.post("/phieu_kham_suc_khoe/xac-nhan-lay-mau", data),

    dienKetQuaXetNghiem: (maLichKham, file) => {
        const formData = new FormData();
        formData.append("ma_lich_kham", maLichKham);
        formData.append("file", file);
        return api.post("/xet_nghiem_ocr/dien-ket-qua", formData, {
            headers: { "Content-Type": undefined },
        });
    },

    getPhieuByMaQuanNhan: (maQuanNhan) =>
        api.get(`/phieu_kham_suc_khoe/quan-nhan/${maQuanNhan}`),

    uploadCdha: (nam, file) => {
        const formData = new FormData();
        formData.append("nam", nam);
        formData.append("file", file);
        return api.post("/upload/cdha", formData, {
            headers: { "Content-Type": undefined },
        });
    },

    deleteCdha: (path) => api.delete("/upload/cdha", { params: { path } }),

    createPhieu: (data) => api.post("/phieu_kham_suc_khoe", data),

    updatePhieu: (id, data) => api.patch(`/phieu_kham_suc_khoe/${id}`, data),

    createSchedule: (data) => api.post("/lich_kham_sk_nam", data),

    replaceSchedule: (id, data) => api.put(`/lich_kham_sk_nam/${id}`, data),

    deleteSchedule: (id) => api.delete(`/lich_kham_sk_nam/${id}`),

    deleteScheduleDetail: (scheduleId, maDonVi) =>
        api.delete(`/lich_kham_sk_nam/${scheduleId}/chi-tiet/${maDonVi}`),

    // Phân công nhiệm vụ
    getAssignments: (scheduleId) =>
        api.get(`/lich_kham_sk_nam/${scheduleId}/phan-cong`),

    getMyAssignment: (scheduleId) =>
        api.get("/auth/me/phan-cong", { params: { ma_lich_kham: scheduleId } }),

    // Vai trò tạm thời
    getVaiTroList: () =>
        api.get("/vai_tro_tam_thoi", { params: { limit: 500 } }),

    getNguoiDungList: () => api.get("/nguoi_dung", { params: { limit: 500 } }),

    approveSchedule: (id) => api.post(`/lich_kham_sk_nam/${id}/duyet`),
    submitSchedule: (id) => api.post(`/lich_kham_sk_nam/${id}/gui`),
    rejectSchedule: (id) => api.post(`/lich_kham_sk_nam/${id}/tu-choi`),
    hoanSchedule: (id) => api.post(`/lich_kham_sk_nam/${id}/hoan`),
};
