import { useRef, useImperativeHandle } from "react";

export default function useFormTab(initialData, ref) {
    const dataRef = useRef({ ...initialData });

    useImperativeHandle(
        ref,
        () => ({
            getData: () => ({ ...dataRef.current }),
        }),
        [],
    );

    return { dataRef };
}
