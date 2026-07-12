/**
 * Asset domain model defining the shape of an EAM asset entity.
 */
export class AssetModel {
  /**
   * @param {Object} [params={}]
   * @param {string} [params.id='']
   * @param {string} [params.assetCode='']
   * @param {string} [params.assetName='']
   * @param {string} [params.category='']
   * @param {string} [params.serialNumber='']
   * @param {string|null} [params.assignedTo=null]
   * @param {string} [params.purchaseDate='']
   * @param {number} [params.purchaseCost=0]
   * @param {string} [params.status='available']
   * @param {string} [params.location='']
   * @param {string} [params.manufacturer='']
   * @param {string} [params.warrantyExpiry='']
   * @param {string} [params.createdAt='']
   * @param {string} [params.updatedAt='']
   */
  constructor({
    id = '',
    assetCode = '',
    assetName = '',
    category = '',
    serialNumber = '',
    assignedTo = null,
    purchaseDate = '',
    purchaseCost = 0,
    status = 'available',
    location = '',
    manufacturer = '',
    warrantyExpiry = '',
    createdAt = '',
    updatedAt = '',
  } = {}) {
    this.id = id;
    this.assetCode = assetCode;
    this.assetName = assetName;
    this.category = category;
    this.serialNumber = serialNumber;
    this.assignedTo = assignedTo;
    this.purchaseDate = purchaseDate;
    this.purchaseCost = purchaseCost;
    this.status = status;
    this.location = location;
    this.manufacturer = manufacturer;
    this.warrantyExpiry = warrantyExpiry;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
