import { MOCK_MAINTENANCE } from '@/mocks/maintenance.mock';
import { assetRepository } from '../asset/asset.repository';

let maintenanceLogs = [...MOCK_MAINTENANCE];

const delay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (800 - 500 + 1)) + 500)
  );

/**
 * In-memory repository executing database simulations for EAM asset maintenance records.
 * Session-scoped: refreshes on browser page load.
 */
export const maintenanceRepository = {
  /**
   * Retrieves all maintenance records.
   * @returns {Promise<Array>} List of maintenance logs.
   */
  async getMaintenance() {
    await delay();
    return [...maintenanceLogs];
  },

  /**
   * Saves a scheduled maintenance activity.
   * Forces the associated asset's status to 'Under Maintenance'.
   * @param {Object} data - Scheduled details.
   * @returns {Promise<Object>}
   */
  async scheduleMaintenance(data) {
    await delay();

    const newRecord = {
      ...data,
      maintenanceId: `maint-${Date.now()}`,
      status: 'Scheduled',
      startDate: null,
      completionDate: null,
      actualCost: null,
      result: null,
      createdBy: 'Alex Carter',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    maintenanceLogs.unshift(newRecord);

    // Sync Asset Status to Under Maintenance
    try {
      const assetsList = await assetRepository.getAssets();
      const targetAsset = assetsList.find((a) => a.assetCode === data.assetCode);
      if (targetAsset) {
        await assetRepository.updateAsset(targetAsset.id, {
          status: 'Under Maintenance',
          assignedTo: null, // Release custodian custody if any
        });
      }
    } catch (err) {
      console.error('Failed to sync asset status on scheduleMaintenance:', err);
    }

    return newRecord;
  },

  /**
   * Marks a scheduled maintenance job as active/in-progress.
   * @param {string} id - Uniqueness identifier.
   * @returns {Promise<Object>}
   */
  async startMaintenance(id) {
    await delay();

    const index = maintenanceLogs.findIndex((m) => m.maintenanceId === id);
    if (index === -1) throw new Error('Maintenance log not found.');

    const log = maintenanceLogs[index];
    const updated = {
      ...log,
      status: 'In Progress',
      startDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };

    maintenanceLogs[index] = updated;

    // Sync Asset Status to Under Maintenance
    try {
      const assetsList = await assetRepository.getAssets();
      const targetAsset = assetsList.find((a) => a.assetCode === log.assetCode);
      if (targetAsset) {
        await assetRepository.updateAsset(targetAsset.id, {
          status: 'Under Maintenance',
          assignedTo: null,
        });
      }
    } catch (err) {
      console.error('Failed to sync asset status on startMaintenance:', err);
    }

    return updated;
  },

  /**
   * Records details of completed maintenance.
   * Synchronizes asset state dynamically based on the completion outcome result.
   * @param {string} id - Uniqueness identifier.
   * @param {Object} details - completion date, actual cost, remarks, and outcome result.
   * @returns {Promise<Object>}
   */
  async completeMaintenance(id, { completionDate, actualCost, remarks, result }) {
    await delay();

    const index = maintenanceLogs.findIndex((m) => m.maintenanceId === id);
    if (index === -1) throw new Error('Maintenance log not found.');

    const log = maintenanceLogs[index];
    const updated = {
      ...log,
      status: 'Completed',
      completionDate,
      actualCost: actualCost !== null && actualCost !== undefined ? parseFloat(actualCost) : 0,
      remarks: remarks ? `${log.remarks} | Completion remarks: ${remarks}` : log.remarks,
      result,
      updatedAt: new Date().toISOString(),
    };

    maintenanceLogs[index] = updated;

    // Sync Asset Status based on completion result
    try {
      const assetsList = await assetRepository.getAssets();
      const targetAsset = assetsList.find((a) => a.assetCode === log.assetCode);
      if (targetAsset) {
        let newAssetStatus = 'Available';
        if (result === 'Needs Follow-up') {
          newAssetStatus = 'Under Maintenance';
        } else if (result === 'Replacement Required') {
          newAssetStatus = 'Retired';
        }

        await assetRepository.updateAsset(targetAsset.id, {
          status: newAssetStatus,
          assignedTo: null,
        });
      }
    } catch (err) {
      console.error('Failed to sync asset status on completeMaintenance:', err);
    }

    return updated;
  },

  /**
   * Cancels a scheduled or in-progress maintenance activity.
   * Releases asset state back to 'Available'.
   * @param {string} id - Uniqueness identifier.
   * @returns {Promise<Object>}
   */
  async cancelMaintenance(id) {
    await delay();

    const index = maintenanceLogs.findIndex((m) => m.maintenanceId === id);
    if (index === -1) throw new Error('Maintenance log not found.');

    const log = maintenanceLogs[index];
    const updated = {
      ...log,
      status: 'Cancelled',
      remarks: `${log.remarks} | Maintenance cancelled.`,
      updatedAt: new Date().toISOString(),
    };

    maintenanceLogs[index] = updated;

    // Sync Asset Status to Available
    try {
      const assetsList = await assetRepository.getAssets();
      const targetAsset = assetsList.find((a) => a.assetCode === log.assetCode);
      if (targetAsset) {
        await assetRepository.updateAsset(targetAsset.id, {
          status: 'Available',
          assignedTo: null,
        });
      }
    } catch (err) {
      console.error('Failed to sync asset status on cancelMaintenance:', err);
    }

    return updated;
  },
};
