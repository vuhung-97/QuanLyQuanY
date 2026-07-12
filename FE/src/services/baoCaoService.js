import api from "./api.js";

export const baoCaoService = {
    getQuanYThang: (thang, nam) =>
        api.get("/bao-cao/quan-y-thang", { params: { thang, nam } }),

    getQuanYNam: (nam) =>
        api.get("/bao-cao/quan-y-nam", { params: { nam } }),

    getQuanSoKhoe: (thang, nam) =>
        api.get("/bao-cao/quan-so-khoe", { params: { thang, nam } }),

};
