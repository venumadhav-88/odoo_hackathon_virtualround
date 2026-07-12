/**
 * Category domain model constructor mapping data objects.
 */
export class CategoryModel {
  /**
   * Creates a CategoryModel instance.
   * @param {Object} [params={}] - Parameters.
   * @param {string} [params.id=''] - Uniqueness identifier.
   * @param {string} [params.code=''] - Unique category short code.
   * @param {string} [params.name=''] - Display name.
   * @param {string} [params.description=''] - Metadata description.
   * @param {number} [params.assetCount=0] - Number of assigned assets.
   * @param {string} [params.status='active'] - Status (active, inactive).
   * @param {string} [params.createdAt=''] - Creation timestamp.
   * @param {string} [params.updatedAt=''] - Modification timestamp.
   */
  constructor({
    id = '',
    code = '',
    name = '',
    description = '',
    assetCount = 0,
    status = 'active',
    createdAt = '',
    updatedAt = '',
  } = {}) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.assetCount = assetCount;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
