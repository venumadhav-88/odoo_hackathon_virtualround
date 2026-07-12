import { MOCK_ASSETS } from '@/mocks/assets.mock';

let assets = [...MOCK_ASSETS];

const delay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * 301) + 500)
  );

/**
 * In-memory mock repository for asset CRUD operations.
 * Session-scoped: data resets on page refresh.
 */
export const assetRepository = {
  /**
   * Retrieves all assets.
   * @returns {Promise<Array>} List of raw asset records.
   */
  async getAssets() {
    await delay();
    return [...assets];
  },

  /**
   * Creates a new asset record.
   * Rejects if asset code is already taken.
   * @param {Object} asset - Raw asset data to persist.
   * @returns {Promise<Object>} Newly created asset record.
   */
  async createAsset(asset) {
    await delay();
    const isDuplicate = assets.some(
      (a) => a.assetCode.toLowerCase() === asset.assetCode.toLowerCase()
    );
    if (isDuplicate) {
      throw new Error('Asset code already exists. Please use a unique code.');
    }
    const newAsset = {
      ...asset,
      id: `ast-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    assets.unshift(newAsset);
    return newAsset;
  },

  /**
   * Updates an existing asset by ID.
   * Rejects if the new code conflicts with another record.
   * @param {string} id - Target asset identifier.
   * @param {Object} updatedData - Fields to update.
   * @returns {Promise<Object>} Updated asset record.
   */
  async updateAsset(id, updatedData) {
    await delay();
    const index = assets.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Asset not found.');

    const isDuplicate = assets.some(
      (a) => a.id !== id && a.assetCode.toLowerCase() === updatedData.assetCode.toLowerCase()
    );
    if (isDuplicate) {
      throw new Error('Asset code already exists. Please use a unique code.');
    }

    assets[index] = { ...assets[index], ...updatedData, updatedAt: new Date().toISOString() };
    return assets[index];
  },

  /**
   * Deletes an asset by ID.
   * @param {string} id - Target asset identifier.
   * @returns {Promise<Object>} The deleted asset record.
   */
  async deleteAsset(id) {
    await delay();
    const index = assets.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Asset not found.');
    const [deleted] = assets.splice(index, 1);
    return deleted;
  },
};
