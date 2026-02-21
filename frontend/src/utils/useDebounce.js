import { useState, useEffect } from "react";

const useDebounce = (value, delay=300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        if(typeof delay != 'function'){
            return;
        }
        const handler = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(handler)
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;