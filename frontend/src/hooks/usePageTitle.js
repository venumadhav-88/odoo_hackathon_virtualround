import { useEffect } from 'react';
import { APP_CONFIG } from '@/config/app';

/**
 * Custom hook to dynamically modify the browser document title.
 * Resets the document title to its original value on component unmount.
 * @param {string} title - The page title segment to set.
 */
export const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${APP_CONFIG.NAME}` : APP_CONFIG.NAME;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
