import { useState, useEffect } from "react";

/**
 * useDebounce
 * @param value - the value we want to debounce
 * @param delay - delay in milliseconds (default 300ms)
 * @returns debouncedValue - the value updated only after the delay
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup – if value changes before the timeout, cancel the previous timeout
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
