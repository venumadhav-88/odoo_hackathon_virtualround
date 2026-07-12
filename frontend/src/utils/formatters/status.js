/**
 * Formats a snake_case status string into a readable capitalized spaced title.
 * @param {string} value - The input status identifier.
 * @returns {string} Formatted label (e.g. "Under Maintenance"), or '-' if empty.
 */
export const formatStatus = (value) => {
  if (!value) return '-';
  return String(value)
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
