import { useState, useCallback } from 'react';

/**
 * Custom hook to manage open/close states for dialogs, drawers, and modal views.
 * @param {boolean} [initialState=false] - The initial visibility state.
 * @returns {Object} The state controller functions and values.
 */
export const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
};
