import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

export default function useChuyenTuyenForm({ open, giayGt, diTuyen, onSave }) {
    const formRef = useRef({});
    const settersRef = useRef({});
    const [tenBenhVien, setTenBenhVien] = useState("");
    const [yKienDeNghi, setYKienDeNghi] = useState("");
    const [ngayDi, setNgayDi] = useState(null);
    const [thoiGianDen, setThoiGianDen] = useState(null);
    const [chanDoan, setChanDoan] = useState("");
    const [quyetDinhYSinh, setQuyetDinhYSinh] = useState("");
    const [ngayVe, setNgayVe] = useState(null);
    const [chanDoanLucVe, setChanDoanLucVe] = useState("");
    const [ketQuaDieuTri, setKetQuaDieuTri] = useState("");

    useEffect(() => {
        const s = settersRef.current;
        s.tenBenhVien = setTenBenhVien;
        s.yKienDeNghi = setYKienDeNghi;
        s.ngayDi = setNgayDi;
        s.thoiGianDen = setThoiGianDen;
        s.chanDoan = setChanDoan;
        s.quyetDinhYSinh = setQuyetDinhYSinh;
        s.ngayVe = setNgayVe;
        s.chanDoanLucVe = setChanDoanLucVe;
        s.ketQuaDieuTri = setKetQuaDieuTri;
    }, []);

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
        setNgayDi(data.ngayDi);
        setThoiGianDen(data.thoiGianDen);
        setChanDoan(data.chanDoan);
        setQuyetDinhYSinh(data.quyetDinhYSinh);
        setNgayVe(data.ngayVe);
        setChanDoanLucVe(data.chanDoanLucVe);
        setKetQuaDieuTri(data.ketQuaDieuTri);
    }, [open, giayGt, diTuyen]);

    const updateField = useCallback((name, value) => {
        formRef.current[name] = value;
        settersRef.current[name]?.(value);
    }, []);

    const blurSync = updateField;

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
        tenBenhVien,
        yKienDeNghi,
        ngayDi,
        thoiGianDen,
        chanDoan,
        quyetDinhYSinh,
        ngayVe,
        chanDoanLucVe,
        ketQuaDieuTri,
        updateField,
        blurSync,
        handleSave,
    };
}
