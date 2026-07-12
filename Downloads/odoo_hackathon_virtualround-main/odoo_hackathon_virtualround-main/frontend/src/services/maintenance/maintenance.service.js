import { maintenanceRepository } from './maintenance.repository';
import { maintenanceMapper } from './maintenance.mapper';
import { notify } from '@/utils/notifications';
import { logger } from '@/utils/logger';

/**
 * Service layer coordinating Asset Maintenance CRUD requests and toast feedback.
 */
export const MaintenanceService = {
  /**
   * Fetches all maintenance logs mapped to domain models.
   * @returns {Promise<MaintenanceModel[]>}
   */
  async getMaintenance() {
    try {
      const data = await maintenanceRepository.getMaintenance();
      return data.map(maintenanceMapper.toDomain);
    } catch (error) {
      logger.error('MaintenanceService.getMaintenance failed:', error);
      notify.error('Failed to load maintenance records.');
      throw error;
    }
  },

  /**
   * Schedules a new maintenance job.
   * @param {Object} formData - Raw form data fields.
   * @returns {Promise<MaintenanceModel>}
   */
  async scheduleMaintenance(formData) {
    try {
      const data = await maintenanceRepository.scheduleMaintenance(formData);
      notify.success('Maintenance scheduled successfully.');
      return maintenanceMapper.toDomain(data);
    } catch (error) {
      logger.error('MaintenanceService.scheduleMaintenance failed:', error);
      const message = error.message || 'Failed to schedule maintenance.';
      notify.error(message);
      throw new Error(message);
    }
  },

  /**
   * Transition maintenance status to 'In Progress'.
   * @param {string} id - Uniqueness identifier.
   * @returns {Promise<MaintenanceModel>}
   */
  async startMaintenance(id) {
    try {
      const data = await maintenanceRepository.startMaintenance(id);
      notify.success('Maintenance job started successfully.');
      return maintenanceMapper.toDomain(data);
    } catch (error) {
      logger.error('MaintenanceService.startMaintenance failed:', error);
      const message = error.message || 'Failed to start maintenance.';
      notify.error(message);
      throw new Error(message);
    }
  },

  /**
   * Records completion attributes for active maintenance.
   * @param {string} id - Uniqueness identifier.
   * @param {Object} details - completionDate, actualCost, remarks, result.
   * @returns {Promise<MaintenanceModel>}
   */
  async completeMaintenance(id, details) {
    try {
      const data = await maintenanceRepository.completeMaintenance(id, details);
      notify.success('Maintenance logged as completed.');
      return maintenanceMapper.toDomain(data);
    } catch (error) {
      logger.error('MaintenanceService.completeMaintenance failed:', error);
      const message = error.message || 'Failed to complete maintenance.';
      notify.error(message);
      throw new Error(message);
    }
  },

  /**
   * Cancels maintenance scheduling.
   * @param {string} id - Uniqueness identifier.
   * @returns {Promise<MaintenanceModel>}
   */
  async cancelMaintenance(id) {
    try {
      const data = await maintenanceRepository.cancelMaintenance(id);
      notify.success('Maintenance cancelled successfully.');
      return maintenanceMapper.toDomain(data);
    } catch (error) {
      logger.error('MaintenanceService.cancelMaintenance failed:', error);
      const message = error.message || 'Failed to cancel maintenance.';
      notify.error(message);
      throw new Error(message);
    }
  },
};
