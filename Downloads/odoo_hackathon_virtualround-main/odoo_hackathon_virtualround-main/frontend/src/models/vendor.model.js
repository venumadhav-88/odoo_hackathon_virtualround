/**
 * Vendor domain model defining vendor master data.
 */
export class VendorModel {
  constructor({
    id = '',
    vendorCode = '',
    companyName = '',
    contactPerson = '',
    email = '',
    phone = '',
    gstNumber = '',
    address = '',
    city = '',
    state = '',
    country = '',
    postalCode = '',
    website = '',
    vendorType = '',
    status = 'active',
    rating = 0,
    notes = '',
    createdAt = '',
    updatedAt = '',
  } = {}) {
    this.id = id;
    this.vendorCode = vendorCode;
    this.companyName = companyName;
    this.contactPerson = contactPerson;
    this.email = email;
    this.phone = phone;
    this.gstNumber = gstNumber;
    this.address = address;
    this.city = city;
    this.state = state;
    this.country = country;
    this.postalCode = postalCode;
    this.website = website;
    this.vendorType = vendorType;
    this.status = status;
    this.rating = rating;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}