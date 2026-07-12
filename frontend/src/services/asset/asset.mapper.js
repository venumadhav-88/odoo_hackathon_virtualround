import { AssetModel } from '@/models/asset.model';

/**
 * Mapper decoupling repository row shapes from AssetModel domain objects.
 */
export const assetMapper = {
  /**
   * Converts a raw repository record to an AssetModel instance.
   * @param {Object} raw - Repository row.
   * @returns {AssetModel} Domain model.
   */
  toDomain(raw) {
    if (!raw) return null;
    return new AssetModel({
      id: raw.id,
      assetCode: raw.assetCode,
      assetName: raw.assetName,
      category: raw.category,
      serialNumber: raw.serialNumber,
      assignedTo: raw.assignedTo || null,
      purchaseDate: raw.purchaseDate,
      purchaseCost: raw.purchaseCost ?? 0,
      status: raw.status || 'available',
      location: raw.location,
      manufacturer: raw.manufacturer,
      warrantyExpiry: raw.warrantyExpiry,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  },

  /**
   * Converts an AssetModel or form data to a persistence-layer object.
   * @param {Object} domain - Domain model or form values.
   * @returns {Object} Persistence-ready structure.
   */
  toPersistence(domain) {
    if (!domain) return null;
    return {
      id: domain.id,
      assetCode: domain.assetCode?.trim() || '',
      assetName: domain.assetName?.trim() || '',
      category: domain.category?.trim() || '',
      serialNumber: domain.serialNumber?.trim() || '',
      assignedTo: domain.assignedTo?.trim() || null,
      purchaseDate: domain.purchaseDate || '',
      purchaseCost: Number(domain.purchaseCost) || 0,
      status: domain.status || 'available',
      location: domain.location?.trim() || '',
      manufacturer: domain.manufacturer?.trim() || '',
      warrantyExpiry: domain.warrantyExpiry || '',
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  },
};
