import { MaintenanceModel } from '@/models/maintenance.model';

/**
 * Mapper utility translating between persistence shapes and cleaner domain models.
 */
export const maintenanceMapper = {
  /**
   * Maps database maintenance rows to MaintenanceModel domain records.
   * @param {Object} raw - Persistence entity.
   * @returns {MaintenanceModel}
   */
  toDomain(raw) {
    if (!raw) return null;
    return new MaintenanceModel({
      maintenanceId: raw.maintenanceId,
      assetId: raw.assetId,
      assetCode: raw.assetCode,
      assetName: raw.assetName,
      category: raw.category,
      maintenanceType: raw.maintenanceType,
      priority: raw.priority,
      status: raw.status,
      vendor: raw.vendor,
      technician: raw.technician,
      scheduledDate: raw.scheduledDate,
      startDate: raw.startDate,
      completionDate: raw.completionDate,
      estimatedCost: raw.estimatedCost,
      actualCost: raw.actualCost,
      remarks: raw.remarks,
      createdBy: raw.createdBy,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      result: raw.result,
    });
  },

  /**
   * Maps MaintenanceModel domain records back to persistence layout structures.
   * @param {MaintenanceModel} domain - Clean domain model.
   * @returns {Object}
   */
  toPersistence(domain) {
    if (!domain) return null;
    return {
      maintenanceId: domain.maintenanceId,
      assetId: domain.assetId,
      assetCode: domain.assetCode,
      assetName: domain.assetName,
      category: domain.category,
      maintenanceType: domain.maintenanceType,
      priority: domain.priority,
      status: domain.status,
      vendor: domain.vendor,
      technician: domain.technician,
      scheduledDate: domain.scheduledDate,
      startDate: domain.startDate,
      completionDate: domain.completionDate,
      estimatedCost: domain.estimatedCost,
      actualCost: domain.actualCost,
      remarks: domain.remarks,
      createdBy: domain.createdBy,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      result: domain.result,
    };
  },
};
