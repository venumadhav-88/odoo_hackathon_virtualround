import { categoryRepository } from './category.repository';
import { categoryMapper } from './category.mapper';
import { notify } from '@/utils/notifications';
import { logger } from '@/utils/logger';

/**
 * Service orchestrating Asset Category operations.
 * Connects presenting layers to mock repositories and standardizes user feedback notifications.
 */
export const CategoryService = {
  /**
   * Fetches all categories mapped to CategoryModel class instances.
   * @returns {Promise<Array>} Normalized category list.
   */
  async getCategories() {
    try {
      const data = await categoryRepository.getCategories();
      return data.map(categoryMapper.toDomain);
    } catch (error) {
      logger.error('CategoryService getCategories operation failed:', error);
      notify.error('Failed to retrieve categories.');
      throw error;
    }
  },

  /**
   * Saves a new asset category.
   * @param {Object} categoryData - Raw form category input fields.
   * @returns {Promise<CategoryModel>} The new category domain entity.
   */
  async createCategory(categoryData) {
    try {
      const persisted = categoryMapper.toPersistence(categoryData);
      const data = await categoryRepository.createCategory(persisted);
      notify.success('Category created successfully.');
      return categoryMapper.toDomain(data);
    } catch (error) {
      logger.error('CategoryService createCategory operation failed:', error);
      const displayMessage = error.message || 'Failed to create category.';
      notify.error(displayMessage);
      throw new Error(displayMessage);
    }
  },

  /**
   * Updates an existing category's attributes.
   * @param {string} id - Target identifier.
   * @param {Object} categoryData - Form input updates.
   * @returns {Promise<CategoryModel>} The modified category domain entity.
   */
  async updateCategory(id, categoryData) {
    try {
      const persisted = categoryMapper.toPersistence(categoryData);
      const data = await categoryRepository.updateCategory(id, persisted);
      notify.success('Category updated successfully.');
      return categoryMapper.toDomain(data);
    } catch (error) {
      logger.error('CategoryService updateCategory operation failed:', error);
      const displayMessage = error.message || 'Failed to update category.';
      notify.error(displayMessage);
      throw new Error(displayMessage);
    }
  },

  /**
   * Deletes a category.
   * @param {string} id - Target identifier.
   * @returns {Promise<CategoryModel>} The deleted category domain representation.
   */
  async deleteCategory(id) {
    try {
      const data = await categoryRepository.deleteCategory(id);
      notify.success('Category deleted successfully.');
      return categoryMapper.toDomain(data);
    } catch (error) {
      logger.error('CategoryService deleteCategory operation failed:', error);
      const displayMessage = error.message || 'Failed to delete category.';
      notify.error(displayMessage);
      throw new Error(displayMessage);
    }
  },
};
