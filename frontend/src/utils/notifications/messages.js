/**
 * Catalog of application-wide notification and warning statement constants.
 * Removes hardcoded feedback strings from pages and components.
 */
export const NOTIFICATION_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Successfully signed in to EAM.',
    LOGIN_FAILED: 'Authentication failed. Please check your credentials.',
    LOGOUT_SUCCESS: 'You have logged out of the system.',
  },
  ASSETS: {
    CREATE_SUCCESS: 'Asset record registered successfully.',
    UPDATE_SUCCESS: 'Asset specifications updated.',
    DELETE_SUCCESS: 'Asset record has been permanently removed.',
  },
  EMPLOYEES: {
    CREATE_SUCCESS: 'Custodian profile created in directory.',
    UPDATE_SUCCESS: 'Custodian metadata updated.',
    DELETE_SUCCESS: 'Custodian profile removed from directory.',
  },
  SYSTEM: {
    GENERIC_ERROR: 'An unexpected client error occurred. Please try again.',
    CONNECTION_LOST: 'Lost server connection. Attempting auto-reconnect...',
  },
};
