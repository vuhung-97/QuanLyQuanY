import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

export default function useChuyenTuyenForm({ open, giayGt, diTuyen, onSave }) {
    const formRef = useRef({});
    const [tenBenhVien, setTenBenhVien] = useState("");
    const [yKienDeNghi, setYKienDeNghi] = useState("");

    useEffect(() => {
        if (!open) return;
        const data = {
            tenBenhVien: giayGt?.ten_benh_vien || "",
            yKienDeNghi: giayGt?.y_kien_de_nghi || "",
            ngayDi: diTuyen?.ngay_di ? dayjs(diTuyen.ngay_di) : null,
            thoiGianDen: giayGt?.thoi_gian_den_benh_vien
                ? dayjs(giayGt.thoi_gian_den_benh_vien)
                : null,
            chanDoan: giayGt?.chan_doan || "",
            quyetDinhYSinh: giayGt?.quyet_dinh_y_sinh || "",
            ngayVe: diTuyen?.ngay_ve ? dayjs(diTuyen.ngay_ve) : null,
            chanDoanLucVe: diTuyen?.chan_doan_luc_ve || "",
            ketQuaDieuTri: diTuyen?.ket_qua_huong_dieu_tri || "",
        };
        formRef.current = data;
        setTenBenhVien(data.tenBenhVien);
        setYKienDeNghi(data.yKienDeNghi);
    }, [open, giayGt, diTuyen]);

    const updateField = useCallback((name, value) => {
        formRef.current[name] = value;
    }, []);

    const blurSync = useCallback((name, value) => {
        formRef.current[name] = value;
        if (name === "tenBenhVien") setTenBenhVien(value);
        if (name === "yKienDeNghi") setYKienDeNghi(value);
    }, []);

    const isNew = !giayGt?.ma_giay_gt;

    const handleSave = useCallback(() => {
        const d = formRef.current;
        const giayData = {
            ten_benh_vien: d.tenBenhVien,
            y_kien_de_nghi: d.yKienDeNghi,
            thoi_gian_den_benh_vien: d.thoiGianDen?.toISOString?.() || null,
            chan_doan: d.chanDoan,
            quyet_dinh_y_sinh: d.quyetDinhYSinh,
        };
        const diTuyenData = {};
        if (d.ngayDi) diTuyenData.ngay_di = d.ngayDi.format("YYYY-MM-DD");
        if (d.ngayVe) diTuyenData.ngay_ve = d.ngayVe.format("YYYY-MM-DD");
        if (d.chanDoanLucVe) diTuyenData.chan_doan_luc_ve = d.chanDoanLucVe;
        if (d.ketQuaDieuTri) diTuyenData.ket_qua_huong_dieu_tri = d.ketQuaDieuTri;
        onSave(giayData, diTuyenData);
    }, [onSave]);

    return {
        formRef,
        tenBenhVien,
        yKienDeNghi,
        updateField,
        blurSync,
        handleSave,
        isNew,
    };
}
