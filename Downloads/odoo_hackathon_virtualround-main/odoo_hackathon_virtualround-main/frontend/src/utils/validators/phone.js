/**
 * Validates whether the given string is a valid phone number.
 * Supports basic E.164 international formats and standard 10 digit North American layouts.
 * @param {string} value - The input value to check.
 * @returns {boolean} True if the format is correct, false otherwise.
 */
export const validatePhone = (value) => {
  if (!value) return false;
  return /^\+?[1-9]\d{1,14}$/.test(value) || /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
};
