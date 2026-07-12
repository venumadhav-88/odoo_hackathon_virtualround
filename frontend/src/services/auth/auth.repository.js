/**
 * Mock repository simulating database connections for credential checks.
 * Returns async Promises resolving after a random delay of 500-800ms.
 */
export const authRepository = {
  /**
   * Simulates authentication checks in database repository.
   * @param {string} email - Input email.
   * @param {string} password - Input password.
   * @returns {Promise<Object>} User details payload.
   */
  login(email, password) {
    return new Promise((resolve, reject) => {
      const delay = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
      setTimeout(() => {
        if (email === 'admin@eam.local' && password === 'Admin@123') {
          resolve({
            success: true,
            user: {
              email: 'admin@eam.local',
              name: 'Alex Carter',
              role: 'Administrator',
            },
            token: 'mock-eam-token-id',
          });
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, delay);
    });
  },

  /**
   * Simulates dispatching reset instructions.
   * @param {string} _email - Custodian email address (prefixed with _ since unused in mock).
   * @returns {Promise<Object>} Status message confirmation.
   */
  forgotPassword(_email) {
    return new Promise((resolve) => {
      const delay = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password reset link has been dispatched to your email.',
        });
      }, delay);
    });
  },

  /**
   * Simulates database password replacement.
   * @param {string} _password - New credential password string (prefixed with _ since unused in mock).
   * @returns {Promise<Object>} Success state confirmation.
   */
  resetPassword(_password) {
    return new Promise((resolve) => {
      const delay = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password updated successfully.',
        });
      }, delay);
    });
  },

  /**
   * Simulates session deletion procedures.
   * @returns {Promise<Object>} Logout confirmation.
   */
  logout() {
    return new Promise((resolve) => {
      const delay = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
      setTimeout(() => {
        resolve({ success: true });
      }, delay);
    });
  },
};
