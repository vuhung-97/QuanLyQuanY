import { useCallback, useImperativeHandle, useState } from "react";

export default function useFormTab(initialData, ref) {
    const [data, setData] = useState({ ...initialData });

    useImperativeHandle(
        ref,
        () => ({
            getData: () => ({ ...data }),
        }),
        [data],
    );

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    }, []);

    return { data, handleChange };
}
