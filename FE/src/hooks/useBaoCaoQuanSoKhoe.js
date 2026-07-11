import { useState, useEffect, useCallback, useMemo } from "react";
import { baoCaoService } from "@/services/baoCaoService.js";
import { buildTree, flattenTree, aggregateTree } from "@/utils/treeUtils.js";

export const COLUMNS = [
    { key: "ten_don_vi", label: "Đơn vị", sx: { minWidth: 280 } },
    { key: "quan_so", label: "Tổng quân số", sx: { width: 140, textAlign: "center" } },
    { key: "so_nguoi_om", label: "Người ốm", sx: { width: 120, textAlign: "center" } },
    { key: "so_luot_om", label: "Lượt ốm", sx: { width: 120, textAlign: "center" } },
    { key: "quan_so_khoe", label: "Quân số khỏe", sx: { width: 140, textAlign: "center" } },
    { key: "ty_le_khoe", label: "Tỷ lệ", sx: { width: 100, textAlign: "center" } },
];

function getRowStyle(level, isParent, isTotal) {
    if (isTotal || isParent) return { fontWeight: level === 0 ? 700 : 600, bgcolor: "#F5F5F5" };
    return {};
}

export default function useBaoCaoQuanSoKhoe() {
    const now = new Date();
    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam, setNam] = useState(now.getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!thang || !nam) return;
        setLoading(true);
        setError(null);
        try {
            const res = await baoCaoService.getQuanSoKhoe(thang, nam);
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Lỗi tải báo cáo");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [thang, nam]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { treeRows, chartData } = useMemo(() => {
        if (!data?.don_vi) return { treeRows: [], chartData: [] };
        const tree = aggregateTree(buildTree(data.don_vi));
        const flat = flattenTree(tree);

        const treeRows = flat.map((u) => {
            const isParent = !u.ma_don_vi_truc_thuoc || u.children?.length > 0;
            return {
                ...u,
                ten_don_vi: (
                    <span style={{ paddingLeft: u.level * 20 }}>
                        {u.level > 0 ? "– ".repeat(u.level) : ""}
                        {u.ten_don_vi}
                    </span>
                ),
                _rowStyle: getRowStyle(u.level, isParent, false),
            };
        });

        const tq = data.tong_quan;
        treeRows.push({
            ma_don_vi: "__total__",
            ten_don_vi: <span style={{ fontWeight: 700 }}>Lữ đoàn (tổng cộng)</span>,
            quan_so: tq.tong_quan_so,
            so_nguoi_om: tq.tong_nguoi_om,
            so_luot_om: tq.tong_luot_om,
            quan_so_khoe: tq.quan_so_khoe,
            ty_le_khoe: tq.ty_le_khoe,
            _rowStyle: getRowStyle(0, false, true),
        });

        const chartData = flat
            .filter((u) => u.level === 0)
            .map((u) => ({ name: u.ten_don_vi, ty_le: u.ty_le_khoe }));

        return { treeRows, chartData };
    }, [data]);

    return {
        thang, setThang, nam, setNam,
        data, loading, error,
        fetchData, treeRows, chartData,
    };
}
