import { authRepository } from './auth.repository';
import { notify } from '@/utils/notifications';
import { logger } from '@/utils/logger';

/**
 * Service orchestrating authentication logic flows.
 * Communicates strictly with authRepository and maps user messages.
 */
export const AuthService = {
  /**
   * Logs in a user.
   * @param {string} email - Input email.
   * @param {string} password - Input password.
   * @returns {Promise<Object>} Authenticated user data structure.
   */
  async login(email, password) {
    try {
      const response = await authRepository.login(email, password);
      notify.success('Successfully logged in.');
      return response;
    } catch (error) {
      logger.error('AuthService login execution failed:', error);
      const displayMessage = error.message || 'Authentication failed. Please verify your credentials.';
      notify.error(displayMessage);
      throw new Error(displayMessage);
    }
  },

  /**
   * Dispatches reset password instructions.
   * @param {string} email - Custodian email address.
   * @returns {Promise<Object>} Operation confirmation.
   */
  async forgotPassword(email) {
    try {
      const response = await authRepository.forgotPassword(email);
      notify.success('Password reset link sent to your email.');
      return response;
    } catch (error) {
      logger.error('AuthService forgotPassword execution failed:', error);
      const displayMessage = 'Failed to submit recovery request.';
      notify.error(displayMessage);
      throw new Error(displayMessage);
    }
  },

  /**
   * Confirms password replacement.
   * @param {string} password - New credential password.
   * @returns {Promise<Object>} Operation confirmation.
   */
  async resetPassword(password) {
    try {
      const response = await authRepository.resetPassword(password);
      notify.success('Your password has been reset successfully.');
      return response;
    } catch (error) {
      logger.error('AuthService resetPassword execution failed:', error);
      const displayMessage = 'Failed to reset password.';
      notify.error(displayMessage);
      throw new Error(displayMessage);
    }
  },

  /**
   * Dispatches logout signals.
   * @returns {Promise<Object>} Confirmation state.
   */
  async logout() {
    try {
      const response = await authRepository.logout();
      notify.success('You have successfully logged out.');
      return response;
    } catch (error) {
      logger.error('AuthService logout execution failed:', error);
      const displayMessage = 'Failed to complete logout action.';
      notify.error(displayMessage);
      throw new Error(displayMessage);
    }
  },
};
