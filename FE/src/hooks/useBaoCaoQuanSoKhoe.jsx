import { useState, useEffect, useCallback, useMemo } from "react";
import { baoCaoService } from "@/services/baoCaoService.js";
import { buildTree, flattenTree, aggregateTree } from "@/utils/treeUtils.js";
import { UNIT_NAME } from "@/components/layout/common/constants.js";

function getRowStyle(level, isParent, isTotal) {
    if (isTotal || isParent) return { fontWeight: level === 0 ? 700 : 600, bgcolor: "#F5F5F5" };
    return {};
}

function prepareTreeWithCoQuan(nodes) {
    for (const node of nodes) {
        if (node.children && node.children.length > 0) {
            prepareTreeWithCoQuan(node.children);

            const selfQuanSo = node.quan_so || 0;
            const selfNguoiOm = node.so_nguoi_om || 0;
            const selfNhapBenhXa = node.so_luot_nhap_benh_xa || 0;
            const selfChuyenTuyen = node.so_luot_chuyen_tuyen || 0;
            const selfLuotOm = node.so_luot_om || 0;
            const selfQK = Math.max(0, selfQuanSo - selfNguoiOm);
            const selfTL =
                selfQuanSo > 0
                    ? Math.round((selfQK / selfQuanSo) * 1000) / 10
                    : 100.0;

            const coQuanNode = {
                ma_don_vi: `${node.ma_don_vi}_co_quan`,
                ten_don_vi: "Cơ quan",
                ma_don_vi_truc_thuoc: node.ma_don_vi,
                quan_so: selfQuanSo,
                so_nguoi_om: selfNguoiOm,
                so_luot_nhap_benh_xa: selfNhapBenhXa,
                so_luot_chuyen_tuyen: selfChuyenTuyen,
                so_luot_om: selfLuotOm,
                quan_so_khoe: selfQK,
                ty_le_khoe: selfTL,
                children: [],
            };

            node.children.unshift(coQuanNode);

            node.quan_so = 0;
            node.so_nguoi_om = 0;
            node.so_luot_nhap_benh_xa = 0;
            node.so_luot_chuyen_tuyen = 0;
            node.so_luot_om = 0;
        }
    }
    return nodes;
}

export default function useBaoCaoQuanSoKhoe() {
    const now = new Date();
    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam, setNam] = useState(now.getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [printOpen, setPrintOpen] = useState(false);

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
        const rawTree = buildTree(data.don_vi);
        const preparedTree = prepareTreeWithCoQuan(rawTree);
        const tree = aggregateTree(preparedTree);
        const flat = flattenTree(tree);

        const treeRows = flat.map((u) => {
            const isLevel1OrParent = u.level === 0 || u.children?.length > 0;
            return {
                ...u,
                raw_ten_don_vi: u.ten_don_vi,
                ten_don_vi: (
                    <span style={{ paddingLeft: u.level * 20 }}>
                        {u.level > 0 ? "– ".repeat(u.level) : ""}
                        {u.ten_don_vi}
                    </span>
                ),
                _rowStyle: getRowStyle(u.level, isLevel1OrParent, false),
            };
        });

        const tq = data.tong_quan;
        treeRows.push({
            ma_don_vi: "__total__",
            ten_don_vi: <span style={{ fontWeight: 700 }}>{`${UNIT_NAME} (tổng cộng)`}</span>,
            quan_so: tq.tong_quan_so,
            so_nguoi_om: tq.tong_nguoi_om,
            so_luot_nhap_benh_xa: tq.tong_luot_nhap_benh_xa,
            so_luot_chuyen_tuyen: tq.tong_luot_chuyen_tuyen,
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
        printOpen, setPrintOpen,
    };
}
