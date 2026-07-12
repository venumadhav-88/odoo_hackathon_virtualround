import { assetRepository } from '../asset/asset.repository';
import { assignmentRepository } from '../assignment/assignment.repository';
import { maintenanceRepository } from '../maintenance/maintenance.repository';

const delay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (800 - 500 + 1)) + 500)
  );

/**
 * Repository consolidating asset, custody, and servicing records into a single reports dataset.
 * Includes artificial delay to simulate network requests.
 */
export const reportsRepository = {
  /**
   * Fetches consolidated audit logs from active data stores.
   * @returns {Promise<Object>} Aggregated datasets.
   */
  async getReportData() {
    await delay();

    const [assets, assignments, maintenance] = await Promise.all([
      assetRepository.getAssets(),
      assignmentRepository.getAssignments(),
      maintenanceRepository.getMaintenance(),
    ]);

    return {
      assets,
      assignments,
      maintenance,
    };
  },
};
