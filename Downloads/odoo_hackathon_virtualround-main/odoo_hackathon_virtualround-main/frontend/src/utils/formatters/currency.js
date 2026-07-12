/**
 * Formats a numeric value into a localized currency string structure.
 * @param {number|string} value - The numeric amount to format.
 * @param {string} [currency='USD'] - The ISO currency code.
 * @param {string} [locale='en-US'] - The locale identifier.
 * @returns {string} The formatted currency label, or '-' if invalid.
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (value === null || value === undefined || isNaN(Number(value))) return '-';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(value));
};
