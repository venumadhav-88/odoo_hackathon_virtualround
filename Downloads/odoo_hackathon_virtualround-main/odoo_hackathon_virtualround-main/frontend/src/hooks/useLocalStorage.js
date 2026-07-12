import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

/**
 * Custom hook to synchronise React states with LocalStorage entries.
 * @param {string} key - The key for storage write-reads.
 * @param {*} initialValue - Fallback value if storage is empty.
 * @returns {Array} Stateful value and its setting function.
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error('Failed to parse localStorage key:', key, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      logger.error('Failed to save to localStorage key:', key, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};
