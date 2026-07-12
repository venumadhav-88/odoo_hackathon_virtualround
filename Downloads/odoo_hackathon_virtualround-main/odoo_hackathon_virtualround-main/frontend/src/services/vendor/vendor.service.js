import { vendorRepository } from './vendor.repository';
import { vendorMapper } from './vendor.mapper';
import { notify } from '@/utils/notifications';
import { logger } from '@/utils/logger';
import { validateEmail, validatePhone } from '@/utils/validators';

const VENDOR_TYPES = [
  'Manufacturer',
  'Supplier',
  'Distributor',
  'Service Provider',
  'Repair Partner',
  'Rental Vendor',
  'Other',
];

const STATUS_VALUES = ['active', 'inactive', 'blocked'];
const GST_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/i;
const MAX_LENGTHS = {
  vendorCode: 20,
  companyName: 120,
  contactPerson: 80,
  email: 120,
  phone: 20,
  gstNumber: 15,
  address: 200,
  city: 80,
  state: 80,
  country: 80,
  postalCode: 12,
  website: 200,
  notes: 500,
};

function trimString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeVendorPayload(payload) {
  return {
    ...payload,
    vendorCode: trimString(payload.vendorCode),
    companyName: trimString(payload.companyName),
    contactPerson: trimString(payload.contactPerson),
    email: trimString(payload.email),
    phone: trimString(payload.phone),
    gstNumber: trimString(payload.gstNumber),
    address: trimString(payload.address),
    city: trimString(payload.city),
    state: trimString(payload.state),
    country: trimString(payload.country),
    postalCode: trimString(payload.postalCode),
    website: trimString(payload.website),
    vendorType: trimString(payload.vendorType),
    status: trimString(payload.status),
    notes: trimString(payload.notes),
    rating: payload.rating === '' || payload.rating === null || payload.rating === undefined ? '' : Number(payload.rating),
  };
}

function validateVendorPayload(payload) {
  const requiredFields = [
    'vendorCode',
    'companyName',
    'contactPerson',
    'email',
    'phone',
    'gstNumber',
    'address',
    'city',
    'state',
    'country',
    'postalCode',
    'vendorType',
    'status',
    'rating',
  ];

  for (const field of requiredFields) {
    if (payload[field] === '' || payload[field] === null || payload[field] === undefined) {
      throw new Error('Please fill out all required vendor fields.');
    }
  }

  Object.entries(MAX_LENGTHS).forEach(([field, maxLength]) => {
    if (payload[field] && String(payload[field]).length > maxLength) {
      throw new Error(`${field} cannot exceed ${maxLength} characters.`);
    }
  });

  if (!validateEmail(payload.email)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!validatePhone(payload.phone)) {
    throw new Error('Please enter a valid phone number.');
  }

  if (!GST_PATTERN.test(String(payload.gstNumber))) {
    throw new Error('Please enter a valid GST number.');
  }

  if (payload.website && !isValidWebsiteUrl(payload.website)) {
    throw new Error('Please enter a valid website URL.');
  }

  const numericRating = Number(payload.rating);
  if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new Error('Rating must be between 1 and 5.');
  }

  if (!VENDOR_TYPES.includes(payload.vendorType)) {
    throw new Error('Please select a valid vendor type.');
  }

  if (!STATUS_VALUES.includes(payload.status)) {
    throw new Error('Please select a valid vendor status.');
  }
}

function isValidWebsiteUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
export const VendorService = {
  async getVendors() {
    try {
      const data = await vendorRepository.getVendors();
      return data.map(vendorMapper.toDomain);
    } catch (error) {
      logger.error('VendorService.getVendors failed:', error);
      notify.error('Failed to load vendors.');
      throw error;
    }
  },

  async createVendor(formData) {
    try {
      const normalized = normalizeVendorPayload(formData);
      validateVendorPayload(normalized);
      const persisted = vendorMapper.toPersistence(normalized);
      const data = await vendorRepository.createVendor(persisted);
      notify.success('Vendor created successfully.');
      return vendorMapper.toDomain(data);
    } catch (error) {
      logger.error('VendorService.createVendor failed:', error);
      const message = error.message || 'Failed to create vendor.';
      notify.error(message);
      throw new Error(message);
    }
  },

  async updateVendor(id, formData) {
    try {
      const normalized = normalizeVendorPayload(formData);
      validateVendorPayload(normalized);
      const persisted = vendorMapper.toPersistence(normalized);
      const data = await vendorRepository.updateVendor(id, persisted);
      notify.success('Vendor updated successfully.');
      return vendorMapper.toDomain(data);
    } catch (error) {
      logger.error('VendorService.updateVendor failed:', error);
      const message = error.message || 'Failed to update vendor.';
      notify.error(message);
      throw new Error(message);
    }
  },

  async deleteVendor(id) {
    try {
      const data = await vendorRepository.deleteVendor(id);
      notify.success('Vendor deleted successfully.');
      return vendorMapper.toDomain(data);
    } catch (error) {
      logger.error('VendorService.deleteVendor failed:', error);
      const message = error.message || 'Failed to delete vendor.';
      notify.error(message);
      throw new Error(message);
    }
  },
};