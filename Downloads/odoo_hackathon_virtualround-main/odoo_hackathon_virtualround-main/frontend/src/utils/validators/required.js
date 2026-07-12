/**
 * Validates whether the given value is present and non-empty.
 * @param {*} value - The input value to check.
 * @returns {boolean} True if the value is present and not empty, false otherwise.
 */
export const validateRequired = (value) => {
  return value !== undefined && value !== null && String(value).trim() !== '';
};
