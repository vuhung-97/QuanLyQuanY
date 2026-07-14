import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import { noiTruService } from "../services/noiTruService";

export default function useLapBenhAnForm({ open, onSave: externalSave, benhAn }) {
    const [buongList, setBuongList] = useState([]);
    const [giuongList, setGiuongList] = useState([]);
    const [loadingBuong, setLoadingBuong] = useState(false);
    const [loadingGiuong, setLoadingGiuong] = useState(false);
    const [nhomBenhList, setNhomBenhList] = useState([]);

    const [maBuong, setMaBuong] = useState("");
    const [maGiuong, setMaGiuong] = useState("");
    const [maNhomBenh, setMaNhomBenh] = useState("");
    const [ngayNhapVien, setNgayNhapVien] = useState(new Date().toISOString());
    const [errors, setErrors] = useState({ ma_buong: "", ma_giuong: "" });

    const nhietDoRef = useRef(null);
    const haTamThuRef = useRef(null);
    const haTamTruongRef = useRef(null);
    const nhipTimRef = useRef(null);
    const lyDoRef = useRef(null);
    const chiTietRef = useRef(null);

    const refMap = {
        nhiet_do: nhietDoRef,
        ha_tam_thu: haTamThuRef,
        ha_tam_truong: haTamTruongRef,
        nhip_tim: nhipTimRef,
    };

    const isEdit = !!benhAn;

    const parsedChiTiet = useMemo(() => {
        if (!benhAn?.chi_tiet_benh_an) return null;
        try {
            return JSON.parse(benhAn.chi_tiet_benh_an);
        } catch {
            return null;
        }
    }, [benhAn?.chi_tiet_benh_an]);

    const defaultValues = useMemo(() => {
        if (!isEdit || !parsedChiTiet) return {};
        return {
            nhiet_do: parsedChiTiet.nhiet_do || "",
            ha_tam_thu: parsedChiTiet.ha_tam_thu || "",
            ha_tam_truong: parsedChiTiet.ha_tam_truong || "",
            nhip_tim: parsedChiTiet.nhip_tim || "",
            ly_do_nhap_vien: benhAn.ly_do_nhap_vien || "",
        };
    }, [isEdit, parsedChiTiet, benhAn]);

    const chiTietInitialValues = useMemo(() => {
        if (!isEdit || !parsedChiTiet) return null;
        return {
            benh_su: parsedChiTiet.benh_su || "",
            tien_su_ban_than: parsedChiTiet.tien_su_ban_than || "",
            tien_su_gia_dinh: parsedChiTiet.tien_su_gia_dinh || "",
            tom_tat_benh_an: parsedChiTiet.tom_tat_benh_an || "",
            chan_doan_chinh: parsedChiTiet.chan_doan_chinh || "",
            chan_doan_kem_theo: parsedChiTiet.chan_doan_kem_theo || "",
            chan_doan_phan_biet: parsedChiTiet.chan_doan_phan_biet || "",
        };
    }, [isEdit, parsedChiTiet]);

    useEffect(() => {
        if (open) {
            setLoadingBuong(true);
            const fetch = isEdit
                ? noiTruService.getBuong({ limit: 500 })
                : noiTruService.getBuongCoGiuongTrong();
            fetch
                .then((res) => setBuongList(Array.isArray(res.data) ? res.data : res.data?.data || []))
                .finally(() => setLoadingBuong(false));

            api.get("/dm_nhom_benh", { params: { limit: 500 } })
                .then((res) => setNhomBenhList(Array.isArray(res.data) ? res.data : res.data?.data || []))
                .catch(() => {});
        }
    }, [open, isEdit]);

    useEffect(() => {
        if (open) {
            if (isEdit) {
                setMaBuong(benhAn.ma_buong || "");
                setMaGiuong(benhAn.ma_giuong || "");
                setMaNhomBenh(benhAn.ma_nhom_benh || "");
                setNgayNhapVien(benhAn.ngay_nhap_vien || new Date().toISOString());
                setErrors({ ma_buong: "", ma_giuong: "" });
                if (nhietDoRef.current) nhietDoRef.current.value = defaultValues.nhiet_do || "";
                if (haTamThuRef.current) haTamThuRef.current.value = defaultValues.ha_tam_thu || "";
                if (haTamTruongRef.current) haTamTruongRef.current.value = defaultValues.ha_tam_truong || "";
                if (nhipTimRef.current) nhipTimRef.current.value = defaultValues.nhip_tim || "";
                if (lyDoRef.current) lyDoRef.current.value = defaultValues.ly_do_nhap_vien || "";
            } else {
                setMaBuong("");
                setMaGiuong("");
                setMaNhomBenh("");
                setGiuongList([]);
                setNgayNhapVien(new Date().toISOString());
                setErrors({ ma_buong: "", ma_giuong: "" });
                [
                    nhietDoRef, haTamThuRef, haTamTruongRef, nhipTimRef,
                    lyDoRef,
                ].forEach((ref) => {
                    if (ref.current) ref.current.value = "";
                });
            }
        }
    }, [open]);

    useEffect(() => {
        if (maBuong) {
            setLoadingGiuong(true);
            noiTruService.getGiuongTrong(maBuong)
                .then((res) => {
                    let list = res.data?.data || [];
                    if (isEdit && benhAn?.ma_giuong) {
                        const exists = list.some(
                            (g) => g.ma_giuong === benhAn.ma_giuong,
                        );
                        if (!exists) {
                            list = [
                                ...list,
                                {
                                    ma_giuong: benhAn.ma_giuong,
                                    ten_giuong: benhAn.ten_giuong,
                                    ma_buong: benhAn.ma_buong,
                                    trang_thai: "có người",
                                },
                            ];
                        }
                    }
                    setGiuongList(list);
                })
                .finally(() => setLoadingGiuong(false));
        } else {
            setGiuongList([]);
        }
    }, [maBuong, isEdit, benhAn?.ma_giuong, benhAn?.ten_giuong, benhAn?.ma_buong]);

    const getVal = (ref) => ref.current?.value || "";

    const handleSave = useCallback(() => {
        const newErrors = { ma_buong: "", ma_giuong: "" };
        if (!maBuong) newErrors.ma_buong = "Vui lòng chọn buồng";
        if (!maGiuong) newErrors.ma_giuong = "Vui lòng chọn giường";
        setErrors(newErrors);
        if (newErrors.ma_buong || newErrors.ma_giuong) return;

        const payload = {
            ma_buong: maBuong,
            ma_giuong: maGiuong,
            ma_nhom_benh: maNhomBenh,
            ly_do_nhap_vien: getVal(lyDoRef),
            doi_tuong: "",
            quan_ly_nguoi_benh: "",
            chi_tiet_benh_an: JSON.stringify({
                nhiet_do: getVal(nhietDoRef),
                ha_tam_thu: getVal(haTamThuRef),
                ha_tam_truong: getVal(haTamTruongRef),
                nhip_tim: getVal(nhipTimRef),
                ...(chiTietRef.current?.getValues() || {}),
            }),
            ly_do: getVal(lyDoRef),
        };
        if (!isEdit) {
            payload.ngay_nhap_vien = ngayNhapVien;
        }
        externalSave(payload);
    }, [maBuong, maGiuong, maNhomBenh, ngayNhapVien, isEdit, externalSave]);

    const selectedBuong = buongList.find((b) => b.ma_buong === maBuong) || null;
    const selectedGiuong = giuongList.find((g) => g.ma_giuong === maGiuong) || null;
    const selectedNhomBenh = nhomBenhList.find((n) => n.ma_nhom === maNhomBenh) || null;

    return {
        buongList,
        giuongList,
        nhomBenhList,
        loadingBuong,
        loadingGiuong,
        maBuong,
        maGiuong,
        maNhomBenh,
        ngayNhapVien,
        selectedBuong,
        selectedGiuong,
        selectedNhomBenh,
        setMaBuong,
        setMaGiuong,
        setMaNhomBenh,
        errors,
        refMap,
        lyDoRef,
        chiTietRef,
        handleSave,
        defaultValues,
        chiTietInitialValues,
        isEdit,
    };
}
