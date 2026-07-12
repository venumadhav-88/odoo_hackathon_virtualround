import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce value updates.
 * Prevents redundant updates (e.g. keypress triggers on API search queries).
 * @param {*} value - The input value to debounce.
 * @param {number} delay - Delay time in milliseconds.
 * @returns {*} The debounced value.
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
