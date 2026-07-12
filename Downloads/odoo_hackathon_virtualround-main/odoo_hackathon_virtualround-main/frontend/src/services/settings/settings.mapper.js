import { SettingsModel } from '@/models/settings.model';

/**
 * Mapper formatting settings configurations to/from domain models.
 */
export const settingsMapper = {
  /**
   * Maps raw data to SettingsModel.
   * @param {Object} raw
   * @returns {SettingsModel}
   */
  toDomain(raw) {
    if (!raw) return null;
    return new SettingsModel(raw);
  },

  /**
   * Maps SettingsModel back to persistence structure.
   * @param {SettingsModel} domain
   * @returns {Object}
   */
  toPersistence(domain) {
    if (!domain) return null;
    return {
      profile: domain.profile,
      general: domain.general,
      notifications: domain.notifications,
      security: domain.security,
      systemInfo: domain.systemInfo,
      about: domain.about,
    };
  },
};
