import { reportsRepository } from './reports.repository';
import { reportsMapper } from './reports.mapper';
import { logger } from '@/utils/logger';

/**
 * Service consolidating reporting calls and managing boundary exceptions.
 */
export const ReportsService = {
  /**
   * Retrieves mapped domain objects for analytics reporting.
   * @returns {Promise<Object>} Mapped assets, assignments, and maintenance logs.
   */
  async getReportData() {
    try {
      const data = await reportsRepository.getReportData();
      return reportsMapper.toDomain(data);
    } catch (error) {
      logger.error('ReportsService.getReportData execution failed:', error);
      throw error;
    }
  },
};
