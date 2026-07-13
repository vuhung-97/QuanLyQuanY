import { useState, useCallback } from "react";
import { khamSucKhoeService } from "@/services/khamSucKhoeService.js";
import { khamBenhService } from "@/services/khamBenhService.js";
import { noiTruService } from "@/services/noiTruService.js";

export default function useBaoCaoQuanNhan() {
    const [quanNhan, setQuanNhanState] = useState(null);
    const [kskList, setKskList] = useState([]);
    const [khamBenhList, setKhamBenhList] = useState([]);
    const [benhAnList, setBenhAnList] = useState([]);
    const [chuyenTuyenList, setChuyenTuyenList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (qn) => {
        if (!qn?.ma_quan_nhan) return;
        setLoading(true);
        setError(null);
        try {
            const [kskRes, kbRes, baRes, ctRes] = await Promise.all([
                khamSucKhoeService.getPhieuByMaQuanNhan(qn.ma_quan_nhan),
                khamBenhService.getAll({ ma_quan_nhan: qn.ma_quan_nhan }),
                noiTruService.getDanhSachNoiTru({ ma_quan_nhan: qn.ma_quan_nhan }),
                khamBenhService.getChuyenTuyenList({ ma_quan_nhan: qn.ma_quan_nhan }),
            ]);

            setKskList(Array.isArray(kskRes.data) ? kskRes.data : []);
            setKhamBenhList(kbRes.data?.data || []);
            setBenhAnList(baRes.data?.data || []);
            setChuyenTuyenList(ctRes.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.detail || "Lỗi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, []);

    const setQuanNhan = useCallback((qn) => {
        setQuanNhanState(qn);
        fetchData(qn);
    }, [fetchData]);

    return {
        quanNhan, setQuanNhan,
        kskList, khamBenhList, benhAnList, chuyenTuyenList,
        loading, error,
    };
}
