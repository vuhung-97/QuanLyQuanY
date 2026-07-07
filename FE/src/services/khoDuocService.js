import api from "./api.js";

export const khoDuocService = {
    listThuocVtyt: (params) => api.get("/thuoc_vtyt", { params }),
    getThuocVtyt: (id) => api.get(`/thuoc_vtyt/${id}`),
    createThuocVtyt: (data) => api.post("/thuoc_vtyt", data),
    updateThuocVtyt: (id, data) => api.patch(`/thuoc_vtyt/${id}`, data),
    deleteThuocVtyt: (id) => api.delete(`/thuoc_vtyt/${id}`),
    countThuocVtyt: () => api.get("/thuoc_vtyt/count"),

    fetchAllThuocVtyt: async () => {
        const countRes = await api.get("/thuoc_vtyt/count");
        const total = countRes.data ?? 0;
        const LIMIT = 500;
        const pageCount = Math.ceil(total / LIMIT);
        if (pageCount <= 1) {
            const res = await api.get("/thuoc_vtyt", {
                params: { limit: LIMIT, offset: 0 },
            });
            return res.data || [];
        }
        const promises = Array.from({ length: pageCount }, (_, i) =>
            api.get("/thuoc_vtyt", {
                params: { limit: LIMIT, offset: i * LIMIT },
            }),
        );
        const results = await Promise.all(promises);
        return results.flatMap((r) => r.data || []);
    },

    getPhanLoaiList: () => api.get("/thuoc_vtyt/phan-loai-list"),

    searchThuocVtyt: (search, limit) =>
        api.get("/thuoc_vtyt/search/value", { params: { search, limit } }),
    getTonKho: (search) =>
        api.get("/thuoc_vtyt/ton-kho", { params: search ? { search } : {} }),
    getSapHetHan: (days) =>
        api.get("/thuoc_vtyt/sap-het-han", { params: days ? { days } : {} }),
    dieuChinhTon: (id, soLuongMoi) =>
        api.patch(`/thuoc_vtyt/${id}/dieu-chinh-ton`, null, {
            params: { so_luong_moi: soLuongMoi },
        }),

    listPhieuDuTru: (params) => api.get("/phieu_du_tru", { params }),
    getDanhSachPhieuDuTru: (params) => api.get("/phieu_du_tru/danh-sach", { params }),
    getPhieuDuTru: (id) => api.get(`/phieu_du_tru/${id}`),
    createPhieuDuTru: (data) => api.post("/phieu_du_tru", data),
    updatePhieuDuTru: (id, data) => api.patch(`/phieu_du_tru/${id}`, data),
    deletePhieuDuTru: (id) => api.delete(`/phieu_du_tru/${id}`),
    duyetPhieuDuTru: (id) => api.post(`/phieu_du_tru/${id}/duyet`),
    tuChoiPhieuDuTru: (id) => api.post(`/phieu_du_tru/${id}/tu-choi`),
    nhapKhoTuPhieuDuTru: (id, data) => api.post(`/phieu_du_tru/${id}/nhap-kho`, data),

    listChiTietDuTru: (params) => api.get("/chi_tiet_du_tru", { params }),
    getChiTietByPhieuDuTru: (maPhieu) => api.get(`/chi_tiet_du_tru/by-phieu/${maPhieu}`),
    createChiTietDuTru: (data) => api.post("/chi_tiet_du_tru", data),
    updateChiTietDuTru: (id, data) => api.patch(`/chi_tiet_du_tru/${id}`, data),
    deleteChiTietDuTru: (id) => api.delete(`/chi_tiet_du_tru/${id}`),

    listPhieuNhapKho: (params) => api.get("/phieu_nhap_kho", { params }),
    getPhieuNhapKho: (id) => api.get(`/phieu_nhap_kho/${id}`),
    createPhieuNhapKho: (data) => api.post("/phieu_nhap_kho", data),
    updatePhieuNhapKho: (id, data) => api.patch(`/phieu_nhap_kho/${id}`, data),
    deletePhieuNhapKho: (id) => api.delete(`/phieu_nhap_kho/${id}`),
    getPhieuNhapByPhieuDuTru: (maPhieuDuTru) =>
        api.get(`/phieu_nhap_kho/by-phieu-du-tru/${maPhieuDuTru}`),

    listChiTietPhieuNhap: (params) =>
        api.get("/chi_tiet_phieu_nhap_kho", { params }),
    createChiTietPhieuNhap: (data) => api.post("/chi_tiet_phieu_nhap_kho", data),
    updateChiTietPhieuNhap: (id, data) =>
        api.patch(`/chi_tiet_phieu_nhap_kho/${id}`, data),
    deleteChiTietPhieuNhap: (id) =>
        api.delete(`/chi_tiet_phieu_nhap_kho/${id}`),

    listPhieuXuatKho: (params) => api.get("/phieu_xuat_kho", { params }),
    getDanhSachPhieuXuat: (params) =>
        api.get("/phieu_xuat_kho/danh-sach", { params }),
    getPhieuXuatKho: (id) => api.get(`/phieu_xuat_kho/${id}`),
    createPhieuXuatKho: (data) => api.post("/phieu_xuat_kho", data),
    updatePhieuXuatKho: (id, data) => api.patch(`/phieu_xuat_kho/${id}`, data),
    deletePhieuXuatKho: (id) => api.delete(`/phieu_xuat_kho/${id}`),
    duyetPhieuXuat: (id) => api.post(`/phieu_xuat_kho/${id}/duyet`),
    tuChoiPhieuXuat: (id) => api.post(`/phieu_xuat_kho/${id}/tu-choi`),
    xuatKho: (id) => api.post(`/phieu_xuat_kho/${id}/xuat-kho`),

    getChiTietByPhieuXuat: (maPhieuXuat) =>
        api.get(`/chi_tiet_xuat_kho/by-phieu/${maPhieuXuat}`),
    listChiTietXuatKho: (params) => api.get("/chi_tiet_xuat_kho", { params }),
    createChiTietXuatKho: (data) => api.post("/chi_tiet_xuat_kho", data),
    updateChiTietXuatKho: (id, data) =>
        api.patch(`/chi_tiet_xuat_kho/${id}`, data),
    deleteChiTietXuatKho: (id) => api.delete(`/chi_tiet_xuat_kho/${id}`),

    getThongKePhieuDuTru: (params) => api.get("/thong-ke/phieu-du-tru", { params }),
    getThongKePhieuXuat: (params) => api.get("/thong-ke/phieu-xuat", { params }),

    listDonVi: (params) => api.get("/don_vi", { params }),
    listQuanNhan: (params) => api.get("/quan_nhan", { params }),
};
