import toast from 'react-hot-toast';

/**
 * Custom notification client wrapper enclosing react-hot-toast.
 * Enforces uniform toast design throughout the EAM client app.
 */
export const notify = {
  /**
   * Triggers a success notification message.
   * @param {string} message - Notification text.
   * @returns {string} Toast ID.
   */
  success: (message) => toast.success(message),

  /**
   * Triggers an error notification message.
   * @param {string} message - Notification text.
   * @returns {string} Toast ID.
   */
  error: (message) => toast.error(message),

  /**
   * Triggers an informational notification message.
   * @param {string} message - Notification text.
   * @returns {string} Toast ID.
   */
  info: (message) => toast(message, { icon: 'ℹ️' }),

  /**
   * Triggers a warning notification message.
   * @param {string} message - Notification text.
   * @returns {string} Toast ID.
   */
  warning: (message) => toast(message, { icon: '⚠️' }),
};
