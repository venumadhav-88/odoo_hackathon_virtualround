import { MOCK_SETTINGS } from '@/mocks/settings.mock';

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

let currentSettings = deepCopy(MOCK_SETTINGS);

const delay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (500 - 300 + 1)) + 300)
  );

/**
 * Repository managing administration parameters in-memory with delay simulations.
 */
export const settingsRepository = {
  /**
   * Reads active configurations.
   * @returns {Promise<Object>}
   */
  async getSettings() {
    await delay();
    return deepCopy(currentSettings);
  },

  /**
   * Persists partial config changes.
   * @param {Object} updated
   * @returns {Promise<Object>}
   */
  async updateSettings(updated) {
    await delay();
    currentSettings = {
      ...currentSettings,
      ...updated,
      profile: {
        ...currentSettings.profile,
        ...(updated.profile || {}),
      },
      general: {
        ...currentSettings.general,
        ...(updated.general || {}),
      },
      notifications: {
        ...currentSettings.notifications,
        ...(updated.notifications || {}),
      },
      security: {
        ...currentSettings.security,
        ...(updated.security || {}),
      },
    };
    return deepCopy(currentSettings);
  },

  /**
   * Resets configuration states back to factory presets.
   * @returns {Promise<Object>}
   */
  async resetSettings() {
    await delay();
    currentSettings = deepCopy(MOCK_SETTINGS);
    return deepCopy(currentSettings);
  },
};
