import api from "./api.js";

export const dashboardService = {
    getTongQuan: () => api.get("/bao-cao/tong-quan"),
};
