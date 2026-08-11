import api from "./api.js";

export const baoCaoService = {
    getQuanYThang: (thang, nam) =>
        api.get("/bao-cao/quan-y-thang", { params: { thang, nam } }),

    getQuanYNam: (nam) =>
        api.get("/bao-cao/quan-y-nam", { params: { nam } }),

    getQuanSoKhoe: (thang, nam) =>
        api.get("/bao-cao/quan-so-khoe", { params: { thang, nam } }),

    getChiTietNhomBenh: (loai, maNhom, thang, nam) =>
        api.get("/bao-cao/quan-y-thang/chi-tiet-nhom-benh", { params: { loai, ma_nhom: maNhom, thang, nam } }),

    getChiTietQuanSoKhoeDonVi: (maDonVi, thang, nam) =>
        api.get("/bao-cao/quan-so-khoe/chi-tiet-don-vi", { params: { ma_don_vi: maDonVi, thang, nam } }),

};
