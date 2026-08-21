import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import { noiTruService } from "../services/noiTruService";

const EMPTY_ERRORS = {
    ma_buong: "",
    ma_giuong: "",
    nhiet_do: "",
    ha_tam_thu: "",
    ha_tam_truong: "",
    nhip_tim: "",
};

const validateVital = (value) => {
    if (value === "") return "";
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) return "Phải là số không âm";
    return "";
};

export default function useLapBenhAnForm({ open, onSave: externalSave, benhAn, exam }) {
    const [buongList, setBuongList] = useState([]);
    const [giuongList, setGiuongList] = useState([]);
    const [loadingBuong, setLoadingBuong] = useState(false);
    const [loadingGiuong, setLoadingGiuong] = useState(false);
    const [nhomBenhList, setNhomBenhList] = useState([]);

    const [maBuong, setMaBuong] = useState("");
    const [maGiuong, setMaGiuong] = useState("");
    const [maNhomBenh, setMaNhomBenh] = useState("");
    const [ngayNhapVien, setNgayNhapVien] = useState(new Date().toISOString());
    const [errors, setErrors] = useState({ ...EMPTY_ERRORS });
    const [nhietDo, setNhietDo] = useState("");
    const [haTamThu, setHaTamThu] = useState("");
    const [haTamTruong, setHaTamTruong] = useState("");
    const [nhipTim, setNhipTim] = useState("");

    const lyDoRef = useRef(null);
    const chiTietRef = useRef(null);

    const vitalSetters = {
        nhiet_do: setNhietDo,
        ha_tam_thu: setHaTamThu,
        ha_tam_truong: setHaTamTruong,
        nhip_tim: setNhipTim,
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
        if (isEdit) {
            if (!parsedChiTiet) return null;
            return {
                benh_su: parsedChiTiet.benh_su || "",
                tien_su_ban_than: parsedChiTiet.tien_su_ban_than || "",
                tien_su_gia_dinh: parsedChiTiet.tien_su_gia_dinh || "",
                tom_tat_benh_an: parsedChiTiet.tom_tat_benh_an || "",
                chan_doan_chinh: parsedChiTiet.chan_doan_chinh || "",
                chan_doan_kem_theo: parsedChiTiet.chan_doan_kem_theo || "",
                chan_doan_phan_biet: parsedChiTiet.chan_doan_phan_biet || "",
            };
        }
        if (!exam) return null;
        return { chan_doan_chinh: exam.chan_doan || "" };
    }, [isEdit, parsedChiTiet, exam]);

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
                setErrors({ ...EMPTY_ERRORS });
                setNhietDo(defaultValues.nhiet_do || "");
                setHaTamThu(defaultValues.ha_tam_thu || "");
                setHaTamTruong(defaultValues.ha_tam_truong || "");
                setNhipTim(defaultValues.nhip_tim || "");
                if (lyDoRef.current) lyDoRef.current.value = defaultValues.ly_do_nhap_vien || "";
            } else {
                setMaBuong("");
                setMaGiuong("");
                setMaNhomBenh(exam?.ma_nhom_benh || "");
                setGiuongList([]);
                setNgayNhapVien(new Date().toISOString());
                setErrors({ ...EMPTY_ERRORS });
                setNhietDo("");
                setHaTamThu("");
                setHaTamTruong("");
                setNhipTim("");
                if (lyDoRef.current) lyDoRef.current.value = "";
            }
        }
        }, [open, exam]);

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

    const onVitalChange = useCallback((name, value) => {
        vitalSetters[name]?.(value);
        setErrors((prev) => ({ ...prev, [name]: validateVital(value) }));
    }, []);

    const getVal = (ref) => ref.current?.value || "";

    const handleSave = useCallback(() => {
        const newErrors = { ...EMPTY_ERRORS };
        if (!maBuong) newErrors.ma_buong = "Vui lòng chọn buồng";
        if (!maGiuong) newErrors.ma_giuong = "Vui lòng chọn giường";
        newErrors.nhiet_do = validateVital(nhietDo);
        newErrors.ha_tam_thu = validateVital(haTamThu);
        newErrors.ha_tam_truong = validateVital(haTamTruong);
        newErrors.nhip_tim = validateVital(nhipTim);
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        const payload = {
            ma_buong: maBuong,
            ma_giuong: maGiuong,
            ma_nhom_benh: maNhomBenh,
            ly_do_nhap_vien: getVal(lyDoRef),
            doi_tuong: "",
            quan_ly_nguoi_benh: "",
            chi_tiet_benh_an: JSON.stringify({
                nhiet_do: nhietDo,
                ha_tam_thu: haTamThu,
                ha_tam_truong: haTamTruong,
                nhip_tim: nhipTim,
                ...(chiTietRef.current?.getValues() || {}),
            }),
            ly_do: getVal(lyDoRef),
        };
        if (!isEdit) {
            payload.ngay_nhap_vien = ngayNhapVien;
        }
        externalSave(payload);
    }, [maBuong, maGiuong, maNhomBenh, ngayNhapVien, nhietDo, haTamThu, haTamTruong, nhipTim, isEdit, externalSave]);

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
        vitalValues: { nhiet_do: nhietDo, ha_tam_thu: haTamThu, ha_tam_truong: haTamTruong, nhip_tim: nhipTim },
        onVitalChange,
        lyDoRef,
        chiTietRef,
        handleSave,
        defaultValues,
        chiTietInitialValues,
        isEdit,
    };
}
