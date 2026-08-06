import { useImperativeHandle, useRef } from "react";
import { calcBmi } from "@/components/KhamSucKhoe/KhamSucKhoeUtils.js";

export default function useTongQuanTab(initialData, ref) {
    const dataRef = useRef({ ...initialData });

    useImperativeHandle(
        ref,
        () => ({
            getData: () => {
                const data = { ...dataRef.current };
                data.bmi = calcBmi(data.chieu_cao, data.can_nang);
                return data;
            },
        }),
        [],
    );

    return {
        dataRef,
    };
}
