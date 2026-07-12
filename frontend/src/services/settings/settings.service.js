import { settingsRepository } from './settings.repository';
import { settingsMapper } from './settings.mapper';
import { notify } from '@/utils/notifications';
import { logger } from '@/utils/logger';

/**
 * Service orchestrating application setting modifications, toast alerts, and logging.
 */
export const SettingsService = {
  /**
   * Reads settings mapped to domain.
   * @returns {Promise<SettingsModel>}
   */
  async getSettings() {
    try {
      const data = await settingsRepository.getSettings();
      return settingsMapper.toDomain(data);
    } catch (error) {
      logger.error('SettingsService.getSettings execution failed:', error);
      notify.error('Failed to load settings parameters.');
      throw error;
    }
  },

  /**
   * Persists preferences and triggers success notifications.
   * @param {Object} data - Updated settings object.
   * @returns {Promise<SettingsModel>}
   */
  async updateSettings(data) {
    try {
      const updated = await settingsRepository.updateSettings(data);
      if (data.profile) {
        notify.success('Profile Updated');
      } else {
        notify.success('Settings Saved');
      }
      return settingsMapper.toDomain(updated);
    } catch (error) {
      logger.error('SettingsService.updateSettings execution failed:', error);
      notify.error('Failed to save preferences.');
      throw error;
    }
  },

  /**
   * Restores system options to factory defaults.
   * @returns {Promise<SettingsModel>}
   */
  async resetSettings() {
    try {
      const data = await settingsRepository.resetSettings();
      notify.success('Settings Reset');
      return settingsMapper.toDomain(data);
    } catch (error) {
      logger.error('SettingsService.resetSettings execution failed:', error);
      notify.error('Failed to reset settings.');
      throw error;
    }
  },
};
