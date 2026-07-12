/**
 * Formats an ISO date string or Date object into a short localized date.
 * @param {string|Date} value - The date value to format.
 * @param {string} [locale='en-US'] - The locale identifier.
 * @returns {string} Formatted date label, or '-' if invalid.
 */
export const formatDate = (value, locale = 'en-US') => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Formats an ISO date string or Date object into a localized date and time.
 * @param {string|Date} value - The datetime value to format.
 * @param {string} [locale='en-US'] - The locale identifier.
 * @returns {string} Formatted datetime label, or '-' if invalid.
 */
export const formatDatetime = (value, locale = 'en-US') => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString(locale, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
