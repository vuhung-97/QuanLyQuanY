import { useState, useCallback } from "react";
import { buildHuongDieuTri } from "@/utils/khamBenhUtils.js";
import { CACH_DUNG_LABEL_MAP, THOI_DIEM_LABEL_MAP } from "@/constants/khamBenhConstants.js";

export default function usePrescriptionRow(initialData) {
    const [maThuoc] = useState(initialData?.ma_thuoc_vtyt ?? "");
    const [tenThuoc] = useState(initialData?.ten_thuoc_vtyt ?? "");
    const [donViTinh] = useState(initialData?.don_vi_tinh ?? "");
    const [soLuong, setSoLuong] = useState(initialData?.so_luong ?? 1);
    const soLuongMax = initialData?.so_luong_max ?? Infinity;
    const [sang, setSang] = useState(initialData?.sang ?? 0);
    const [trua, setTrua] = useState(initialData?.trua ?? 0);
    const [toi, setToi] = useState(initialData?.toi ?? 0);
    const [thoiDiemDung, setThoiDiemDung] = useState(
        initialData?.thoi_diem_dung ?? "sau_an",
    );
    const [cachSuDung, setCachSuDung] = useState(
        initialData?.cach_su_dung ?? "uong",
    );
    const [ghiChu, setGhiChu] = useState(initialData?.ghi_chu ?? "");

    const exceedWarning = soLuong > 0 && sang + trua + toi > soLuong;

    const getData = useCallback(
        () => ({
            ma_thuoc_vtyt: maThuoc,
            ten_thuoc_vtyt: tenThuoc,
            don_vi_tinh: donViTinh,
            so_luong: soLuong,
            sang,
            trua,
            toi,
            thoi_diem_dung: thoiDiemDung,
            cach_su_dung: cachSuDung,
            ghi_chu: ghiChu,
            huong_dieu_tri: buildHuongDieuTri({
                sang,
                trua,
                toi,
                thoi_diem_dung: thoiDiemDung,
                cach_su_dung: cachSuDung,
                ghi_chu: ghiChu,
            }),
            cach_dung: CACH_DUNG_LABEL_MAP[cachSuDung] || "Uống",
            thoi_diem: THOI_DIEM_LABEL_MAP[thoiDiemDung] || "Sau ăn",
            lieu: `Sáng: ${sang} - Trưa: ${trua} - Tối: ${toi}`,
        }),
        [
            maThuoc,
            tenThuoc,
            donViTinh,
            soLuong,
            sang,
            trua,
            toi,
            thoiDiemDung,
            cachSuDung,
            ghiChu,
        ],
    );

    const handleSoLuongChange = useCallback(
        (e) =>
            setSoLuong(
                Math.min(
                    soLuongMax,
                    Math.max(1, parseInt(e.target.value) || 1),
                ),
            ),
        [soLuongMax],
    );

    const handleSangChange = useCallback(
        (e) => setSang(Math.max(0, parseInt(e.target.value) || 0)),
        [],
    );
    const handleTruaChange = useCallback(
        (e) => setTrua(Math.max(0, parseInt(e.target.value) || 0)),
        [],
    );
    const handleToiChange = useCallback(
        (e) => setToi(Math.max(0, parseInt(e.target.value) || 0)),
        [],
    );

    return {
        maThuoc,
        tenThuoc,
        donViTinh,
        soLuong,
        soLuongMax,
        sang,
        trua,
        toi,
        thoiDiemDung,
        cachSuDung,
        ghiChu,
        setThoiDiemDung,
        setCachSuDung,
        setGhiChu,
        handleSoLuongChange,
        handleSangChange,
        handleTruaChange,
        handleToiChange,
        getData,
        exceedWarning,
    };
}
