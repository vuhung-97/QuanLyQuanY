import api from "./api.js";

export const baoCaoService = {
    getQuanYThang: (thang, nam) =>
        api.get("/bao-cao/quan-y-thang", { params: { thang, nam } }),

    getTonKho: (thang, nam) =>
        api.get("/bao-cao/ton-kho", { params: { thang, nam } }),

    exportQuanYThang: (thang, nam) =>
        api.get("/bao-cao/quan-y-thang/export", {
            params: { thang, nam },
            responseType: "blob",
        }),

    exportTonKho: (thang, nam) =>
        api.get("/bao-cao/ton-kho/export", {
            params: { thang, nam },
            responseType: "blob",
        }),
};
