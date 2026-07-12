import { CategoryModel } from '@/models/category.model';

/**
 * Mapper separating REST payload entities from clean domain data objects.
 */
export const categoryMapper = {
  /**
   * Maps raw repository outputs to domain models.
   * @param {Object} raw - Repository category row structure.
   * @returns {CategoryModel} Standard domain category model.
   */
  toDomain(raw) {
    if (!raw) return null;
    return new CategoryModel({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      assetCount: raw.assetCount ?? 0,
      status: raw.status || 'active',
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  },

  /**
   * Maps domain models back to persistence layouts.
   * @param {CategoryModel} domain - Domain category model.
   * @returns {Object} Output repository model structure.
   */
  toPersistence(domain) {
    if (!domain) return null;
    return {
      id: domain.id,
      code: domain.code?.trim() || '',
      name: domain.name?.trim() || '',
      description: domain.description?.trim() || '',
      assetCount: domain.assetCount ?? 0,
      status: domain.status || 'active',
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  },
};
