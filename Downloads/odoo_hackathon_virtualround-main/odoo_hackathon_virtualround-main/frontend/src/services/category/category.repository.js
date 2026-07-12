import { MOCK_CATEGORIES } from '@/mocks/categories.mock';

let categories = [...MOCK_CATEGORIES];

/**
 * Mock database client simulating asset categories storage queries.
 * Employs local variables to preserve session updates until browser reloads.
 */
export const categoryRepository = {
  /**
   * Retrieves all registered categories.
   * @returns {Promise<Array>} Categories list.
   */
  getCategories() {
    return new Promise((resolve) => {
      const delay = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
      setTimeout(() => {
        resolve([...categories]);
      }, delay);
    });
  },

  /**
   * Registers a new asset category.
   * @param {Object} category - The raw input category data.
   * @returns {Promise<Object>} The persisted category row.
   */
  createCategory(category) {
    return new Promise((resolve, reject) => {
      const delay = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
      setTimeout(() => {
        const isCodeDuplicate = categories.some(
          (c) => c.code.toLowerCase() === category.code.toLowerCase()
        );
        if (isCodeDuplicate) {
          reject(new Error('Category code must be unique.'));
          return;
        }

        const newCategory = {
          ...category,
          id: `cat-${Date.now()}`,
          assetCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        categories.unshift(newCategory);
        resolve(newCategory);
      }, delay);
    });
  },

  /**
   * Updates an existing asset category specifications.
   * @param {string} id - Target unique identifier.
   * @param {Object} updatedData - Modified parameters.
   * @returns {Promise<Object>} The updated category row.
   */
  updateCategory(id, updatedData) {
    return new Promise((resolve, reject) => {
      const delay = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
      setTimeout(() => {
        const index = categories.findIndex((c) => c.id === id);
        if (index === -1) {
          reject(new Error('Category not found.'));
          return;
        }

        const isCodeDuplicate = categories.some(
          (c) => c.id !== id && c.code.toLowerCase() === updatedData.code.toLowerCase()
        );
        if (isCodeDuplicate) {
          reject(new Error('Category code must be unique.'));
          return;
        }

        categories[index] = {
          ...categories[index],
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };
        resolve(categories[index]);
      }, delay);
    });
  },

  /**
   * Permanently deletes a category from local memory list.
   * @param {string} id - Target identifier.
   * @returns {Promise<Object>} The deleted category representation.
   */
  deleteCategory(id) {
    return new Promise((resolve, reject) => {
      const delay = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
      setTimeout(() => {
        const index = categories.findIndex((c) => c.id === id);
        if (index === -1) {
          reject(new Error('Category not found.'));
          return;
        }
        const deleted = categories[index];
        categories = categories.filter((c) => c.id !== id);
        resolve(deleted);
      }, delay);
    });
  },
};
