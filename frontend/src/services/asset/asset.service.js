import { assetRepository } from './asset.repository';
import { assetMapper } from './asset.mapper';
import { notify } from '@/utils/notifications';
import { logger } from '@/utils/logger';

/**
 * Service layer for asset management operations.
 * Connects UI to the repository and normalises responses into domain models.
 */
export const AssetService = {
  /**
   * Retrieves all assets mapped to AssetModel instances.
   * @returns {Promise<AssetModel[]>}
   */
  async getAssets() {
    try {
      const data = await assetRepository.getAssets();
      return data.map(assetMapper.toDomain);
    } catch (error) {
      logger.error('AssetService.getAssets failed:', error);
      notify.error('Failed to load assets.');
      throw error;
    }
  },

  /**
   * Creates a new asset.
   * @param {Object} formData - Raw form values.
   * @returns {Promise<AssetModel>} Created asset domain model.
   */
  async createAsset(formData) {
    try {
      const persisted = assetMapper.toPersistence(formData);
      const data = await assetRepository.createAsset(persisted);
      notify.success('Asset created successfully.');
      return assetMapper.toDomain(data);
    } catch (error) {
      logger.error('AssetService.createAsset failed:', error);
      const message = error.message || 'Failed to create asset.';
      notify.error(message);
      throw new Error(message);
    }
  },

  /**
   * Updates an existing asset.
   * @param {string} id - Asset identifier.
   * @param {Object} formData - Updated form values.
   * @returns {Promise<AssetModel>} Updated asset domain model.
   */
  async updateAsset(id, formData) {
    try {
      const persisted = assetMapper.toPersistence(formData);
      const data = await assetRepository.updateAsset(id, persisted);
      notify.success('Asset updated successfully.');
      return assetMapper.toDomain(data);
    } catch (error) {
      logger.error('AssetService.updateAsset failed:', error);
      const message = error.message || 'Failed to update asset.';
      notify.error(message);
      throw new Error(message);
    }
  },

  /**
   * Deletes an asset by ID.
   * @param {string} id - Asset identifier.
   * @returns {Promise<AssetModel>} Deleted asset domain model.
   */
  async deleteAsset(id) {
    try {
      const data = await assetRepository.deleteAsset(id);
      notify.success('Asset deleted successfully.');
      return assetMapper.toDomain(data);
    } catch (error) {
      logger.error('AssetService.deleteAsset failed:', error);
      const message = error.message || 'Failed to delete asset.';
      notify.error(message);
      throw new Error(message);
    }
  },
};
