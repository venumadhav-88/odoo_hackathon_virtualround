/**
 * Validates whether the given string is a valid email format.
 * @param {string} value - The input value to check.
 * @returns {boolean} True if the format is correct, false otherwise.
 */
export const validateEmail = (value) => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};
