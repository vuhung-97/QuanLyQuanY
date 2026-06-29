import { useCallback, useEffect, useRef, useState } from "react";
import { noiTruService } from "../services/noiTruService";

export default function useLapBenhAnForm({ open, onSave: externalSave }) {
    const [buongList, setBuongList] = useState([]);
    const [giuongList, setGiuongList] = useState([]);
    const [loadingBuong, setLoadingBuong] = useState(false);
    const [loadingGiuong, setLoadingGiuong] = useState(false);

    const [maBuong, setMaBuong] = useState("");
    const [maGiuong, setMaGiuong] = useState("");
    const [ngayNhapVien, setNgayNhapVien] = useState(new Date().toISOString());
    const [errors, setErrors] = useState({ ma_buong: "", ma_giuong: "" });

    const nhietDoRef = useRef(null);
    const haTamThuRef = useRef(null);
    const haTamTruongRef = useRef(null);
    const nhipTimRef = useRef(null);
    const lyDoRef = useRef(null);

    const refMap = {
        nhiet_do: nhietDoRef,
        ha_tam_thu: haTamThuRef,
        ha_tam_truong: haTamTruongRef,
        nhip_tim: nhipTimRef,
    };

    useEffect(() => {
        if (open) {
            setLoadingBuong(true);
            noiTruService.getBuong({ limit: 100 })
                .then((res) => setBuongList(Array.isArray(res.data) ? res.data : res.data?.data || []))
                .finally(() => setLoadingBuong(false));
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            setMaBuong("");
            setMaGiuong("");
            setGiuongList([]);
            setNgayNhapVien(new Date().toISOString());
            setErrors({ ma_buong: "", ma_giuong: "" });
            [nhietDoRef, haTamThuRef, haTamTruongRef, nhipTimRef, lyDoRef].forEach((ref) => {
                if (ref.current) ref.current.value = "";
            });
        }
    }, [open]);

    useEffect(() => {
        if (maBuong) {
            setLoadingGiuong(true);
            noiTruService.getGiuongTrong(maBuong)
                .then((res) => setGiuongList(res.data?.data || []))
                .finally(() => setLoadingGiuong(false));
        } else {
            setGiuongList([]);
        }
    }, [maBuong]);

    const handleSave = useCallback(() => {
        const newErrors = { ma_buong: "", ma_giuong: "" };
        if (!maBuong) newErrors.ma_buong = "Vui lòng chọn buồng";
        if (!maGiuong) newErrors.ma_giuong = "Vui lòng chọn giường";
        setErrors(newErrors);
        if (newErrors.ma_buong || newErrors.ma_giuong) return;

        externalSave({
            ma_buong: maBuong,
            ma_giuong: maGiuong,
            ngay_nhap_vien: ngayNhapVien,
            ly_do_nhap_vien: "",
            doi_tuong: "",
            quan_ly_nguoi_benh: "",
            chi_tiet_benh_an: "",
            nhiet_do: nhietDoRef.current?.value || "",
            ha_tam_thu: haTamThuRef.current?.value || "",
            ha_tam_truong: haTamTruongRef.current?.value || "",
            nhip_tim: nhipTimRef.current?.value || "",
            ly_do: lyDoRef.current?.value || "",
        });
    }, [maBuong, maGiuong, ngayNhapVien, externalSave]);

    const selectedBuong = buongList.find((b) => b.ma_buong === maBuong) || null;
    const selectedGiuong = giuongList.find((g) => g.ma_giuong === maGiuong) || null;

    return {
        buongList,
        giuongList,
        loadingBuong,
        loadingGiuong,
        maBuong,
        maGiuong,
        ngayNhapVien,
        selectedBuong,
        selectedGiuong,
        setMaBuong,
        setMaGiuong,
        errors,
        refMap,
        nhietDoRef,
        haTamThuRef,
        haTamTruongRef,
        nhipTimRef,
        lyDoRef,
        handleSave,
    };
}
