/**
 * Capitalises the first character of a string.
 * @param {string} value - The input string.
 * @returns {string} Capitalised string structure.
 */
export const capitalize = (value) => {
  if (!value) return '';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

/**
 * Formats a numeric bytes quantity into a standard, readable file size string.
 * @param {number|string} bytes - The size value in bytes.
 * @returns {string} Formatted output (e.g., "4.5 MB"), or '-' if invalid.
 */
export const formatFileSize = (bytes) => {
  const numBytes = Number(bytes);
  if (numBytes === 0) return '0 Bytes';
  if (!numBytes || isNaN(numBytes)) return '-';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
