import { memo, useCallback, useEffect, useState } from "react";
import DatePicker from "@/components/common/DatePicker.jsx";

const FormDatePicker = memo(function FormDatePicker({
    name,
    initialValue,
    onUpdateRef,
    onBlurSync,
    ...props
}) {
    const [value, setValue] = useState(initialValue ?? null);
    useEffect(() => {
        setValue(initialValue ?? null);
    }, [initialValue]);

    const handleChange = useCallback(
        (v) => {
            setValue(v);
            onUpdateRef(name, v);
        },
        [name, onUpdateRef],
    );

    return <DatePicker value={value} onChange={handleChange} {...props} />;
});

export default FormDatePicker;
