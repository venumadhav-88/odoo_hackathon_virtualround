import { MOCK_VENDORS } from '@/mocks/vendors.mock';

let vendors = [...MOCK_VENDORS];

const delay = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 301) + 500));

export const vendorRepository = {
  async getVendors() {
    await delay();
    return vendors.map((vendor) => ({ ...vendor }));
  },

  async createVendor(vendor) {
    await delay();

    const codeExists = vendors.some((item) => item.vendorCode.toLowerCase() === vendor.vendorCode.toLowerCase());
    if (codeExists) {
      throw new Error('Vendor code already exists. Please use a unique code.');
    }

    const emailExists = vendors.some((item) => item.email.toLowerCase() === vendor.email.toLowerCase());
    if (emailExists) {
      throw new Error('Vendor email already exists. Please use a unique email.');
    }

    const now = new Date().toISOString();
    const newVendor = {
      ...vendor,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    vendors.unshift(newVendor);
    return { ...newVendor };
  },

  async updateVendor(id, updatedData) {
    await delay();

    const index = vendors.findIndex((vendor) => vendor.id === id);
    if (index === -1) {
      throw new Error('Vendor not found.');
    }

    const codeExists = vendors.some(
      (vendor) => vendor.id !== id && vendor.vendorCode.toLowerCase() === updatedData.vendorCode.toLowerCase()
    );
    if (codeExists) {
      throw new Error('Vendor code already exists. Please use a unique code.');
    }

    const emailExists = vendors.some(
      (vendor) => vendor.id !== id && vendor.email.toLowerCase() === updatedData.email.toLowerCase()
    );
    if (emailExists) {
      throw new Error('Vendor email already exists. Please use a unique email.');
    }

    vendors[index] = {
      ...vendors[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    return { ...vendors[index] };
  },

  async deleteVendor(id) {
    await delay();

    const index = vendors.findIndex((vendor) => vendor.id === id);
    if (index === -1) {
      throw new Error('Vendor not found.');
    }

    const [deleted] = vendors.splice(index, 1);
    return { ...deleted };
  },
};