/**
 * Domain model class representing an EAM asset maintenance log entry.
 */
export class MaintenanceModel {
  /**
   * @param {Object} [params={}]
   */
  constructor({
    maintenanceId = '',
    assetId = '',
    assetCode = '',
    assetName = '',
    category = '',
    maintenanceType = 'Preventive',
    priority = 'Medium',
    status = 'Scheduled',
    vendor = '',
    technician = '',
    scheduledDate = '',
    startDate = null,
    completionDate = null,
    estimatedCost = 0,
    actualCost = null,
    remarks = '',
    createdBy = '',
    createdAt = '',
    updatedAt = '',
    result = null,
  } = {}) {
    this.maintenanceId = maintenanceId;
    this.assetId = assetId;
    this.assetCode = assetCode;
    this.assetName = assetName;
    this.category = category;
    this.maintenanceType = maintenanceType;
    this.priority = priority;
    this.status = status;
    this.vendor = vendor;
    this.technician = technician;
    this.scheduledDate = scheduledDate;
    this.startDate = startDate;
    this.completionDate = completionDate;
    this.estimatedCost = estimatedCost;
    this.actualCost = actualCost;
    this.remarks = remarks;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.result = result;
  }
}
